import { solidgrounds } from '@solidgrounds/core';
import { LogFeature } from './LogFeature';

solidgrounds()
  .add(LogFeature)
  .build()
  .then(({ logger }) => {
    logger.info('Hallo word');
  });
