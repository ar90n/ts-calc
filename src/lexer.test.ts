import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';

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
  DELIMITER,
  FUNCTION,
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
    expect(writer.data).toEqual([ZERO.of(), 'a']);
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
      NON_ZERO_DIGIT.of('1'),
      NON_ZERO_DIGIT.of('2'),
      NON_ZERO_DIGIT.of('3'),
      NON_ZERO_DIGIT.of('4'),
      NON_ZERO_DIGIT.of('5'),
      NON_ZERO_DIGIT.of('6'),
      NON_ZERO_DIGIT.of('7'),
      NON_ZERO_DIGIT.of('8'),
      NON_ZERO_DIGIT.of('9'),
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
    expect(writer.data).toEqual([PLUS.of(), 'a']);
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
    expect(writer.data).toEqual([MINUS.of(), 'a']);
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
    expect(writer.data).toEqual([MULT.of(), 'a']);
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
    expect(writer.data).toEqual([DIV.of(), 'a']);
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
    expect(writer.data).toEqual([DOT.of(), 'a']);
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
    expect(writer.data).toEqual([LEFT_PAREN.of(), 'a']);
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
    expect(writer.data).toEqual([RIGHT_PAREN.of(), 'a']);
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
    expect(writer.data).toEqual([DELIMITER.of(' '), 'a', DELIMITER.of('\t')]);
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
    expect(writer.data).toEqual(['s', 'i', DELIMITER.of(' '), FUNCTION.of('sin'), 'n', 's', 'i']);
    done();
  });
});
