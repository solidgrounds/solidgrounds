/**
 * Context for creating new service factories.
 */
import { createNamedFunction, functionName, once } from './Util';
import {
  SF,
  isServiceFactoryReference,
  ServiceFactoryReference,
  ServiceFactoryInfo,
  isServiceFactoryInvokeWindow,
  ServiceFactoryInvokeWindow,
  FeatureGroupBuildInfo,
  assertFeatureFactoryWindow,
} from './Value';
import { GlobalInvokeStack } from './GlobalInvokeStack';

export type ServiceReferenceFactoryInterface = <T>(
  sf: SF<T>
) => ServiceFactoryReference<T>;

/**
 * The core for solidgrounds connecting system.
 *
 * Original Service Factory --> Trivially man in the middle  --> Service Factory Reference.
 */
export const asServiceFactoryReference = <T>(
  sf: SF<T>
): ServiceFactoryReference<T> => {
  /**
   * Context functions automatically wraps there return inside a reference.
   */
  if (isServiceFactoryReference(sf)) {
    return sf;
  }

  const window = GlobalInvokeStack.getCurrent();
  assertFeatureFactoryWindow(window);

  const name =
    functionName(sf) ??
    window.serviceContainer.createPrivateServiceFactoryName();
  /**
   * Bind original service to references so 'this' can be used.
   */
  let mainServicePointer: SF<T> = sf.bind(window.serviceContainer.references);

  /**
   * Every time service is called from inside a other service factory
   * the dependency will be added.
   */
  const sfr: ServiceFactoryReference<T> = createNamedFunction(name, () => {
    const current = GlobalInvokeStack.current();
    if (current && isServiceFactoryInvokeWindow(current)) {
      current.serviceFactory.addDependency(sfr.info as ServiceFactoryInfo);
    }
    return GlobalInvokeStack.run<T>(serviceFactoryWindow, cached);
  }) as ServiceFactoryReference<T>;
  sfr.info = new ServiceFactoryInfo(sfr);
  /**
   * The added window if this service function is called.
   */
  const serviceFactoryWindow: ServiceFactoryInvokeWindow<T> = {
    serviceFactory: sfr.info as ServiceFactoryInfo,
    featureFactory: window.featureFactory,
    serviceContainer: window.serviceContainer as FeatureGroupBuildInfo<T>,
  };

  /**
   * This builds the actual service function. This is done during run time
   * So only services that are required will be build during compile time.
   */
  const applyOverrides = (): T => {
    const override = sfr.info.getOverrides().find(({ success }) => !success);
    if (!override) {
      return mainServicePointer.call(this);
    }
    const ref = mainServicePointer;
    const result = override.overrideBy(() => {
      return (override.original = ref.call(this));
    });
    mainServicePointer = () => result();
    override.success = true;
    return applyOverrides();
  };

  /**
   * The only point where the service will be cached (if service function call succeeded).
   */
  const cached: () => T = once(applyOverrides, name);
  window.featureFactory.addService(sfr.info as ServiceFactoryInfo);
  return sfr;
};
