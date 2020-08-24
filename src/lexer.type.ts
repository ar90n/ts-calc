import { creatToken } from './util';

const zeroTag = 'zero' as const;
const zeroValues = ['0'] as const;
export type ZERO = {
  kind: typeof zeroTag;
  value: typeof zeroValues[number];
};
export const ZERO = creatToken<ZERO>(zeroTag, zeroValues);

const nonZeroDigitTag = 'non_zero_digit' as const;
const nonZeroDigitValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NON_ZERO_DIGIT = {
  kind: typeof nonZeroDigitTag;
  value: typeof nonZeroDigitValues[number];
};
export const NON_ZERO_DIGIT = creatToken<NON_ZERO_DIGIT>(nonZeroDigitTag, nonZeroDigitValues);

const plusTag = 'plus' as const;
const plusValues = ['+'] as const;
export type PLUS = {
  kind: typeof plusTag;
  value: typeof plusValues[number];
};
export const PLUS = creatToken<PLUS>(plusTag, plusValues);

const minusTag = 'minus' as const;
const minusValues = ['-'] as const;
export type MINUS = {
  kind: typeof minusTag;
  value: typeof minusValues[number];
};
export const MINUS = creatToken<MINUS>(minusTag, minusValues);

const multTag = 'mult' as const;
const multValues = ['*'] as const;
export type MULT = {
  kind: typeof multTag;
  value: typeof multValues[number];
};
export const MULT = creatToken<MULT>(multTag, multValues);

const divTag = 'div' as const;
const divValues = ['/'] as const;
export type DIV = {
  kind: typeof divTag;
  value: typeof divValues[number];
};
export const DIV = creatToken<DIV>(divTag, divValues);

const dotTag = 'dot' as const;
const dotValues = ['.'] as const;
export type DOT = {
  kind: typeof dotTag;
  value: typeof dotValues[number];
};
export const DOT = creatToken<DOT>(dotTag, dotValues);

const functionTag = 'function' as const;
const functionValues = ['sin', 'cos', 'tan', 'exp'] as const;
export type FUNCTION = {
  kind: typeof functionTag;
  value: typeof functionValues[number];
};
export const FUNCTION = creatToken<FUNCTION>(functionTag, functionValues);

const leftParenTag = 'left_paren' as const;
const leftParenValues = ['('] as const;
export type LEFT_PAREN = {
  kind: typeof leftParenTag;
  value: typeof leftParenValues[number];
};
export const LEFT_PAREN = creatToken<LEFT_PAREN>(leftParenTag, leftParenValues);

const rightParenTag = 'right_paren' as const;
const rightParenValues = [')'] as const;
export type RIGHT_PAREN = {
  kind: typeof rightParenTag;
  value: typeof rightParenValues[number];
};
export const RIGHT_PAREN = creatToken<RIGHT_PAREN>(rightParenTag, rightParenValues);

const delimterTag = 'delimiter' as const;
const delimiterValues = [' ', '\t'] as const;
export type DELIMITER = {
  kind: typeof delimterTag;
  value: typeof delimiterValues[number];
};
export const DELIMITER = creatToken<DELIMITER>(delimterTag, delimiterValues);

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
