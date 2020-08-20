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

export type ParseResult<T> = Success<T> | Failure | Tbd;

const parseToken = <K, U, T extends { kind: K; value: U }>(
  kind: string,
  value: string,
  expects: readonly U[],
): ParseResult<T> => {
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

export const parseFunction: tokenParser<FUNCTION> = (value: string) => {
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

type tokenParser<T> = (value: string) => ParseResult<T>;
export const parseZero: tokenParser<ZERO> = (value: string) =>
  parseToken('zero', value, zeroValues);
export const parseNonZeroDigit: tokenParser<NON_ZERO_DIGIT> = (value: string) =>
  parseToken('non_zero_digit', value, nonZeroDigitValues);
export const parsePlus: tokenParser<PLUS> = (value: string) =>
  parseToken('plus', value, plusValues);
export const parseMinus: tokenParser<MINUS> = (value: string) =>
  parseToken('minus', value, minusValues);
export const parseMult: tokenParser<MULT> = (value: string) =>
  parseToken('mult', value, multValues);
export const parseDiv: tokenParser<DIV> = (value: string) => parseToken('div', value, divValues);
export const parseDot: tokenParser<DOT> = (value: string) => parseToken('dot', value, dotValues);
export const parseLeftParen: tokenParser<LEFT_PAREN> = (value: string) =>
  parseToken('left_paren', value, leftParenValues);
export const parseRightParen: tokenParser<RIGHT_PAREN> = (value: string) =>
  parseToken('right_paren', value, rightParenValues);
export const parseDelimiter: tokenParser<DELIMITER> = (value: string) =>
  parseToken('delimiter', value, delimiterValues);
