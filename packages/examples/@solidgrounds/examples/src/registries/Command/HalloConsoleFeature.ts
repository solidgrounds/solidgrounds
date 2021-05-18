import { ConsoleFeatureServices } from '../ConsoleFeature';
import { HalloConsoleCommand } from './HalloConsoleCommand';
import { FF } from '@solidgrounds/core';

export const HalloConsoleFeature: FF<unknown, ConsoleFeatureServices> = ({
  register,
  construct,
}) => ({
  ...register('consoleCommands', construct(HalloConsoleCommand)),
});
