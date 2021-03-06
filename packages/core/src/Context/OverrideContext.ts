import { CompileContext } from './CompileContext';
import { assertFeatureFactoryWindow, SF } from '../Value';
import { GlobalInvokeStack } from '../GlobalInvokeStack';
import { PickByValue } from 'utility-types';
import { isFunction } from 'lodash';

export type ServiceFactoryOverrideArg<T, S> =
  | keyof PickByValue<T, S>
  | ((original: SF<S>) => SF<S>);
export type ServiceFactoryOverride<S> = (original: SF<S>) => SF<S>;

/**
 * Context for overriding services.
 */
export interface OverrideContext<T> {
  override<Key extends keyof T>(
    name: Key,
    override: ServiceFactoryOverrideArg<T, T[Key]>
  ): Record<string, never>;
}

export const createOverrideContext = <T>(
  context: CompileContext<T>
): OverrideContext<T> => {
  return {
    override<Key extends keyof T>(
      name: Key,
      override: ServiceFactoryOverrideArg<T, T[Key]>
    ): Record<string, never> {
      const service = context.getServiceFactory(name);
      const window = GlobalInvokeStack.getCurrent();
      assertFeatureFactoryWindow(window);
      let overrideBy: ServiceFactoryOverrideArg<T, T[Key]> = override;
      if (!isFunction(overrideBy)) {
        const sf = context.getServiceFactory(override as unknown as keyof T);
        overrideBy = (() => sf) as unknown as ServiceFactoryOverrideArg<
          T,
          T[Key]
        >;
      }
      service.info.addOverride({
        featureFactory: window.featureFactory,
        overrideBy: overrideBy as ServiceFactoryOverride<T[Key]>,
        success: false,
      });
      return {};
    },
  };
};
