import { useContext } from 'react';
import { ServiceContainerContext } from '../ServiceContainerContext';

export const useServices = <T>(): T => {
  return useContext(ServiceContainerContext) as T;
};
