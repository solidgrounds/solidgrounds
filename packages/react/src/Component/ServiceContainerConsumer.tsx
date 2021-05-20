import * as React from 'react';
import { FC, ReactNode, useContext } from 'react';
import { ServiceContainerContext } from '../ServiceContainerContext';

export interface HttpClientConsumerProps<T> {
  children: (serviceContainer: T) => ReactNode;
}

export function ServiceContainerConsumer<T>({
  children,
}: HttpClientConsumerProps<T>) {
  const context = useContext(ServiceContainerContext);
  if (!context) {
    throw new Error('No provider found for service container');
  }
  return <>{children(context as T)}</>;
}
