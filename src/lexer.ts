import { Transform, TransformOptions, TransformCallback } from 'stream';

import {
  TOKEN,
  TokenizeResult,
  tokenizeDelimiter,
  tokenizeZero,
  tokenizeNonZeroDigit,
  tokenizePlus,
  tokenizeMinus,
  tokenizeMult,
  tokenizeDiv,
  tokenizeDot,
  tokenizeFunction,
  tokenizeLeftParen,
  tokenizeRightParen,
} from './lexer.type';

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
