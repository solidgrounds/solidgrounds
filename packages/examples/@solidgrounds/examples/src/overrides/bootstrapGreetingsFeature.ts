import { solidgrounds } from '@solidgrounds/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';

solidgrounds()
  .add(LogFeature)
  .add(GreetingsFeature)
  .build()
  .then(({ logger, greetingService }) => {
    logger.info(greetingService.greet('Solidgrounds'));
  });
