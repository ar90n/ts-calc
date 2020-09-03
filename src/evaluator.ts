import {
  ZERO,
  NON_ZERO_DIGIT,
  PLUS,
  MINUS,
  MULT,
  DIV,
  DOT,
  LEFT_PAREN,
  RIGHT_PAREN,
  FUNCTION,
} from './lexer.type';
import {
  NATURAL_NUMBER,
  INTEGRAL_NUMBER,
  FRACTION,
  OP0,
  OP1,
  NUMBER,
  DIGIT,
  EXPR,
  TERM,
  CALL,
  FACTOR,
  NODE,
} from './parser.type';

const getFunction = (func: FUNCTION | null): ((v: number) => number) => {
  if (func === null) {
    return (v: number) => v;
  }

  const name = func.value;
  switch (name) {
    case 'sin':
      return Math.sin;
    case 'cos':
      return Math.cos;
    case 'tan':
      return Math.tan;
    case 'exp':
      return Math.exp;
  }
};

export function evaluate(v: FACTOR): number;
export function evaluate(v: CALL): number;
export function evaluate(v: TERM): number;
export function evaluate(v: EXPR): number;
export function evaluate(v: NUMBER): number;
export function evaluate(v: FRACTION): number;
export function evaluate(v: INTEGRAL_NUMBER): number;
export function evaluate(v: NATURAL_NUMBER): number;
export function evaluate(v: MULT | DIV | DOT | LEFT_PAREN | RIGHT_PAREN | FUNCTION): string;
export function evaluate(v: PLUS | MINUS | ZERO | NON_ZERO_DIGIT): number;
export function evaluate(v: NODE): number | string {
  switch (v.kind) {
    case ZERO.tag:
    case NON_ZERO_DIGIT.tag:
      return parseInt(v.value);
    case PLUS.tag:
      return 1;
    case MINUS.tag:
      return -1;
    case NATURAL_NUMBER.tag: {
      const sign = v.value[0] === null ? 1 : evaluate(v.value[0]);
      const num = v.value[2].reduce(
        (arr: number, cur: DIGIT) => 10 * arr + evaluate(cur),
        evaluate(v.value[1]),
      );
      return sign * num;
    }
    case FRACTION.tag: {
      return (
        0.1 * v.value[1].map(evaluate).reduceRight((arr: number, cur: number) => 0.1 * arr + cur, 0)
      );
    }
    case NUMBER.tag: {
      let num = evaluate(v.value[0]);
      if (v.value[1] !== null) {
        num += evaluate(v.value[1]);
      }
      return num;
    }
    case EXPR.tag: {
      return v.value[1].reduce((arr: number, cur: [OP0, TERM]) => {
        return arr + evaluate(cur[0]) * evaluate(cur[1]);
      }, evaluate(v.value[0]));
    }
    case TERM.tag: {
      return v.value[1].reduce((arr: number, cur: [OP1, FACTOR]) => {
        const rh_num = evaluate(cur[1]);
        if (MULT.is(cur[0])) {
          return arr * rh_num;
        } else {
          return arr / rh_num;
        }
      }, evaluate(v.value[0]));
    }
    case CALL.tag: {
      const func = getFunction(v.value[0]);
      return func(evaluate(v.value[2]));
    }
    default:
      return v.value as string;
  }
}
