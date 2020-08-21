import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';
import { DropDelimiterTransform, ParseNaturalNumbreaTransform } from './parser';
import { delimtierTag, zeroTag, nonZeroDigitTag } from './lexer.type';
import { naturalNumberTag } from './parser.type';
import { tokenOf } from './lexer';

test('drop delimiters', done => {
  const input = [tokenOf(zeroTag, '0'), tokenOf(delimtierTag, ' '), tokenOf(zeroTag, '0')];
  const dropDelimiter = new DropDelimiterTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(dropDelimiter).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([tokenOf(zeroTag, '0'), tokenOf(zeroTag, '0')]);
    done();
  });
});

test('parse natural number', done => {
  const input = [tokenOf(nonZeroDigitTag, '1')];
  const parseNaturalNumber = new ParseNaturalNumbreaTransform({ objectMode: true });
  const reader = new ObjectReadableMock(input);
  const writer = new ObjectWritableMock();
  reader.pipe(parseNaturalNumber).pipe(writer);

  writer.on('finish', () => {
    expect(writer.data).toEqual([
      { kind: naturalNumberTag, value: [null, tokenOf(nonZeroDigitTag, '1'), []] },
    ]);
    done();
  });
});
