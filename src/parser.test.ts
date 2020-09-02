import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import {
  DropDelimiterTransform,
  parseZero,
  parsePlus,
  parseMinus,
  parseMult,
  parseDiv,
  parseSign,
  parseNonZeroDigit,
  parseDigit,
  parseNaturalNumber,
  parseNumber,
  parseOp0,
  parseOp1,
  parseTerm,
  parseExpr,
} from './parser';
import {
  ZERO,
  DELIMITER,
  FUNCTION,
  PLUS,
  MINUS,
  NON_ZERO_DIGIT,
  DOT,
  MULT,
  DIV,
  LEFT_PAREN,
  RIGHT_PAREN,
} from './lexer.type';

test('drop delimiters', done => {
  const input = [ZERO.of(), DELIMITER.of(' '), ZERO.of()];
  const dropDelimiter = new DropDelimiterTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(dropDelimiter).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([ZERO.of(), ZERO.of()]);
    done();
  });
});

test('parse zero', () => {
  const input = [ZERO.of()];
  const ret = parseZero(input);
  expect(ret).toEqual({ consumedNodes: 1, output: { kind: 'zero', value: '0' }, status: 'ok' });
});

test('parse plus', () => {
  const input = [PLUS.of()];
  const ret = parsePlus(input);
  expect(ret).toEqual({ consumedNodes: 1, output: { kind: 'plus', value: '+' }, status: 'ok' });
});

test('parse minus', () => {
  const input = [MINUS.of()];
  const ret = parseMinus(input);
  expect(ret).toEqual({ consumedNodes: 1, output: { kind: 'minus', value: '-' }, status: 'ok' });
});

test('parse mult', () => {
  const input = [MULT.of()];
  const ret = parseMult(input);
  expect(ret).toEqual({ consumedNodes: 1, output: { kind: 'mult', value: '*' }, status: 'ok' });
});

test('parse div', () => {
  const input = [DIV.of()];
  const ret = parseDiv(input);
  expect(ret).toEqual({ consumedNodes: 1, output: { kind: 'div', value: '/' }, status: 'ok' });
});

test('parse op0', () => {
  const input = [PLUS.of(), MINUS.of()];
  const output = [parseOp0(input.slice(0)), parseOp0(input.slice(1))];
  expect(output[0]).toEqual({
    consumedNodes: 1,
    output: { kind: 'plus', value: '+' },
    status: 'ok',
  });
  expect(output[1]).toEqual({
    consumedNodes: 1,
    output: { kind: 'minus', value: '-' },
    status: 'ok',
  });
});

test('parse op1', () => {
  const input = [MULT.of(), DIV.of()];
  const output = [parseOp1(input.slice(0)), parseOp1(input.slice(1))];
  expect(output[0]).toEqual({
    consumedNodes: 1,
    output: { kind: 'mult', value: '*' },
    status: 'ok',
  });
  expect(output[1]).toEqual({
    consumedNodes: 1,
    output: { kind: 'div', value: '/' },
    status: 'ok',
  });
});

test('parse non zero digit', () => {
  const input = [NON_ZERO_DIGIT.of('1')];
  const ret = parseNonZeroDigit(input);
  expect(ret).toEqual({
    consumedNodes: 1,
    output: { kind: 'non_zero_digit', value: '1' },
    status: 'ok',
  });
});

test('parse digit', () => {
  const input = [NON_ZERO_DIGIT.of('1'), ZERO.of()];
  const output = [parseDigit(input.slice(0)), parseDigit(input.slice(1))];
  expect(output[0]).toEqual({
    consumedNodes: 1,
    output: { kind: 'non_zero_digit', value: '1' },
    status: 'ok',
  });
  expect(output[1]).toEqual({
    consumedNodes: 1,
    output: { kind: 'zero', value: '0' },
    status: 'ok',
  });
});

test('parse sign', () => {
  const input = [PLUS.of(), MINUS.of()];
  const output = [parseSign(input.slice(0)), parseSign(input.slice(1))];
  expect(output[0]).toEqual({
    consumedNodes: 1,
    output: {
      kind: 'plus',
      value: '+',
    },
    status: 'ok',
  });
  expect(output[1]).toEqual({
    consumedNodes: 1,
    output: {
      kind: 'minus',
      value: '-',
    },
    status: 'ok',
  });
});

test('parse natural number', () => {
  const input = [MINUS.of(), NON_ZERO_DIGIT.of('1'), ZERO.of(), ZERO.of(), NON_ZERO_DIGIT.of('8')];
  const ret = parseNaturalNumber(input);
  expect(ret).toEqual({
    consumedNodes: 5,
    output: {
      kind: 'natural_number',
      value: [
        { kind: 'minus', value: '-' },
        { kind: 'non_zero_digit', value: '1' },
        [
          { kind: 'zero', value: '0' },
          { kind: 'zero', value: '0' },
          { kind: 'non_zero_digit', value: '8' },
        ],
      ],
    },
    status: 'ok',
  });
});

test('parse number', () => {
  const input = [
    MINUS.of(),
    NON_ZERO_DIGIT.of('1'),
    ZERO.of(),
    ZERO.of(),
    NON_ZERO_DIGIT.of('8'),
    DOT.of(),
    ZERO.of(),
    ZERO.of(),
    NON_ZERO_DIGIT.of('8'),
  ];

  const ret = parseNumber(input);
  expect(ret).toEqual({
    consumedNodes: 9,
    output: {
      kind: 'number',
      value: [
        {
          kind: 'natural_number',
          value: [
            { kind: 'minus', value: '-' },
            { kind: 'non_zero_digit', value: '1' },
            [
              { kind: 'zero', value: '0' },
              { kind: 'zero', value: '0' },
              { kind: 'non_zero_digit', value: '8' },
            ],
          ],
        },
        {
          kind: 'fraction',
          value: [
            { kind: 'dot', value: '.' },
            [
              { kind: 'zero', value: '0' },
              { kind: 'zero', value: '0' },
              { kind: 'non_zero_digit', value: '8' },
            ],
          ],
        },
      ],
    },
    status: 'ok',
  });
});

test('parse term', () => {
  const input = [
    NON_ZERO_DIGIT.of('3'),
    NON_ZERO_DIGIT.of('1'),
    DOT.of(),
    NON_ZERO_DIGIT.of('1'),
    ZERO.of(),
    ZERO.of(),
    NON_ZERO_DIGIT.of('8'),
    MULT.of(),
    ZERO.of(),
    DOT.of(),
    NON_ZERO_DIGIT.of('1'),
  ];

  const ret = parseTerm(input);
  expect(ret).toEqual({
    consumedNodes: 11,
    output: {
      kind: 'term',
      value: [
        {
          kind: 'number',
          value: [
            {
              kind: 'natural_number',
              value: [
                null,
                { kind: 'non_zero_digit', value: '3' },
                [{ kind: 'non_zero_digit', value: '1' }],
              ],
            },
            {
              kind: 'fraction',
              value: [
                { kind: 'dot', value: '.' },
                [
                  { kind: 'non_zero_digit', value: '1' },
                  { kind: 'zero', value: '0' },
                  { kind: 'zero', value: '0' },
                  { kind: 'non_zero_digit', value: '8' },
                ],
              ],
            },
          ],
        },
        [
          { kind: 'mult', value: '*' },
          {
            kind: 'term',
            value: [
              {
                kind: 'number',
                value: [
                  { kind: 'zero', value: '0' },
                  {
                    kind: 'fraction',
                    value: [{ kind: 'dot', value: '.' }, [{ kind: 'non_zero_digit', value: '1' }]],
                  },
                ],
              },
              null,
            ],
          },
        ],
      ],
    },
    status: 'ok',
  });
});

test('parse expr', () => {
  const input = [
    NON_ZERO_DIGIT.of('3'),
    NON_ZERO_DIGIT.of('1'),
    DOT.of(),
    NON_ZERO_DIGIT.of('1'),
    ZERO.of(),
    ZERO.of(),
    NON_ZERO_DIGIT.of('8'),
    PLUS.of(),
    LEFT_PAREN.of(),
    NON_ZERO_DIGIT.of('8'),
    PLUS.of(),
    ZERO.of(),
    RIGHT_PAREN.of(),
    MULT.of(),
    FUNCTION.of('sin'),
    LEFT_PAREN.of(),
    ZERO.of(),
    DOT.of(),
    NON_ZERO_DIGIT.of('1'),
    PLUS.of(),
    NON_ZERO_DIGIT.of('2'),
    RIGHT_PAREN.of(),
  ];

  const ret = parseExpr(input);
  expect(ret).toEqual({
    status: 'ok',
    consumedNodes: 22,
    output: {
      kind: 'expr',
      value: [
        {
          kind: 'term',
          value: [
            {
              kind: 'number',
              value: [
                {
                  kind: 'natural_number',
                  value: [
                    null,
                    { kind: 'non_zero_digit', value: '3' },
                    [{ kind: 'non_zero_digit', value: '1' }],
                  ],
                },
                {
                  kind: 'fraction',
                  value: [
                    { kind: 'dot', value: '.' },
                    [
                      { kind: 'non_zero_digit', value: '1' },
                      { kind: 'zero', value: '0' },
                      { kind: 'zero', value: '0' },
                      { kind: 'non_zero_digit', value: '8' },
                    ],
                  ],
                },
              ],
            },
            null,
          ],
        },
        [
          { kind: 'plus', value: '+' },
          {
            kind: 'expr',
            value: [
              {
                kind: 'term',
                value: [
                  {
                    kind: 'call',
                    value: [
                      null,
                      { kind: 'left_paren', value: '(' },
                      {
                        kind: 'expr',
                        value: [
                          {
                            kind: 'term',
                            value: [
                              {
                                kind: 'number',
                                value: [
                                  {
                                    kind: 'natural_number',
                                    value: [null, { kind: 'non_zero_digit', value: '8' }, []],
                                  },
                                  null,
                                ],
                              },
                              null,
                            ],
                          },
                          [
                            { kind: 'plus', value: '+' },
                            {
                              kind: 'expr',
                              value: [
                                {
                                  kind: 'term',
                                  value: [
                                    { kind: 'number', value: [{ kind: 'zero', value: '0' }, null] },
                                    null,
                                  ],
                                },
                                null,
                              ],
                            },
                          ],
                        ],
                      },
                      { kind: 'right_paren', value: ')' },
                    ],
                  },
                  [
                    { kind: 'mult', value: '*' },
                    {
                      kind: 'term',
                      value: [
                        {
                          kind: 'call',
                          value: [
                            { kind: 'function', value: 'sin' },
                            { kind: 'left_paren', value: '(' },
                            {
                              kind: 'expr',
                              value: [
                                {
                                  kind: 'term',
                                  value: [
                                    {
                                      kind: 'number',
                                      value: [
                                        { kind: 'zero', value: '0' },
                                        {
                                          kind: 'fraction',
                                          value: [
                                            { kind: 'dot', value: '.' },
                                            [{ kind: 'non_zero_digit', value: '1' }],
                                          ],
                                        },
                                      ],
                                    },
                                    null,
                                  ],
                                },
                                [
                                  { kind: 'plus', value: '+' },
                                  {
                                    kind: 'expr',
                                    value: [
                                      {
                                        kind: 'term',
                                        value: [
                                          {
                                            kind: 'number',
                                            value: [
                                              {
                                                kind: 'natural_number',
                                                value: [
                                                  null,
                                                  { kind: 'non_zero_digit', value: '2' },
                                                  [],
                                                ],
                                              },
                                              null,
                                            ],
                                          },
                                          null,
                                        ],
                                      },
                                      null,
                                    ],
                                  },
                                ],
                              ],
                            },
                            { kind: 'right_paren', value: ')' },
                          ],
                        },
                        null,
                      ],
                    },
                  ],
                ],
              },
              null,
            ],
          },
        ],
      ],
    },
  });
});
