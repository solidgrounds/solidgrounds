import { solidgrounds } from '@solidgrounds/core';
import { LogFeature } from './LogFeature';

solidgrounds()
  .add(LogFeature)
  .build()
  .then((container) => {
    const johnLogger = container.prefixedLogger('John:');
    johnLogger.info('Hallo Jane!');
    const janeLogger = container.prefixedLogger('Jane:');
    janeLogger.info('Hi John!');
  });
