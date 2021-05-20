import { namedMemo } from '../namedMemo';
import { FC, ReactNode } from 'react';

it('Has name', () => {
  const test: FC<{ children: ReactNode }> = ({ children }) => {
    return <div>children</div>;
  };

  const Component = namedMemo('test', test);
  expect(
    (Component as unknown as { type: Record<string, unknown> }).type.displayName
  ).toEqual('test');
});
