import * as React from 'react';
import { FC, ReactNode, useEffect, useState } from 'react';
import {
  KernelFeatureServices,
  ServiceContainerFactory,
} from '@solidgrounds/core';
import { ServiceContainerContext } from '../ServiceContainerContext';

export interface ServiceContainerProviderProps {
  children: ReactNode;
  loader?: ReactNode;
  onError?: (e: unknown) => void;
  serviceContainer: ServiceContainerFactory<KernelFeatureServices>;
}

export const ServiceContainerProvider: FC<ServiceContainerProviderProps> = ({
  children,
  serviceContainer,
  loader,
  onError,
}) => {
  const [services, setServices] = useState<unknown>();
  useEffect(() => {
    serviceContainer.build().then(setServices).catch(onError);
  }, [serviceContainer, setServices, onError]);
  if (!services) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <React.Fragment>{loader || null}</React.Fragment>;
  }
  return (
    <ServiceContainerContext.Provider value={services}>
      {children}
    </ServiceContainerContext.Provider>
  );
};
