import { trpcConfig } from './trpc-config';

describe('trpcConfig', () => {
  it('should work', () => {
    expect(trpcConfig()).toEqual('trpc-config');
  });
});
