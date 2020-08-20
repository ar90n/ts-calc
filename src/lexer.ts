import { Transform, TransformOptions, TransformCallback } from 'stream';

import {
  TOKEN,
  ParseResult,
  parseDelimiter,
  parseZero,
  parseNonZeroDigit,
  parsePlus,
  parseMinus,
  parseMult,
  parseDiv,
  parseDot,
  parseFunction,
  parseLeftParen,
  parseRightParen,
} from './lexer.type';

class ParseTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (typeof chunk === 'string') {
      const res = this._parse(chunk);
      if (res.status === 'success') {
        this.push(res.token);
        done();
        return;
      }
    }

    this.push(chunk);
    done();
  }
  _parse(_chunk: string): ParseResult<TOKEN> {
    return { status: 'failure' };
  }
}

export class ParseFunctionTransform extends Transform {
  acc: string;

  constructor(opts?: TransformOptions) {
    super(opts);
    this.acc = '';
  }

  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (typeof chunk === 'string') {
      const res = parseFunction(this.acc + chunk);
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

export class ParseZeroTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseZero(chunk);
  }
}

export class ParseNonZeroDigitTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseNonZeroDigit(chunk);
  }
}

export class ParsePlusTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parsePlus(chunk);
  }
}

export class ParseMinusTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseMinus(chunk);
  }
}

export class ParseMultTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseMult(chunk);
  }
}

export class ParseDivTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseDiv(chunk);
  }
}

export class ParseDotTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseDot(chunk);
  }
}

export class ParseLeftParenTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseLeftParen(chunk);
  }
}

export class ParseRightParenTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseRightParen(chunk);
  }
}

export class ParseDelimiterTransform extends ParseTransform {
  _parse(chunk: string): ParseResult<TOKEN> {
    return parseDelimiter(chunk);
  }
}
