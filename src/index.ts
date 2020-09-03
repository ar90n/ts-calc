#!/usr/bin/env node
import { Transform, TransformCallback } from 'stream';
import { calc } from './calculator';

const toString = new Transform({
  transform(chunk: Buffer, encoding: string, done: TransformCallback): void {
    chunk
      .toString('utf-8', 0, chunk.length)
      .split('')
      .forEach((c: string) => this.push(c));
    done();
  },
  objectMode: true,
});

calc(process.stdin.pipe(toString)).then((result: number) => console.log(result));
