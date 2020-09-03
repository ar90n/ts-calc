# ts-calc
Calculator written by typescript

## Example
```bash
$echo '1 + 1/1 + 1/(1 * 2) + 1/(1 * 2 * 3) + 1/(1 * 2 * 3 * 4) + 1/(1* 2*3*4*5) - exp(1)' | yarn run calc
yarn run v1.22.4
$ ./node_modules/ts-node/dist/bin.js ./src/index.ts
-0.0016151617923787498
Done in 3.99s.
```

## EBNF

```ebnf
ZERO ::= "0"
NON_ZERO_DIGIT ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
PLUS ::= "+"
MINUS ::= "-"
MULT ::= "*"
DIV ::= "/"
DOT ::= "."
FUNCTION ::= "sin" | "cos" | "tan" | "exp"
LEFT_PAREN ::= "("
RIGHT_PAREN ::= ")"

SIGN ::= PLUS | MINUS
DIGIT ::= ZERO | NON_ZERO_DIGIT
NATURAL_NUMBER ::= [ SIGN ] NON_ZERO_DIGIT { DIGIT }
INTEGRAL_NUMBER ::= NATURAL_NUMBER | ZERO
FRACTION ::= DOT { DIGIT }
NUMBER ::= INTEGRAL_NUMBER { FRACTION }
OP0 ::= PLUS | MINUS
OP1 ::= MULT | DIV
EXPR ::= TERM { OP0 TERM }
TERM ::= FACTOR { OP1 FACTOR }
FACTOR ::= [FUNCTION] LEFT_PAREN EXPR RIGHT_PAREN | NUMBER
```
