import { solidgrounds } from '@solidgrounds/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';
import { FormalGreetingsFeature } from './FormalGreetingsFeature';

solidgrounds()
  .add(LogFeature)
  .add(GreetingsFeature)
  .add(FormalGreetingsFeature)
  .build()
  .then(({ logger, greetingService }) => {
    logger.info(greetingService.greet('Solidgrounds'));
  });
