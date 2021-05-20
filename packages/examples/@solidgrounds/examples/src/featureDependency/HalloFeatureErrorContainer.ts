import { HalloFeature } from './HalloFeature';
import solidgrounds from '@solidgrounds/core';

solidgrounds()
  // @ts-expect-error Example missing Logger service
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloServiceFactory('John');
    service.speak();
  });
