import React from 'react';
import { render } from '@testing-library/react';
import { TrpcProvider } from '../src/trpc/provider';

describe('TrpcProvider', () => {
  it('should render children without crashing', () => {
    const { getByText } = render(
      <TrpcProvider>
        <span>content</span>
      </TrpcProvider>
    );
    expect(getByText('content')).toBeTruthy();
  });
});
