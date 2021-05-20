import { DefaultLoggerFeature } from '../DefaultLoggerFeature';
import { PrefixDateLogger } from '../../PrefixDateLogger';
import solidgrounds from '@solidgrounds/core';

it('Can create DefaultLoggerModule', async () => {
  const { logger } = await solidgrounds().add(DefaultLoggerFeature).build();
  logger.info('test');
  expect(logger).toBeInstanceOf(PrefixDateLogger);
});
