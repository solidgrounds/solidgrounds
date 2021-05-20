import { FF } from '@solidgrounds/core';
import { composeWithDevTools, EnhancerOptions } from 'redux-devtools-extension';
import { BaseReduxFeatureServices } from './BaseReduxFeature';
import { Action, AnyAction, StoreEnhancer } from 'redux';

export interface DevReduxFeatureServices {
  devToolsOptions: EnhancerOptions;
}

const _composeWithDevTools = (
  options: EnhancerOptions,
  enhancers: Array<StoreEnhancer>
): StoreEnhancer => composeWithDevTools(options)(...enhancers);

export function DevReduxFeature<S, A extends Action = AnyAction>(): FF<
  DevReduxFeatureServices,
  BaseReduxFeatureServices<S, A>
> {
  return ({ override, compose }) => ({
    devToolsOptions: () => ({}),
    ...override('rootEnhancer', () =>
      compose(_composeWithDevTools, 'devToolsOptions', 'enhancers')
    ),
  });
}
