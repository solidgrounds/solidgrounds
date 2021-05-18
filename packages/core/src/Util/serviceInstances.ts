import { ServicesAsFactories } from '../Value';

export const serviceInstances = <T>(services: ServicesAsFactories<T>): T => {
  const instances: Record<string, unknown> = {};
  for (const [name, sfr] of Object.entries(services)) {
    Object.defineProperty(instances, name, { get: sfr as () => unknown });
  }
  return instances as unknown as T;
};
