import {
  FeatureGroupBuildInfo,
  FeatureFactoryBuildInfo,
  USF,
  UFF,
  UFC,
  assertServiceFactory,
} from './Value';
import { ContainerError } from './Error';
import { toPairs } from 'lodash';
import { asServiceFactoryReference } from './serviceReferenceFactoryInterface';
import { GlobalInvokeStack } from './GlobalInvokeStack';
import { FeatureGroupFactoryInterface } from './FeatureGroupFactoryInterface';

export class FeatureGroupFactory implements FeatureGroupFactoryInterface {
  public build<S>(
    featureFactories: UFF[],
    name: string
  ): FeatureGroupBuildInfo<S> {
    const info = new FeatureGroupBuildInfo<S>(name, this);
    const { featureContext, references } = info;
    /**
     * Set all feature function to the container object.
     */
    for (const feature of featureFactories) {
      const featureFactory = new FeatureFactoryBuildInfo(feature);
      info.addFeature(featureFactory);
      GlobalInvokeStack.run<S>(
        { featureFactory, serviceContainer: info },
        () => {
          /**
           * We bind the feature so the internal reference are correct
           */
          const result = feature.bind(references)(
            featureContext as UFC
          ) as Record<string, USF>;
          for (const [name, service] of toPairs(result)) {
            if (name in references) {
              if ((references as Record<string, USF>)[name] === service) {
                continue;
              }
              throw new ContainerError(`Service ${name} already registered`);
            }
            assertServiceFactory(service, name);
            const sfr = asServiceFactoryReference(service);
            Object.assign(references, {
              [name]: sfr,
            });
            featureFactory.addService(sfr.info);
            /**
             * We rebind function call to allow closures inside the feature.
             */
            result[name] = info.getServiceFactory(name as keyof S);
          }
        }
      );
    }

    info.resolvePendingReferences();

    return info;
  }
}
