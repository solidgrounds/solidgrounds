import { FF } from '@solidgrounds/core';
import { LoggerInterface } from './LoggerInterface';
import { ConsoleLogger } from './ConsoleLogger';

export interface LogServices {
  logger: LoggerInterface;
}

export const LogFeature: FF<LogServices> = ({ construct }) => ({
  logger: construct(ConsoleLogger),
});
