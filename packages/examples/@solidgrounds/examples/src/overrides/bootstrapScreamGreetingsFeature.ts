import { solidgrounds } from '@solidgrounds/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';
import { ScreamGreetingsFeature } from './ScreamGreetingsFeature';

solidgrounds()
  .add(LogFeature)
  .add(GreetingsFeature)
  .add(ScreamGreetingsFeature)
  .build()
  .then(({ logger, greetingService }) => {
    logger.info(greetingService.greet('Solidgrounds'));
  });
