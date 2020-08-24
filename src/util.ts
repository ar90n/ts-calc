type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

export const hasKindAndValue = (v: unknown): v is { kind: unknown; value: unknown } => {
  return v instanceof Object && 'kind' in v && 'value' in v;
};

export const creatToken = <
  T extends Pick<T, 'kind' | 'value'>,
  F = T['value'] extends UnionToIntersection<T['value']> ? () => T : (v: T['value']) => T
>(
  tag: T['kind'],
  values: readonly T['value'][],
) => {
  const ret = {
    tag: tag,
    values: values,
    is: (v: unknown): v is T => hasKindAndValue(v) && v.kind === tag,
  };

  if (values.length === 1) {
    return {
      ...ret,
      of: (((): T =>
        ({
          kind: tag,
          value: values[0],
        } as T)) as unknown) as F,
    };
  } else {
    return {
      ...ret,
      of: (((v: T['value']): T =>
        ({
          kind: tag,
          value: v,
        } as T)) as unknown) as F,
    };
  }
};
