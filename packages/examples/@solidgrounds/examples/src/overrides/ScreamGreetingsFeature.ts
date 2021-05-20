import { FF } from '@solidgrounds/core';
import { ScreamGreetingsService } from './services/ScreamGreetingsService';
import { GreetingsFeatureServices } from './GreetingsFeature';

export const ScreamGreetingsFeature: FF<unknown, GreetingsFeatureServices> = ({
  override,
  construct,
}) => ({
  ...override('greetingService', construct(ScreamGreetingsService)),
});
