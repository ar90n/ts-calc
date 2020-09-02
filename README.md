# ts-calc
Calculator written by typescript

## EBNF

```ebnf
ZERO ::= "0"
NON_ZERO_DIGIT ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
PLUS ::= "+"
MINUS ::= "-"
MULT ::= "*"
DIV ::= "/"
DOT :: = "."
FUNCTION ::= "sin" | "cos" | "tan" | "exp"
LEFT_PAREN :: = "("
RIGHT_PAREN ::= ")"

SIGN ::= PLUS | MINUS
DIGIT ::= ZERO | NON_ZERO_DIGIT
NATURAL_NUMBER ::= [ SIGN ] NON_ZERO_DIGIT { DIGIT }
INTEGRAL_NUMBER ::= NATURAL_NUMBER | ZERO
FRACTION ::= DOT { DIGIT }
NUMBER ::= INTEGRAL_NUMBER { FRACTION }
OP0 ::= PLUS | MINUS
OP1 ::= MULT | DIV
EXPR ::= TERM { OP0 EXPR }
TERM ::= FACTOR { OP1 TERM }
FACTOR ::= [FUNCTION] LEFT_PAREN EXPR RIGHT_PAREN | NUMBER
```
