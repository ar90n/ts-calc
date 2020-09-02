import { Transform, TransformCallback } from 'stream';
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
  DELIMITER,
} from './lexer.type';

import { NATURAL_NUMBER, FRACTION, NUMBER, EXPR, TERM, CALL, NODE } from './parser.type';

export class DropDelimiterTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (!DELIMITER.is(chunk)) {
      this.push(chunk);
    }

    done();
  }
}

const parserStatusValues = ['ok', 'failed'];
type ParserStatus = typeof parserStatusValues[number];

type ParserResult = {
  status: ParserStatus;
  consumedNodes: number;
  output: NODE | NODE[] | null;
};

const ParseFailed: ParserResult = {
  status: 'failed',
  consumedNodes: 0,
  output: null,
};

const createBasicParser = (p: any) => (v: NODE[]) => {
  if (0 === v.length) {
    return ParseFailed;
  }

  if (v[0].kind === p.tag) {
    return {
      status: 'ok',
      consumedNodes: 1,
      output: v[0],
    };
  }

  return ParseFailed;
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

const Optional = (p: any) => {
  return (v: NODE[]) => {
    const ret = p(v);
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

const Repeat = (p: any) => {
  return (v: NODE[]) => {
    let consumedNodes = 0;
    const output = [];
    /* eslint no-constant-condition: 0 */
    while (true) {
      const cur = p(v.slice(consumedNodes));
      if (cur.status !== 'ok') {
        return {
          status: 'ok',
          consumedNodes: consumedNodes,
          output: output,
        };
      }

      consumedNodes += cur.consumedNodes;
      output.push(cur.output);
    }
  };
};

const Sequence = (ps: any[]) => {
  return (v: NODE[]) => {
    const ret = { ...ParseFailed };
    for (const p of ps) {
      const cur = p(v.slice(ret.consumedNodes));
      if (cur.status !== 'ok') {
        return ParseFailed;
      }

      ret.status = 'ok';
      ret.consumedNodes += cur.consumedNodes;
      if (ret.output === null) {
        ret.output = [];
      }
      if (ret.output instanceof Array) {
        ret.output.push(cur.output);
      }
    }

    return ret;
  };
};

const Or = (ps: any[]) => {
  return (v: NODE[]) => {
    for (const p of ps) {
      const ret = p(v);
      if (ret.status === 'ok') {
        return ret;
      }
    }

    return ParseFailed;
  };
};

const Lazy = (): [any, any] => {
  let p: any = null;
  return [
    (v: NODE[]) => {
      return p(v);
    },
    (q: any) => {
      p = q;
    },
  ];
};

const Just = (kind: any, p: any) => {
  return (v: NODE[]) => {
    const { status, consumedNodes, output } = p(v);
    return {
      status,
      consumedNodes,
      output: {
        kind: kind,
        value: output,
      },
    };
  };
};

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
export const parseTerm = Just(
  TERM.tag,
  Sequence([_parseFactor, Optional(Sequence([parseOp1, _parseTerm]))]),
);
export const parseFactor = Or([
  Just(CALL.tag, Sequence([Optional(parseFunction), parseLeftParen, parseExpr, parseRightParen])),
  parseNumber,
]);

setParseExpr(parseExpr);
setParseTerm(parseTerm);
setParseFactor(parseFactor);
