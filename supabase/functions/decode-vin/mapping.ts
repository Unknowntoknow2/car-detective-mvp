export const loadNHTSAMap = async () => {
  if (process.env.NODE_ENV === 'test' || process.env.DISABLE_NETWORK === '1') {
    const json = await import('./fixtures/nhtsa-map.json', { assert: { type: 'json' } });
    return json.default;
  }
  return {};
};
