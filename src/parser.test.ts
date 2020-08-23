import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import { DropDelimiterTransform, ParseNaturalNumbreaTransform } from './parser';
import { ZERO, DELIMITER, MINUS, NON_ZERO_DIGIT } from './lexer.type';
import { NATURAL_NUMBER } from './parser.type';

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

test('parse natural number', done => {
  const input = [MINUS.of(), NON_ZERO_DIGIT.of('1'), ZERO.of(), ZERO.of(), NON_ZERO_DIGIT.of('8')];
  const parseNaturalNumber = new ParseNaturalNumbreaTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseNaturalNumber).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([
      NATURAL_NUMBER.of(MINUS.of(), NON_ZERO_DIGIT.of('1'), [
        ZERO.of(),
        ZERO.of(),
        NON_ZERO_DIGIT.of('8'),
      ]),
    ]);
    done();
  });
});
