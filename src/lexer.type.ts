const zeroTag = 'zero' as const;
const zeroValues = ['0'] as const;
export type ZERO = {
  kind: typeof zeroTag;
  value: typeof zeroValues[number];
};

const nonZeroDigitTag = 'non_zero_digit' as const;
const nonZeroDigitValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NON_ZERO_DIGIT = {
  kind: typeof nonZeroDigitTag;
  value: typeof nonZeroDigitValues[number];
};

const plusTag = 'plus' as const;
const plusValues = ['+'] as const;
export type PLUS = {
  kind: typeof plusTag;
  value: typeof plusValues[number];
};

const minusTag = 'minus' as const;
const minusValues = ['-'] as const;
export type MINUS = {
  kind: typeof minusTag;
  value: typeof minusValues[number];
};

const multTag = 'mult' as const;
const multValues = ['*'] as const;
export type MULT = {
  kind: typeof multTag;
  value: typeof multValues[number];
};

const divTag = 'div' as const;
const divValues = ['/'] as const;
export type DIV = {
  kind: typeof divTag;
  value: typeof divValues[number];
};

const dotTag = 'dot' as const;
const dotValues = ['.'] as const;
export type DOT = {
  kind: typeof dotTag;
  value: typeof dotValues[number];
};

const functionTag = 'function' as const;
const functionValues = ['sin', 'cos', 'tan', 'exp'] as const;
export type FUNCTION = {
  kind: typeof functionTag;
  value: typeof functionValues[number];
};

const leftParenTag = 'left_paren' as const;
const leftParenValues = ['('] as const;
export type LEFT_PAREN = {
  kind: typeof leftParenTag;
  value: typeof leftParenValues[number];
};

const rightParenTag = 'right_paren' as const;
const rightParenValues = [')'] as const;
export type RIGHT_PAREN = {
  kind: typeof rightParenTag;
  value: typeof rightParenValues[number];
};

const delimtierTag = 'delimiter' as const;
const delimiterValues = [' ', '\t'] as const;
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

const tokenizeToken = <K, U, T extends { kind: K; value: U }>(
  value: string,
  kind: K,
  expects: readonly U[],
): TokenizeResult<T> => {
  if (!expects.includes((value as unknown) as U)) {
    return { status: 'failure' };
  }

  return {
    status: 'success',
    token: {
      kind: (kind as unknown) as K,
      value: (value as unknown) as U,
    } as T,
  };
};

export const tokenizeFunction: tokenTokenizer<FUNCTION> = (value: string) => {
  for (const exp of functionValues) {
    if (exp === value) {
      return {
        status: 'success',
        token: {
          kind: 'function',
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
export const tokenizeZero: tokenTokenizer<ZERO> = (value: string) =>
  tokenizeToken(value, zeroTag, zeroValues);
export const tokenizeNonZeroDigit: tokenTokenizer<NON_ZERO_DIGIT> = (value: string) =>
  tokenizeToken(value, nonZeroDigitTag, nonZeroDigitValues);
export const tokenizePlus: tokenTokenizer<PLUS> = (value: string) =>
  tokenizeToken(value, plusTag, plusValues);
export const tokenizeMinus: tokenTokenizer<MINUS> = (value: string) =>
  tokenizeToken(value, minusTag, minusValues);
export const tokenizeMult: tokenTokenizer<MULT> = (value: string) =>
  tokenizeToken(value, multTag, multValues);
export const tokenizeDiv: tokenTokenizer<DIV> = (value: string) =>
  tokenizeToken(value, divTag, divValues);
export const tokenizeDot: tokenTokenizer<DOT> = (value: string) =>
  tokenizeToken(value, dotTag, dotValues);
export const tokenizeLeftParen: tokenTokenizer<LEFT_PAREN> = (value: string) =>
  tokenizeToken(value, leftParenTag, leftParenValues);
export const tokenizeRightParen: tokenTokenizer<RIGHT_PAREN> = (value: string) =>
  tokenizeToken(value, rightParenTag, rightParenValues);
export const tokenizeDelimiter: tokenTokenizer<DELIMITER> = (value: string) =>
  tokenizeToken(value, delimtierTag, delimiterValues);

export const tokenOf = (kind: TOKEN['kind'], value: TOKEN['value']): TOKEN => {
  return { kind, value } as TOKEN;
};
