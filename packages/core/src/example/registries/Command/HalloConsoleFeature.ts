import { FF } from '@solidgrounds/core';
import { ConsoleFeatureServices } from '../ConsoleFeature';
import { HalloConsoleCommand } from './HalloConsoleCommand';

export const HalloConsoleFeature: FF<unknown, ConsoleFeatureServices> = ({ register, construct }) => ({
  ...register('consoleCommands', construct(HalloConsoleCommand)),
});
