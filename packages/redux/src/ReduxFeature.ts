import { FF, KernelFeatureServices } from '@solidgrounds/core';
import { BaseReduxFeature, BaseReduxFeatureServices } from './BaseReduxFeature';
import { DevReduxFeature, DevReduxFeatureServices } from './DevReduxFeature';
import { Action, AnyAction } from 'redux';
import { ReduxEpicFeature, ReduxEpicFeatureServices } from './EpicReduxFeature';

export type ReduxFeatureServices<S, A extends Action = AnyAction> =
  BaseReduxFeatureServices<S, A> &
    DevReduxFeatureServices &
    ReduxEpicFeatureServices<S, A>;

export function ReduxFeature<S, A extends Action = AnyAction>(): FF<
  ReduxFeatureServices<S, A>,
  KernelFeatureServices
> {
  return ({ merge }) =>
    merge('compilerInfo', 'compilerPass')
      // @ts-expect-error Should be fixed in merge typings
      .with(BaseReduxFeature<S, A>())
      .with(ReduxEpicFeature<S, A>())
      // @ts-expect-error Should be fixed in merge typings
      .with(DevReduxFeature<S, A>())
      .create({ name: 'ReduxFeature' });
}
