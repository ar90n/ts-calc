export const zeroTag = 'zero' as const;
export const zeroValues = ['0'] as const;
export type ZERO = {
  kind: typeof zeroTag;
  value: typeof zeroValues[number];
};

export const nonZeroDigitTag = 'non_zero_digit' as const;
export const nonZeroDigitValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NON_ZERO_DIGIT = {
  kind: typeof nonZeroDigitTag;
  value: typeof nonZeroDigitValues[number];
};

export const plusTag = 'plus' as const;
export const plusValues = ['+'] as const;
export type PLUS = {
  kind: typeof plusTag;
  value: typeof plusValues[number];
};

export const minusTag = 'minus' as const;
export const minusValues = ['-'] as const;
export type MINUS = {
  kind: typeof minusTag;
  value: typeof minusValues[number];
};

export const multTag = 'mult' as const;
export const multValues = ['*'] as const;
export type MULT = {
  kind: typeof multTag;
  value: typeof multValues[number];
};

export const divTag = 'div' as const;
export const divValues = ['/'] as const;
export type DIV = {
  kind: typeof divTag;
  value: typeof divValues[number];
};

export const dotTag = 'dot' as const;
export const dotValues = ['.'] as const;
export type DOT = {
  kind: typeof dotTag;
  value: typeof dotValues[number];
};

export const functionTag = 'function' as const;
export const functionValues = ['sin', 'cos', 'tan', 'exp'] as const;
export type FUNCTION = {
  kind: typeof functionTag;
  value: typeof functionValues[number];
};

export const leftParenTag = 'left_paren' as const;
export const leftParenValues = ['('] as const;
export type LEFT_PAREN = {
  kind: typeof leftParenTag;
  value: typeof leftParenValues[number];
};

export const rightParenTag = 'right_paren' as const;
export const rightParenValues = [')'] as const;
export type RIGHT_PAREN = {
  kind: typeof rightParenTag;
  value: typeof rightParenValues[number];
};

export const delimtierTag = 'delimiter' as const;
export const delimiterValues = [' ', '\t'] as const;
export type DELIMITER = {
  kind: typeof delimtierTag;
  value: typeof delimiterValues[number];
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
