import { hasKindAndValue } from './util';

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
  TOKEN,
} from './lexer.type';

export type SIGN = PLUS | MINUS;
export const SIGN = {
  is: (v: unknown): v is SIGN => PLUS.is(v) || MINUS.is(v),
};

export type DIGIT = ZERO | NON_ZERO_DIGIT;
export const DIGIT = {
  is: (v: unknown): v is DIGIT => ZERO.is(v) || NON_ZERO_DIGIT.is(v),
};

const naturalNumberTag = 'natural_number' as const;
export type NATURAL_NUMBER = {
  kind: typeof naturalNumberTag;
  value: [SIGN | null, NON_ZERO_DIGIT, DIGIT[]];
};
export const NATURAL_NUMBER = {
  tag: naturalNumberTag,
  of: (sign: SIGN | null, firstDigit: NON_ZERO_DIGIT, otherDigits: DIGIT[]) =>
    ({
      kind: NATURAL_NUMBER.tag,
      value: [sign, firstDigit, otherDigits],
    } as NATURAL_NUMBER),
  is: (v: unknown): v is NATURAL_NUMBER => hasKindAndValue(v) && v.kind === NATURAL_NUMBER.tag,
};

export type INTEGRAL_NUMBER = NATURAL_NUMBER | ZERO;
export const INTEGRAL_NUMBER = {
  is: (v: unknown): v is DIGIT => NATURAL_NUMBER.is(v) || ZERO.is(v),
};

const fractionTag = 'fraction' as const;
export type FRACTION = {
  kind: typeof fractionTag;
  value: [DOT, DIGIT[]];
};
export const FRACTION = {
  tag: fractionTag,
  of: (dot: DOT, digits: DIGIT[]) =>
    ({
      kind: FRACTION.tag,
      value: [dot, digits],
    } as FRACTION),
  is: (v: unknown): v is FRACTION => hasKindAndValue(v) && v.kind === FRACTION.tag,
};

const numberTag = 'number' as const;
export type NUMBER = {
  kind: typeof numberTag;
  value: [INTEGRAL_NUMBER, FRACTION];
};
export const NUMBER = {
  tag: numberTag,
  of: (int: INTEGRAL_NUMBER, fraction: FRACTION) =>
    ({
      kind: NUMBER.tag,
      value: [int, fraction],
    } as NUMBER),
  is: (v: unknown): v is NUMBER => hasKindAndValue(v) && v.kind === NUMBER.tag,
};

export type OP0 = PLUS | MINUS;
export const OP0 = {
  is: (v: unknown): v is OP0 => PLUS.is(v) || MINUS.is(v),
};

export type OP1 = MULT | DIV;
export const OP1 = {
  is: (v: unknown): v is OP0 => MULT.is(v) || DIV.is(v),
};

const exprTag = 'expr' as const;
export type EXPR = {
  kind: typeof exprTag;
  value: [TERM, [OP0, TERM][]];
};
export const EXPR = {
  tag: exprTag,
  of: (term: TERM, rhExpr: [OP0, TERM][]) =>
    ({
      kind: EXPR.tag,
      value: [term, rhExpr],
    } as EXPR),
  is: (v: unknown): v is EXPR => hasKindAndValue(v) && v.kind === EXPR.tag,
};

const termTag = 'term' as const;
export type TERM = {
  kind: typeof termTag;
  value: [FACTOR, [OP1, FACTOR][]];
};
export const TERM = {
  tag: termTag,
  of: (factor: FACTOR, rhTerm: [OP1, FACTOR][]) =>
    ({
      kind: TERM.tag,
      value: [factor, rhTerm],
    } as TERM),
  is: (v: unknown): v is TERM => hasKindAndValue(v) && v.kind === TERM.tag,
};

const callTag = 'call' as const;
export type CALL = {
  kind: typeof callTag;
  value: [FUNCTION | null, LEFT_PAREN, EXPR, RIGHT_PAREN];
};
export const CALL = {
  tag: callTag,
  of: (func: FUNCTION | null, expr: EXPR) =>
    ({
      kind: CALL.tag,
      value: [func, LEFT_PAREN.of(), expr, RIGHT_PAREN.of()],
    } as CALL),
  is: (v: unknown): v is CALL => hasKindAndValue(v) && v.kind === CALL.tag,
};

export type FACTOR = CALL | NUMBER;
export const FACTOR = {
  is: (v: unknown): v is FACTOR => CALL.is(v) || NUMBER.is(v),
};

export type NODE =
  | SIGN
  | DIGIT
  | NATURAL_NUMBER
  | INTEGRAL_NUMBER
  | FRACTION
  | NUMBER
  | OP0
  | OP1
  | EXPR
  | TERM
  | CALL
  | FACTOR
  | TOKEN;
