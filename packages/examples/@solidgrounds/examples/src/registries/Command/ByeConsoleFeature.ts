import { ConsoleCommand } from '../ConsoleCommand';
import { ByeConsoleCommand } from './ByeConsoleCommand';
import { ConsoleFeatureServices } from '../ConsoleFeature';
import { FF } from '@solidgrounds/core';

interface ByeConsoleServices {
  byeConsoleCommand: ConsoleCommand;
}

export const ByeConsoleFeature: FF<ByeConsoleServices, ConsoleFeatureServices> =
  ({ register, construct }) => ({
    ...register('consoleCommands', 'byeConsoleCommand'),
    byeConsoleCommand: construct(ByeConsoleCommand),
  });
