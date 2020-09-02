import {
  ZERO,
  NON_ZERO_DIGIT,
  PLUS,
  MINUS,
  MULT,
  DIV,
  DOT,
  FUNCTION,
  LEFT_PAREN,
  RIGHT_PAREN,
} from './lexer.type';

import { NATURAL_NUMBER, FRACTION, NUMBER, EXPR, TERM, CALL, NODE } from './parser.type';

const parserStatusValues = ['ok', 'failed'];
type ParserStatus = typeof parserStatusValues[number];

type Output<T> = T | null | Output<T>[];

type ParserResult = {
  status: ParserStatus;
  consumedNodes: number;
  output: Output<NODE>;
};

type Parser = (v: NODE[]) => ParserResult;

const ParseFailed: ParserResult = {
  status: 'failed',
  consumedNodes: 0,
  output: null,
};

const createBasicParser = ({ tag }: { tag: NODE['kind'] }) => (v: NODE[]) => {
  if (0 < v.length && v[0].kind === tag) {
    return {
      status: 'ok',
      consumedNodes: 1,
      output: v[0],
    };
  }

  return ParseFailed;
};

const Optional = (parser: Parser): Parser => {
  return (v: NODE[]) => {
    const ret = parser(v);
    if (ret.status === 'ok') {
      return ret;
    }

    return {
      status: 'ok',
      consumedNodes: 0,
      output: null,
    };
  };
};

const Repeat = (parser: Parser): Parser => {
  return (v: NODE[]) => {
    let consumedNodes = 0;
    const output = [];
    /* eslint no-constant-condition: 0 */
    while (true) {
      const cur = parser(v.slice(consumedNodes));
      if (cur.status !== 'ok') {
        return {
          status: 'ok' as ParserStatus,
          consumedNodes: consumedNodes,
          output: output,
        };
      }

      consumedNodes += cur.consumedNodes;
      output.push(cur.output);
    }
  };
};

const Sequence = (parsers: Parser[]): Parser => {
  return (v: NODE[]) => {
    let consumedNodes = 0;
    const output = [];
    for (const p of parsers) {
      const cur = p(v.slice(consumedNodes));
      if (cur.status !== 'ok') {
        return ParseFailed;
      }

      consumedNodes += cur.consumedNodes;
      output.push(cur.output);
    }

    return {
      status: 'ok',
      consumedNodes: consumedNodes,
      output: output,
    };
  };
};

const Or = (parsers: Parser[]): Parser => {
  return (v: NODE[]) => {
    for (const p of parsers) {
      const ret = p(v);
      if (ret.status === 'ok') {
        return ret;
      }
    }

    return ParseFailed;
  };
};

const Lazy = (): [Parser, (q: Parser) => void] => {
  let p: Parser = () => ParseFailed;
  return [
    (v: NODE[]) => p(v),
    (q: Parser) => {
      p = q;
    },
  ];
};

const Just = (kind: NODE['kind'], parser: Parser): Parser => {
  return (v: NODE[]) => {
    const { status, consumedNodes, output } = parser(v);
    return {
      status,
      consumedNodes,
      output: {
        kind: kind,
        value: output,
      },
    } as ParserResult;
  };
};

export const parseZero = createBasicParser(ZERO);
export const parseNonZeroDigit = createBasicParser(NON_ZERO_DIGIT);
export const parsePlus = createBasicParser(PLUS);
export const parseMinus = createBasicParser(MINUS);
export const parseMult = createBasicParser(MULT);
export const parseDiv = createBasicParser(DIV);
export const parseDot = createBasicParser(DOT);
export const parseFunction = createBasicParser(FUNCTION);
export const parseLeftParen = createBasicParser(LEFT_PAREN);
export const parseRightParen = createBasicParser(RIGHT_PAREN);
export const parseSign = Or([parsePlus, parseMinus]);
export const parseDigit = Or([parseZero, parseNonZeroDigit]);
export const parseOp0 = parseSign;
export const parseOp1 = Or([parseMult, parseDiv]);
export const parseNaturalNumber = Just(
  NATURAL_NUMBER.tag,
  Sequence([Optional(parseSign), parseNonZeroDigit, Repeat(parseDigit)]),
);
export const parseIntegralNumber = Or([parseNaturalNumber, parseZero]);
export const parseFraction = Just(FRACTION.tag, Sequence([parseDot, Repeat(parseDigit)]));
export const parseNumber = Just(
  NUMBER.tag,
  Sequence([parseIntegralNumber, Optional(parseFraction)]),
);

const [_parseExpr, setParseExpr] = Lazy();
const [_parseTerm, setParseTerm] = Lazy();
const [_parseFactor, setParseFactor] = Lazy();
export const parseExpr = Just(
  EXPR.tag,
  Sequence([_parseTerm, Optional(Sequence([parseOp0, _parseExpr]))]),
);
setParseExpr(parseExpr);
export const parseTerm = Just(
  TERM.tag,
  Sequence([_parseFactor, Optional(Sequence([parseOp1, _parseTerm]))]),
);
setParseTerm(parseTerm);
export const parseFactor = Or([
  Just(CALL.tag, Sequence([Optional(parseFunction), parseLeftParen, parseExpr, parseRightParen])),
  parseNumber,
]);
setParseFactor(parseFactor);
