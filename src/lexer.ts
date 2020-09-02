import { Transform, TransformOptions, TransformCallback } from 'stream';

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
  TOKEN,
} from './lexer.type';

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

const tokenizeToken = <T extends Pick<T, 'kind' | 'value'>>(
  value: string,
  obj: { tag: T['kind']; values: readonly T['value'][] },
): TokenizeResult<T> => {
  if (!obj.values.includes((value as unknown) as T['value'])) {
    return { status: 'failure' };
  }

  return {
    status: 'success',
    token: {
      kind: obj.tag,
      value: (value as unknown) as T['value'],
    } as T,
  };
};

export const tokenizeFunction: tokenTokenizer<FUNCTION> = (value: string) => {
  for (const exp of FUNCTION.values) {
    if (exp === value) {
      return {
        status: 'success',
        token: {
          kind: FUNCTION.tag,
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
export const tokenizeZero: tokenTokenizer<ZERO> = (value: string) => tokenizeToken(value, ZERO);
export const tokenizeNonZeroDigit: tokenTokenizer<NON_ZERO_DIGIT> = (value: string) =>
  tokenizeToken(value, NON_ZERO_DIGIT);
export const tokenizePlus: tokenTokenizer<PLUS> = (value: string) => tokenizeToken(value, PLUS);
export const tokenizeMinus: tokenTokenizer<MINUS> = (value: string) => tokenizeToken(value, MINUS);
export const tokenizeMult: tokenTokenizer<MULT> = (value: string) => tokenizeToken(value, MULT);
export const tokenizeDiv: tokenTokenizer<DIV> = (value: string) => tokenizeToken(value, DIV);
export const tokenizeDot: tokenTokenizer<DOT> = (value: string) => tokenizeToken(value, DOT);
export const tokenizeLeftParen: tokenTokenizer<LEFT_PAREN> = (value: string) =>
  tokenizeToken(value, LEFT_PAREN);
export const tokenizeRightParen: tokenTokenizer<RIGHT_PAREN> = (value: string) =>
  tokenizeToken(value, RIGHT_PAREN);
export const tokenizeDelimiter: tokenTokenizer<DELIMITER> = (value: string) =>
  tokenizeToken(value, DELIMITER);

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

export class DropDelimiterTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (!DELIMITER.is(chunk)) {
      this.push(chunk);
    }

    done();
  }
}
