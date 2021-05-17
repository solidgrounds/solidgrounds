import { LogFeature } from '../singleton/LogFeature';
import { HalloFeature } from './HalloFeature';
import solidgrounds from "@solidgrounds/core";

solidgrounds()
  .add(LogFeature)
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloServiceFactory('John');
    service.speak();
  });
