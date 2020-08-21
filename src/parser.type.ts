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

export type SIGN = PLUS | MINUS;
export type DIGIT = ZERO | NON_ZERO_DIGIT;

export const naturalNumberTag = 'natural_number' as const;
export type NATURAL_NUMBER = {
  kind: typeof naturalNumberTag;
  value: [SIGN | null, NON_ZERO_DIGIT, DIGIT[]];
};

export type INTEGRAL_NUMBER = NATURAL_NUMBER | ZERO;

export const fractionTag = 'fraction' as const;
export type FRACTION = {
  kind: typeof fractionTag;
  value: [DOT, DIGIT[], NON_ZERO_DIGIT];
};

export const numberTag = 'number' as const;
export type NUMBER = {
  kind: typeof numberTag;
  value: [INTEGRAL_NUMBER, FRACTION[]];
};

export type OP0 = PLUS | MINUS;
export type OP1 = MULT | DIV;

export const rhExprTag = 'rh_expr' as const;
export type RH_EXPR = {
  kind: typeof rhExprTag;
  value: [OP0, EXPR];
};

export const exprTag = 'expr' as const;
export type EXPR = {
  kind: typeof exprTag;
  value: [TERM, RH_EXPR | null];
};

export const rhTermTag = 'rh_term' as const;
export type RH_TERM = {
  kind: typeof rhTermTag;
  value: [TERM, RH_TERM | null];
};

export const termTag = 'term' as const;
export type TERM = {
  kind: typeof termTag;
  value: [FACTOR, OP1, TERM];
};

export const callTag = 'call' as const;
export type CALL = {
  kind: typeof callTag;
  value: [FUNCTION | null, LEFT_PAREN, EXPR, RIGHT_PAREN];
};

export type FACTOR = CALL | NUMBER;
