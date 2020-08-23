import { Transform, TransformOptions, TransformCallback } from 'stream';

import {
  //  ZERO,
  NON_ZERO_DIGIT,
  //  PLUS,
  //  MINUS,
  //  MULT,
  //  DIV,
  //  DOT,
  //  FUNCTION,
  //  LEFT_PAREN,
  //  RIGHT_PAREN,
  DELIMITER,
} from './lexer.type';

import {
  SIGN,
  DIGIT,
  NATURAL_NUMBER,
  //INTEGRAL_NUMBER,
  //FRACTION,
  //NUMBER,
  //OP0,
  //OP1,
  //RH_EXPR,
  //EXPR,
  //RH_TERM,
  //TERM,
  //CALL,
  //FACTOR,
} from './parser.type';

export class DropDelimiterTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (!DELIMITER.is(chunk)) {
      this.push(chunk);
    }

    done();
  }
}

export class ParseExprTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    this.push(chunk);
    done();
  }
}

export class ParseFactorTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    this.push(chunk);
    done();
  }
}

export class ParseNaturalNumbreaTransform extends Transform {
  static readonly stateValues = ['sign', 'non_zero_digit', 'digits'] as const;
  state: typeof ParseNaturalNumbreaTransform.stateValues[number];
  sign: SIGN | null;
  non_zero_digit?: NON_ZERO_DIGIT;
  digits: DIGIT[];

  constructor(opt?: TransformOptions) {
    super(opt);

    this.state = 'sign' as const;
    this.sign = null;
    this.non_zero_digit = undefined;
    this.digits = [];
  }

  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (this.state === 'sign') {
      this.state = 'non_zero_digit';
      if (SIGN.is(chunk)) {
        this.sign = chunk;
        done();
        return;
      }
      this.sign = null;
    }

    if (this.state === 'non_zero_digit') {
      if (NON_ZERO_DIGIT.is(chunk)) {
        this.state = 'digits';
        this.non_zero_digit = (chunk as unknown) as NON_ZERO_DIGIT;
        done();
        return;
      }
    }

    if (this.state === 'digits' && this.non_zero_digit !== undefined) {
      if (DIGIT.is(chunk)) {
        this.digits.push(chunk);
        done();
        return;
      } else {
        this.state = 'sign';
        this.push(NATURAL_NUMBER.of(this.sign, this.non_zero_digit, this.digits));
        done();
        return;
      }
    }

    //raise here
    done();
  }

  _flush(done: TransformCallback): void {
    if (this.state === 'digits' && this.non_zero_digit !== undefined) {
      this.push(NATURAL_NUMBER.of(this.sign, this.non_zero_digit, this.digits));
      done();
      return;
    }

    //raise here
    done();
  }
}
