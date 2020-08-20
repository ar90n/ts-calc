import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';

import {
  ParseZeroTransform,
  ParseNonZeroDigitTransform,
  ParsePlusTransform,
  ParseMinusTransform,
  ParseMultTransform,
  ParseDivTransform,
  ParseDotTransform,
  ParseLeftParenTransform,
  ParseRightParenTransform,
  ParseDelimiterTransform,
  ParseFunctionTransform,
} from './lexer';

test('parse Zero', done => {
  const input = ['0', 'a'];
  const parseZero = new ParseZeroTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseZero).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'zero', value: '0' }, 'a']);
    done();
  });
});

test('parse NonZeroDigit', done => {
  const input = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a'];
  const parseNonZeroDigit = new ParseNonZeroDigitTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseNonZeroDigit).pipe(writer);

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

test('parse plus', done => {
  const input = ['+', 'a'];
  const parsePlus = new ParsePlusTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parsePlus).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'plus', value: '+' }, 'a']);
    done();
  });
});

test('parse minus', done => {
  const input = ['-', 'a'];
  const parseMinus = new ParseMinusTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseMinus).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'minus', value: '-' }, 'a']);
    done();
  });
});

test('parse mult', done => {
  const input = ['*', 'a'];
  const parseMult = new ParseMultTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseMult).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'mult', value: '*' }, 'a']);
    done();
  });
});

test('parse div', done => {
  const input = ['/', 'a'];
  const parseDiv = new ParseDivTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseDiv).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'div', value: '/' }, 'a']);
    done();
  });
});

test('parse dot', done => {
  const input = ['.', 'a'];
  const parseDot = new ParseDotTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseDot).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'dot', value: '.' }, 'a']);
    done();
  });
});

test('parse left paren', done => {
  const input = ['(', 'a'];
  const parseLeftParen = new ParseLeftParenTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseLeftParen).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'left_paren', value: '(' }, 'a']);
    done();
  });
});

test('parse right paren', done => {
  const input = [')', 'a'];
  const parseRightParen = new ParseRightParenTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseRightParen).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([{ kind: 'right_paren', value: ')' }, 'a']);
    done();
  });
});

test('parse delimiter', done => {
  const input = [' ', 'a', '\t'];
  const parseDelimiter = new ParseDelimiterTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseDelimiter).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([
      { kind: 'delimiter', value: ' ' },
      'a',
      { kind: 'delimiter', value: '\t' },
    ]);
    done();
  });
});

test('parse function', done => {
  const input = ['s', 'i', ' ', 's', 'i', 'n', 'n', 's', 'i'];
  const parseDelimiter = new ParseDelimiterTransform({ objectMode: true });
  const parseFunction = new ParseFunctionTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseDelimiter).pipe(parseFunction).pipe(writer);

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
