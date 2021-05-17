import { solidgrounds } from '@solidgrounds/core';
import { ByeConsoleFeature } from './Command/ByeConsoleFeature';
import { HalloConsoleFeature } from './Command/HalloConsoleFeature';
import { ConsoleFeature } from './ConsoleFeature';

solidgrounds()
  .add(ConsoleFeature)
  .add(HalloConsoleFeature)
  .add(ByeConsoleFeature)
  .build()
  .then((container) => container.consoleService.handle());
