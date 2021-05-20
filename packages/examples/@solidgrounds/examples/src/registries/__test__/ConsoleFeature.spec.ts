import { ConsoleFeature } from '../ConsoleFeature';
import { HalloConsoleFeature } from '../Command/HalloConsoleFeature';
import { ByeConsoleFeature } from '../Command/ByeConsoleFeature';
import solidgrounds from '@solidgrounds/core';

it('should run', async () => {
  await solidgrounds()
    .add(ConsoleFeature)
    .add(HalloConsoleFeature)
    .add(ByeConsoleFeature)
    .build()
    .then((container) => {
      return container.consoleService.handle();
    });
});
