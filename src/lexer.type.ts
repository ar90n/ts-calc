const zeroValues = ['0'] as const;
export type ZERO = {
  kind: 'zero';
  value: typeof zeroValues[number];
};

const nonZeroDigitValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NON_ZERO_DIGIT = {
  kind: 'non_zero_digit';
  value: typeof nonZeroDigitValues[number];
};

const plusValues = ['+'] as const;
export type PLUS = {
  kind: 'plus';
  value: typeof plusValues[number];
};

const minusValues = ['-'] as const;
export type MINUS = {
  kind: 'minus';
  value: typeof minusValues[number];
};

const multValues = ['*'] as const;
export type MULT = {
  kind: 'mult';
  value: typeof multValues[number];
};

const divValues = ['/'] as const;
export type DIV = {
  kind: 'div';
  value: typeof divValues[number];
};

const dotValues = ['.'] as const;
export type DOT = {
  kind: 'dot';
  value: typeof dotValues[number];
};

const functionValues = ['sin', 'cos', 'tan', 'exp'] as const;
export type FUNCTION = {
  kind: 'function';
  value: typeof functionValues[number];
};

const leftParenValues = ['('] as const;
export type LEFT_PAREN = {
  kind: 'left_paren';
  value: typeof leftParenValues[number];
};

const rightParenValues = [')'] as const;
export type RIGHT_PAREN = {
  kind: 'right_paren';
  value: typeof rightParenValues[number];
};

const delimiterValues = [' ', '\t'] as const;
export type DELIMITER = {
  kind: 'delimtier';
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
  | DELIMITER
  | LEFT_PAREN
  | RIGHT_PAREN;

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
  kind: string,
  value: string,
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
  tokenizeToken('zero', value, zeroValues);
export const tokenizeNonZeroDigit: tokenTokenizer<NON_ZERO_DIGIT> = (value: string) =>
  tokenizeToken('non_zero_digit', value, nonZeroDigitValues);
export const tokenizePlus: tokenTokenizer<PLUS> = (value: string) =>
  tokenizeToken('plus', value, plusValues);
export const tokenizeMinus: tokenTokenizer<MINUS> = (value: string) =>
  tokenizeToken('minus', value, minusValues);
export const tokenizeMult: tokenTokenizer<MULT> = (value: string) =>
  tokenizeToken('mult', value, multValues);
export const tokenizeDiv: tokenTokenizer<DIV> = (value: string) =>
  tokenizeToken('div', value, divValues);
export const tokenizeDot: tokenTokenizer<DOT> = (value: string) =>
  tokenizeToken('dot', value, dotValues);
export const tokenizeLeftParen: tokenTokenizer<LEFT_PAREN> = (value: string) =>
  tokenizeToken('left_paren', value, leftParenValues);
export const tokenizeRightParen: tokenTokenizer<RIGHT_PAREN> = (value: string) =>
  tokenizeToken('right_paren', value, rightParenValues);
export const tokenizeDelimiter: tokenTokenizer<DELIMITER> = (value: string) =>
  tokenizeToken('delimiter', value, delimiterValues);
