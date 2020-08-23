import { hasKindAndValue } from './util';

const zeroTag = 'zero' as const;
const zeroValues = ['0'] as const;
export type ZERO = {
  kind: typeof zeroTag;
  value: typeof zeroValues[number];
};
export const ZERO = {
  tag: zeroTag,
  values: zeroValues,
  of: (): ZERO => ({
    kind: ZERO.tag,
    value: zeroValues[0],
  }),
  is: (v: unknown): v is ZERO => hasKindAndValue(v) && v.kind === ZERO.tag,
};

const nonZeroDigitTag = 'non_zero_digit' as const;
const nonZeroDigitValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NON_ZERO_DIGIT = {
  kind: typeof nonZeroDigitTag;
  value: typeof nonZeroDigitValues[number];
};
export const NON_ZERO_DIGIT = {
  tag: nonZeroDigitTag,
  values: nonZeroDigitValues,
  of: (v: NON_ZERO_DIGIT['value']): NON_ZERO_DIGIT => ({
    kind: NON_ZERO_DIGIT.tag,
    value: v,
  }),
  is: (v: unknown): v is NON_ZERO_DIGIT => hasKindAndValue(v) && v.kind === NON_ZERO_DIGIT.tag,
};

const plusTag = 'plus' as const;
const plusValues = ['+'] as const;
export type PLUS = {
  kind: typeof plusTag;
  value: typeof plusValues[number];
};
export const PLUS = {
  tag: plusTag,
  values: plusValues,
  of: (): PLUS => ({
    kind: PLUS.tag,
    value: plusValues[0],
  }),
  is: (v: unknown): v is PLUS => hasKindAndValue(v) && v.kind === PLUS.tag,
};

const minusTag = 'minus' as const;
const minusValues = ['-'] as const;
export type MINUS = {
  kind: typeof minusTag;
  value: typeof minusValues[number];
};
export const MINUS = {
  tag: minusTag,
  values: minusValues,
  of: (): MINUS => ({
    kind: MINUS.tag,
    value: minusValues[0],
  }),
  is: (v: unknown): v is MINUS => hasKindAndValue(v) && v.kind === MINUS.tag,
};

const multTag = 'mult' as const;
const multValues = ['*'] as const;
export type MULT = {
  kind: typeof multTag;
  value: typeof multValues[number];
};
export const MULT = {
  tag: multTag,
  values: multValues,
  of: (): MULT => ({
    kind: MULT.tag,
    value: multValues[0],
  }),
  is: (v: unknown): v is MULT => hasKindAndValue(v) && v.kind === MULT.tag,
};

const divTag = 'div' as const;
const divValues = ['/'] as const;
export type DIV = {
  kind: typeof divTag;
  value: typeof divValues[number];
};
export const DIV = {
  tag: divTag,
  values: divValues,
  of: (): DIV => ({
    kind: DIV.tag,
    value: divValues[0],
  }),
  is: (v: unknown): v is DIV => hasKindAndValue(v) && v.kind === DIV.tag,
};

const dotTag = 'dot' as const;
const dotValues = ['.'] as const;
export type DOT = {
  kind: typeof dotTag;
  value: typeof dotValues[number];
};
export const DOT = {
  tag: dotTag,
  values: dotValues,
  of: (): DOT => ({
    kind: DOT.tag,
    value: dotValues[0],
  }),
  is: (v: unknown): v is DOT => hasKindAndValue(v) && v.kind === DOT.tag,
};

const functionTag = 'function' as const;
const functionValues = ['sin', 'cos', 'tan', 'exp'] as const;
export type FUNCTION = {
  kind: typeof functionTag;
  value: typeof functionValues[number];
};
export const FUNCTION = {
  tag: functionTag,
  values: functionValues,
  of: (v: FUNCTION['value']): FUNCTION => ({
    kind: FUNCTION.tag,
    value: v,
  }),
  is: (v: unknown): v is FUNCTION => hasKindAndValue(v) && v.kind === FUNCTION.tag,
};

const leftParenTag = 'left_paren' as const;
const leftParenValues = ['('] as const;
export type LEFT_PAREN = {
  kind: typeof leftParenTag;
  value: typeof leftParenValues[number];
};
export const LEFT_PAREN = {
  tag: leftParenTag,
  values: leftParenValues,
  of: (): LEFT_PAREN => ({
    kind: LEFT_PAREN.tag,
    value: leftParenValues[0],
  }),
  is: (v: unknown): v is LEFT_PAREN => hasKindAndValue(v) && v.kind === LEFT_PAREN.tag,
};

const rightParenTag = 'right_paren' as const;
const rightParenValues = [')'] as const;
export type RIGHT_PAREN = {
  kind: typeof rightParenTag;
  value: typeof rightParenValues[number];
};
export const RIGHT_PAREN = {
  tag: rightParenTag,
  values: rightParenValues,
  of: (): RIGHT_PAREN => ({
    kind: RIGHT_PAREN.tag,
    value: rightParenValues[0],
  }),
  is: (v: unknown): v is RIGHT_PAREN => hasKindAndValue(v) && v.kind === RIGHT_PAREN.tag,
};

const delimterTag = 'delimiter' as const;
const delimiterValues = [' ', '\t'] as const;
export type DELIMITER = {
  kind: typeof delimterTag;
  value: typeof delimiterValues[number];
};
export const DELIMITER = {
  tag: delimterTag,
  values: delimiterValues,
  of: (v: DELIMITER['value']): DELIMITER => ({
    kind: DELIMITER.tag,
    value: v,
  }),
  is: (v: unknown): v is DELIMITER => hasKindAndValue(v) && v.kind === DELIMITER.tag,
};

export type TOKEN =
  | ZERO
  | NON_ZERO_DIGIT
  | PLUS
  | MINUS
  | MULT
  | DIV
  | DOT
  | FUNCTION
  | LEFT_PAREN
  | RIGHT_PAREN
  | DELIMITER;
export const TOKEN = {
  of: (kind: TOKEN['kind'], value: TOKEN['value']): TOKEN => ({ kind, value } as TOKEN),
};
