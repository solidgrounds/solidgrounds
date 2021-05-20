import { FF } from '@solidgrounds/core';
import {
  Action,
  AnyAction,
  applyMiddleware,
  CombinedState,
  combineReducers,
  compose,
  createStore,
  Middleware,
  PreloadedState,
  Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer,
} from 'redux';

/**
 * Basic redux functionality services.
 */
export interface BaseReduxFeatureServices<S, A extends Action = AnyAction> {
  reducers: ReducersMapObject<S, A>;
  middleware: Array<Middleware>;
  enhancers: Array<StoreEnhancer>;

  store: Store<S, A>;
  rootReducer: Reducer<CombinedState<S>, A>;
  rootEnhancer: StoreEnhancer;
  middlewareEnhancer: StoreEnhancer;

  preloadedState: PreloadedState<S> | undefined;
}

export const BaseReduxFeature: <S, A extends Action = AnyAction>() => FF<
  BaseReduxFeatureServices<S, A>
> =
  <S, A extends Action>() =>
  ({ register }) => ({
    reducers: () => ({} as ReducersMapObject<S, A>),
    middleware: () => [],
    enhancers: () => [],
    ...register('enhancers', 'middlewareEnhancer'),
    store(): Store<S, A> {
      const state = this.preloadedState();
      if (state === undefined) {
        return createStore(
          this.rootReducer(),
          this.rootEnhancer()
        ) as unknown as Store<S, A>;
      }
      return createStore(
        this.rootReducer(),
        state,
        this.rootEnhancer()
      ) as unknown as Store<S, A>;
    },
    rootEnhancer() {
      return compose(...this.enhancers());
    },
    rootReducer() {
      const reducers = this.reducers();
      return combineReducers(reducers);
    },
    middlewareEnhancer() {
      return applyMiddleware(...this.middleware());
    },
    preloadedState: () => undefined,
  });
