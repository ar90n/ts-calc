import { Stream } from 'stream';
import toArray = require('stream-to-array');
import {
  TokenizeZeroTransform,
  TokenizeNonZeroDigitTransform,
  TokenizePlusTransform,
  TokenizeMinusTransform,
  TokenizeMultTransform,
  TokenizeDivTransform,
  TokenizeDotTransform,
  TokenizeLeftParenTransform,
  TokenizeRightParenTransform,
  TokenizeDelimiterTransform,
  TokenizeFunctionTransform,
  DropDelimiterTransform,
} from './lexer';

import { parseExpr } from './parser';

import { EXPR } from './parser.type';

import { evaluate } from './evaluator';

export const calc = async (stream: Stream): Promise<number> => {
  const tokenStream = stream
    .pipe(new TokenizeDelimiterTransform({ objectMode: true }))
    .pipe(new TokenizeZeroTransform({ objectMode: true }))
    .pipe(new TokenizeNonZeroDigitTransform({ objectMode: true }))
    .pipe(new TokenizePlusTransform({ objectMode: true }))
    .pipe(new TokenizeMinusTransform({ objectMode: true }))
    .pipe(new TokenizeMultTransform({ objectMode: true }))
    .pipe(new TokenizeDivTransform({ objectMode: true }))
    .pipe(new TokenizeDotTransform({ objectMode: true }))
    .pipe(new TokenizeLeftParenTransform({ objectMode: true }))
    .pipe(new TokenizeRightParenTransform({ objectMode: true }))
    .pipe(new TokenizeFunctionTransform({ objectMode: true }))
    .pipe(new DropDelimiterTransform({ objectMode: true }));

  const tokens = await toArray(tokenStream);

  const { status, output } = parseExpr(tokens);
  if (status !== 'ok') {
    throw 'Parse faild';
  }
  return evaluate(output as EXPR);
};
