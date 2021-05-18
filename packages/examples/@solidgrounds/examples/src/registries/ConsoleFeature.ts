import { ConsoleService } from './ConsoleService';
import { ConsoleCommand } from './ConsoleCommand';
import { FF } from '@solidgrounds/core';

export interface ConsoleFeatureServices {
  consoleCommands: ConsoleCommand[];
  consoleService: ConsoleService;
}

export const ConsoleFeature: FF<ConsoleFeatureServices> = ({ compose }) => {
  const consoleCommands: () => ConsoleCommand[] = compose(() => []);
  return {
    consoleCommands,
    consoleService: () => new ConsoleService(consoleCommands()),
  };
};
