import { Transform, TransformOptions, TransformCallback } from 'stream';

import {
  zeroTag,
  zeroValues,
  ZERO,
  nonZeroDigitTag,
  nonZeroDigitValues,
  NON_ZERO_DIGIT,
  plusTag,
  plusValues,
  PLUS,
  minusTag,
  minusValues,
  MINUS,
  multTag,
  multValues,
  MULT,
  divTag,
  divValues,
  DIV,
  dotTag,
  dotValues,
  DOT,
  functionTag,
  functionValues,
  FUNCTION,
  leftParenTag,
  leftParenValues,
  LEFT_PAREN,
  rightParenTag,
  rightParenValues,
  RIGHT_PAREN,
  delimtierTag,
  delimiterValues,
  DELIMITER,
  TOKEN,
} from './lexer.type';

export const hasKindAndValue = (v: unknown): v is { kind: unknown; value: unknown } => {
  return v instanceof Object && 'kind' in v && 'value' in v;
};

export const isZero = (v: unknown): v is ZERO => hasKindAndValue(v) && v.kind === zeroTag;
export const isNonZeroDigit = (v: unknown): v is NON_ZERO_DIGIT =>
  hasKindAndValue(v) && v.kind === nonZeroDigitTag;
export const isPlus = (v: unknown): v is PLUS => hasKindAndValue(v) && v.kind === plusTag;
export const isMinus = (v: unknown): v is MINUS => hasKindAndValue(v) && v.kind === minusTag;
export const isMult = (v: unknown): v is MULT => hasKindAndValue(v) && v.kind === multTag;
export const isDiv = (v: unknown): v is DIV => hasKindAndValue(v) && v.kind === divTag;
export const isDot = (v: unknown): v is DOT => hasKindAndValue(v) && v.kind === dotTag;
export const isFunction = (v: unknown): v is FUNCTION =>
  hasKindAndValue(v) && v.kind === functionTag;
export const isLeftParen = (v: unknown): v is LEFT_PAREN =>
  hasKindAndValue(v) && v.kind === leftParenTag;
export const isRightParen = (v: unknown): v is RIGHT_PAREN =>
  hasKindAndValue(v) && v.kind === rightParenTag;
export const isDelimiter = (v: unknown): v is DELIMITER =>
  hasKindAndValue(v) && v.kind === delimtierTag;

export type Success<T> = {
  status: 'success';
  token: T;
};

export type Failure = {
  status: 'failure';
};

export type Tbd = {
  status: 'tbd';
};
export type TokenizeResult<T> = Success<T> | Failure | Tbd;

const tokenizeToken = <K, U, T extends { kind: K; value: U }>(
  value: string,
  kind: K,
  expects: readonly U[],
): TokenizeResult<T> => {
  if (!expects.includes((value as unknown) as U)) {
    return { status: 'failure' };
  }

  return {
    status: 'success',
    token: {
      kind: (kind as unknown) as K,
      value: (value as unknown) as U,
    } as T,
  };
};

export const tokenizeFunction: tokenTokenizer<FUNCTION> = (value: string) => {
  for (const exp of functionValues) {
    if (exp === value) {
      return {
        status: 'success',
        token: {
          kind: functionTag,
          value: value as FUNCTION['value'],
        },
      };
    }
    if (exp.startsWith(value)) {
      return {
        status: 'tbd',
      };
    }
  }

  return {
    status: 'failure',
  };
};

type tokenTokenizer<T> = (value: string) => TokenizeResult<T>;
export const tokenizeZero: tokenTokenizer<ZERO> = (value: string) =>
  tokenizeToken(value, zeroTag, zeroValues);
export const tokenizeNonZeroDigit: tokenTokenizer<NON_ZERO_DIGIT> = (value: string) =>
  tokenizeToken(value, nonZeroDigitTag, nonZeroDigitValues);
export const tokenizePlus: tokenTokenizer<PLUS> = (value: string) =>
  tokenizeToken(value, plusTag, plusValues);
export const tokenizeMinus: tokenTokenizer<MINUS> = (value: string) =>
  tokenizeToken(value, minusTag, minusValues);
export const tokenizeMult: tokenTokenizer<MULT> = (value: string) =>
  tokenizeToken(value, multTag, multValues);
export const tokenizeDiv: tokenTokenizer<DIV> = (value: string) =>
  tokenizeToken(value, divTag, divValues);
export const tokenizeDot: tokenTokenizer<DOT> = (value: string) =>
  tokenizeToken(value, dotTag, dotValues);
export const tokenizeLeftParen: tokenTokenizer<LEFT_PAREN> = (value: string) =>
  tokenizeToken(value, leftParenTag, leftParenValues);
export const tokenizeRightParen: tokenTokenizer<RIGHT_PAREN> = (value: string) =>
  tokenizeToken(value, rightParenTag, rightParenValues);
export const tokenizeDelimiter: tokenTokenizer<DELIMITER> = (value: string) =>
  tokenizeToken(value, delimtierTag, delimiterValues);

export const tokenOf = (kind: TOKEN['kind'], value: TOKEN['value']): TOKEN => {
  return { kind, value } as TOKEN;
};

class TokenizeTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (typeof chunk === 'string') {
      const res = this._tokenize(chunk);
      if (res.status === 'success') {
        this.push(res.token);
        done();
        return;
      }
    }

    this.push(chunk);
    done();
  }
  _tokenize(_chunk: string): TokenizeResult<TOKEN> {
    return { status: 'failure' };
  }
}

export class TokenizeFunctionTransform extends Transform {
  acc: string;

  constructor(opts?: TransformOptions) {
    super(opts);
    this.acc = '';
  }

  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (typeof chunk === 'string') {
      const res = tokenizeFunction(this.acc + chunk);
      if (res.status === 'success') {
        this.push(res.token);
        this.acc = '';
        done();
        return;
      } else if (res.status === 'tbd') {
        this.acc += chunk;
        done();
        return;
      }
    }

    if (this.acc !== '') {
      for (const s of this.acc) {
        this.push(s);
      }
      this.acc = '';
    }
    this.push(chunk);
    done();
  }

  _flush(done: TransformCallback): void {
    if (this.acc !== '') {
      for (const s of this.acc) {
        this.push(s);
      }
      this.acc = '';
    }
    done();
  }
}

export class TokenizeZeroTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeZero(chunk);
  }
}

export class TokenizeNonZeroDigitTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeNonZeroDigit(chunk);
  }
}

export class TokenizePlusTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizePlus(chunk);
  }
}

export class TokenizeMinusTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeMinus(chunk);
  }
}

export class TokenizeMultTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeMult(chunk);
  }
}

export class TokenizeDivTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeDiv(chunk);
  }
}

export class TokenizeDotTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeDot(chunk);
  }
}

export class TokenizeLeftParenTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeLeftParen(chunk);
  }
}

export class TokenizeRightParenTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeRightParen(chunk);
  }
}

export class TokenizeDelimiterTransform extends TokenizeTransform {
  _tokenize(chunk: string): TokenizeResult<TOKEN> {
    return tokenizeDelimiter(chunk);
  }
}
