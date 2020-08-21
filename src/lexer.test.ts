import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';

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
    expect(writer.data).toEqual([{ kind: 'zero', value: '0' }, 'a']);
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
      { kind: 'non_zero_digit', value: '1' },
      { kind: 'non_zero_digit', value: '2' },
      { kind: 'non_zero_digit', value: '3' },
      { kind: 'non_zero_digit', value: '4' },
      { kind: 'non_zero_digit', value: '5' },
      { kind: 'non_zero_digit', value: '6' },
      { kind: 'non_zero_digit', value: '7' },
      { kind: 'non_zero_digit', value: '8' },
      { kind: 'non_zero_digit', value: '9' },
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
    expect(writer.data).toEqual([{ kind: 'plus', value: '+' }, 'a']);
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
    expect(writer.data).toEqual([{ kind: 'minus', value: '-' }, 'a']);
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
    expect(writer.data).toEqual([{ kind: 'mult', value: '*' }, 'a']);
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
    expect(writer.data).toEqual([{ kind: 'div', value: '/' }, 'a']);
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
    expect(writer.data).toEqual([{ kind: 'dot', value: '.' }, 'a']);
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
    expect(writer.data).toEqual([{ kind: 'left_paren', value: '(' }, 'a']);
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
    expect(writer.data).toEqual([{ kind: 'right_paren', value: ')' }, 'a']);
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
    expect(writer.data).toEqual([
      { kind: 'delimiter', value: ' ' },
      'a',
      { kind: 'delimiter', value: '\t' },
    ]);
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
      { kind: 'delimiter', value: ' ' },
      { kind: 'function', value: 'sin' },
      'n',
      's',
      'i',
    ]);
    done();
  });
});
