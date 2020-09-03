import { evaluate } from './evaluator';

import { ZERO, MINUS, NON_ZERO_DIGIT } from './lexer.type';

import { NATURAL_NUMBER, EXPR } from './parser.type';

test('eval ZERO', () => {
  expect(evaluate(ZERO.of())).toEqual(0);
});

test('eval NON_ZERO_DIGIT', () => {
  expect(evaluate(NON_ZERO_DIGIT.of('8'))).toEqual(8);
});

test('eval natural number', () => {
  expect(
    evaluate(
      NATURAL_NUMBER.of(MINUS.of(), NON_ZERO_DIGIT.of('3'), [ZERO.of(), NON_ZERO_DIGIT.of('1')]),
    ),
  ).toBe(-301);
});

test('eval expr', () => {
  expect(
    evaluate(({
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
            [],
          ],
        },
        [
          [
            { kind: 'plus', value: '+' },
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
                            [],
                          ],
                        },
                        [
                          [
                            { kind: 'plus', value: '+' },
                            {
                              kind: 'term',
                              value: [
                                { kind: 'number', value: [{ kind: 'zero', value: '0' }, null] },
                                [],
                              ],
                            },
                          ],
                        ],
                      ],
                    },
                    { kind: 'right_paren', value: ')' },
                  ],
                },
                [
                  [
                    { kind: 'mult', value: '*' },
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
                                [],
                              ],
                            },
                            [
                              [
                                { kind: 'plus', value: '+' },
                                {
                                  kind: 'term',
                                  value: [
                                    {
                                      kind: 'number',
                                      value: [
                                        {
                                          kind: 'natural_number',
                                          value: [null, { kind: 'non_zero_digit', value: '2' }, []],
                                        },
                                        null,
                                      ],
                                    },
                                    [],
                                  ],
                                },
                              ],
                            ],
                          ],
                        },
                        { kind: 'right_paren', value: ')' },
                      ],
                    },
                  ],
                ],
              ],
            },
          ],
        ],
      ],
    } as unknown) as EXPR),
  ).toBeCloseTo(38.00647493319099);
});
