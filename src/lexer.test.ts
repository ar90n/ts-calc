import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import {
  zeroTag,
  nonZeroDigitTag,
  plusTag,
  minusTag,
  multTag,
  divTag,
  dotTag,
  leftParenTag,
  rightParenTag,
  delimtierTag,
  functionTag,
  tokenOf,
} from './lexer.type';

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
} from './lexer';

test('tokenize Zero', done => {
  const input = ['0', 'a'];
  const tokenizeZero = new TokenizeZeroTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeZero).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(zeroTag, '0'), 'a']);
    done();
  });
});

test('tokenize NonZeroDigit', done => {
  const input = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a'];
  const tokenizeNonZeroDigit = new TokenizeNonZeroDigitTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeNonZeroDigit).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([
      '0',
      tokenOf(nonZeroDigitTag, '1'),
      tokenOf(nonZeroDigitTag, '2'),
      tokenOf(nonZeroDigitTag, '3'),
      tokenOf(nonZeroDigitTag, '4'),
      tokenOf(nonZeroDigitTag, '5'),
      tokenOf(nonZeroDigitTag, '6'),
      tokenOf(nonZeroDigitTag, '7'),
      tokenOf(nonZeroDigitTag, '8'),
      tokenOf(nonZeroDigitTag, '9'),
      'a',
    ]);
    done();
  });
});

test('tokenize plus', done => {
  const input = ['+', 'a'];
  const tokenizePlus = new TokenizePlusTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizePlus).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(plusTag, '+'), 'a']);
    done();
  });
});

test('tokenize minus', done => {
  const input = ['-', 'a'];
  const tokenizeMinus = new TokenizeMinusTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeMinus).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(minusTag, '-'), 'a']);
    done();
  });
});

test('tokenize mult', done => {
  const input = ['*', 'a'];
  const tokenizeMult = new TokenizeMultTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeMult).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(multTag, '*'), 'a']);
    done();
  });
});

test('tokenize div', done => {
  const input = ['/', 'a'];
  const tokenizeDiv = new TokenizeDivTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeDiv).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(divTag, '/'), 'a']);
    done();
  });
});

test('tokenize dot', done => {
  const input = ['.', 'a'];
  const tokenizeDot = new TokenizeDotTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeDot).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(dotTag, '.'), 'a']);
    done();
  });
});

test('tokenize left paren', done => {
  const input = ['(', 'a'];
  const tokenizeLeftParen = new TokenizeLeftParenTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeLeftParen).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(leftParenTag, '('), 'a']);
    done();
  });
});

test('tokenize right paren', done => {
  const input = [')', 'a'];
  const tokenizeRightParen = new TokenizeRightParenTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeRightParen).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(rightParenTag, ')'), 'a']);
    done();
  });
});

test('tokenize delimiter', done => {
  const input = [' ', 'a', '\t'];
  const tokenizeDelimiter = new TokenizeDelimiterTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeDelimiter).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(delimtierTag, ' '), 'a', tokenOf(delimtierTag, '\t')]);
    done();
  });
});

test('tokenize function', done => {
  const input = ['s', 'i', ' ', 's', 'i', 'n', 'n', 's', 'i'];
  const tokenizeDelimiter = new TokenizeDelimiterTransform({ objectMode: true });
  const tokenizeFunction = new TokenizeFunctionTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(tokenizeDelimiter).pipe(tokenizeFunction).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([
      's',
      'i',
      tokenOf(delimtierTag, ' '),
      tokenOf(functionTag, 'sin'),
      'n',
      's',
      'i',
    ]);
    done();
  });
});
