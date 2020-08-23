# ts-calc
Calculator written by typescript

## EBNF
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
FRACTION ::= DOT { DIGIT } NON_ZERO_DIGIT
NUMBER ::= INTEGRAL_NUMBER { FRACTION }

OP0 ::= PLUS | MINUS
OP1 ::= MULT | DIV

RH_EXPR ::= OP0 EXPR
EXPR ::= TERM { RH_EXPR }
RH_TERM ::= OP1 TERM
TERM ::= FACTOR { RH_TERM }
FACTOR ::= [FUNCTION] LEFT_PAREN EXPR RIGHT_PAREN | NUMBER


inferface NON_ZERO_DIGIT {
  kind: "non_zero_digit",
  value: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
}

intterface ZERO {
  kind: "zero"
}
