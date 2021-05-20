import { FF, KernelFeatureServices } from '@solidgrounds/core';
import { Action, AnyAction } from 'redux';
import {
  combineEpics,
  createEpicMiddleware,
  Epic,
  EpicMiddleware,
} from 'redux-observable';
import { BaseReduxFeatureServices } from './BaseReduxFeature';

export interface ReduxEpicFeatureServices<S, A extends Action = AnyAction> {
  epics: Epic<A, A, S>[];
  rootEpic: Epic<A, A, S>;
  epicMiddleware: EpicMiddleware<A, A, S>;
  setupEpics: () => void;
}

export function ReduxEpicFeature<S, A extends Action = AnyAction>(): FF<
  ReduxEpicFeatureServices<S, A>,
  BaseReduxFeatureServices<S, A> & KernelFeatureServices
> {
  return ({ register, compose }) => ({
    epics: () => [],
    ...register('middleware', 'epicMiddleware'),
    ...register('compilerPass', 'setupEpics'),
    setupEpics: compose(
      (
        epicMiddleware: EpicMiddleware<A, A, S>,
        rootEpic: Epic<A, A, S>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _store
      ) => {
        return () => epicMiddleware.run(rootEpic);
      },
      'epicMiddleware',
      'rootEpic',
      'store'
    ),
    epicMiddleware() {
      return createEpicMiddleware();
    },
    rootEpic(): Epic {
      return combineEpics(...this.epics());
    },
  });
}
