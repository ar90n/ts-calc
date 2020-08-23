export const hasKindAndValue = (v: unknown): v is { kind: unknown; value: unknown } => {
  return v instanceof Object && 'kind' in v && 'value' in v;
};
