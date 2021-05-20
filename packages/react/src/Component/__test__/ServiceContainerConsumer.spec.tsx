import * as React from 'react';
import { render } from '@testing-library/react';
import { ServiceContainerConsumer } from '../';

it('Should be able to create a provider', () => {
  const mockConsumer = jest.fn();
  mockConsumer.mockReturnValue(<div>Dummy</div>);
  expect(() => {
    render(<ServiceContainerConsumer>{mockConsumer}</ServiceContainerConsumer>);
  }).toThrowError('No provider found for service container');
  expect(mockConsumer).not.toBeCalled();
});
