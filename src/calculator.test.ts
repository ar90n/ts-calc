import { Readable } from 'stream';
import { calc } from './calculator';

const sin = Math.sin; // eslint-disable-line @typescript-eslint/no-unused-vars
const cos = Math.cos; // eslint-disable-line @typescript-eslint/no-unused-vars
const tan = Math.tan; // eslint-disable-line @typescript-eslint/no-unused-vars
const exp = Math.exp; // eslint-disable-line @typescript-eslint/no-unused-vars

const testExprs = [
  '1 + 2',
  '1 - 2',
  '1 * 2',
  '1 / 2',
  '0',
  'sin(sin(sin(0.1)))',
  '1 / 1 + 1 / 2 + 1 / 3 + 1 / 4 + 1 / 5 + 1 / 6 + 1/ 7 + 1   / 8 +1/9 +1/10',
  '((18 + 5.5) * 2 - 4 + sin(0.2)) / 2 - 1',
  'exp(0) - 1.0',
  '+1-+1+-1+1',
  '(1)',
  '1-(1)',
];
testExprs.forEach((expr: string) => {
  test(`test ${expr}`, async done => {
    const stream = Readable.from(expr.split(''));
    const buffer = await calc(stream);
    expect(buffer).toBeCloseTo(eval(expr), 5);
    done();
  });
});
