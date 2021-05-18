import { CasualGreetingService } from './services/CasualGreetingService';
import { GreetingsServiceInterface } from './services/GreetingsServiceInterface';
import { FF } from '@solidgrounds/core';

export interface GreetingsFeatureServices {
  greetingService: GreetingsServiceInterface;
}

export const GreetingsFeature: FF<GreetingsFeatureServices> = ({construct}) => ({
  greetingService: construct(CasualGreetingService),
});
