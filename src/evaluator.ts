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
  NUMBER,
  DIGIT,
  RH_EXPR,
  EXPR,
  RH_TERM,
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
      return v.value[1].map(evaluate).reduceRight((arr: number, cur: number) => 0.1 * arr + cur, 0);
    }
    case NUMBER.tag: {
      const integer = evaluate(v.value[0]);
      const fraction = evaluate(v.value[1]);
      return integer + fraction;
    }
    case EXPR.tag: {
      let num = evaluate(v.value[0]);

      const rh = v.value[1];
      if (rh !== null && RH_EXPR.is(rh)) {
        const sign = evaluate(rh.value[0]);
        num += sign * evaluate(rh.value[1]);
      }

      return num;
    }
    case TERM.tag: {
      let num = evaluate(v.value[0]);

      const rh = v.value[1];
      if (rh !== null && RH_TERM.is(rh)) {
        const rh_num = evaluate(rh.value[1]);
        if (MULT.is(rh.value[0])) {
          num *= rh_num;
        } else {
          num /= rh_num;
        }
      }

      return num;
    }
    case CALL.tag: {
      const func = getFunction(v.value[0]);
      return func(evaluate(v.value[2]));
    }
    default:
      return v.value as string;
  }
}
