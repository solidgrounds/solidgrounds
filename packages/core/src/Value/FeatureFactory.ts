import { ServicesAsFactories } from './ServiceFactory';
import { FeatureFactoryContext } from '../Context';

// eslint-disable-next-line @typescript-eslint/ban-types
export type FeatureFactory<OwnServices, Dependencies = {}> = (
  this: ServicesAsFactories<OwnServices & Dependencies>,
  services: FC<Dependencies, OwnServices>
) => ServicesAsFactories<OwnServices>;

export type FC<Dependencies, OwnServices> = FeatureFactoryContext<
  OwnServices & Dependencies
>;
export type UFC = FC<unknown, unknown>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type FF<OwnServices, Dependencies = {}> = FeatureFactory<
  OwnServices,
  Dependencies
>;
export type UFF = FeatureFactory<unknown, unknown>;
