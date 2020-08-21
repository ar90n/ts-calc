import { Transform, TransformOptions, TransformCallback } from 'stream';

import {
  hasKindAndValue,
  isZero,
  isNonZeroDigit,
  isPlus,
  isMinus,
  isMult,
  isDiv,
  //  isDot,
  isDelimiter,
} from './lexer';

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
  //  DELIMITER,
} from './lexer.type';

import {
  SIGN,
  DIGIT,
  naturalNumberTag,
  NATURAL_NUMBER,
  INTEGRAL_NUMBER,
  fractionTag,
  FRACTION,
  numberTag,
  NUMBER,
  OP0,
  OP1,
  rhExprTag,
  RH_EXPR,
  exprTag,
  EXPR,
  rhTermTag,
  RH_TERM,
  termTag,
  TERM,
  callTag,
  CALL,
  FACTOR,
} from './parser.type';

export class DropDelimiterTransform extends Transform {
  _transform(chunk: string | Buffer, encoding: string, done: TransformCallback): void {
    if (!isDelimiter(chunk)) {
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

export const isSign = (t: any): t is SIGN => isPlus(t) || isMinus(t);
export const isDigit = (t: any): t is DIGIT => isZero(t) || isNonZeroDigit(t);
export const isNaturalNumber = (t: any): t is NATURAL_NUMBER =>
  hasKindAndValue(t) && t.kind === naturalNumberTag;
export const isIntegralNumbver = (t: any): t is INTEGRAL_NUMBER => isNaturalNumber(t) || isZero(t);
export const isFraction = (t: any): t is FRACTION => hasKindAndValue(t) && t.kind === fractionTag;
export const isNumber = (t: any): t is NUMBER => hasKindAndValue(t) && t.kind === numberTag;
export const isOP0 = (t: any): t is OP0 => isPlus(t) || isMinus(t);
export const isOP1 = (t: any): t is OP1 => isMult(t) || isDiv(t);
export const isRhExpr = (t: any): t is RH_EXPR => hasKindAndValue(t) && t.kind === rhExprTag;
export const isExpr = (t: any): t is EXPR => hasKindAndValue(t) && t.kind === exprTag;
export const isRhTerm = (t: any): t is RH_TERM => hasKindAndValue(t) && t.kind === rhTermTag;
export const isTerm = (t: any): t is TERM => hasKindAndValue(t) && t.kind === termTag;
export const isCall = (t: any): t is CALL => hasKindAndValue(t) && t.kind === callTag;
export const isFactor = (t: any): t is FACTOR => isCall(t) || isNumber(t);

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
      if (isSign(chunk)) {
        this.sign = chunk;
        done();
        return;
      }
      this.sign = null;
    }

    if (this.state === 'non_zero_digit') {
      if (isNonZeroDigit(chunk)) {
        this.state = 'digits';
        this.non_zero_digit = (chunk as unknown) as NON_ZERO_DIGIT;
        done();
        return;
      }
    }

    if (this.state === 'digits') {
      if (isDigit(chunk)) {
        this.digits.push(chunk);
        done();
        return;
      } else {
        this.state = 'sign';
        this.push({
          kind: naturalNumberTag,
          value: [this.sign, this.non_zero_digit, this.digits],
        });
        done();
        return;
      }
    }

    //raise here
    done();
  }

  _flush(done: TransformCallback): void {
    if (this.state === 'digits') {
      this.push({
        kind: naturalNumberTag,
        value: [this.sign, this.non_zero_digit, this.digits],
      });
      done();
      return;
    }

    //raise here
    done();
  }
}
