import solidgrounds, { FF } from '@solidgrounds/core';
import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import {
  BaseReduxFeature,
  BaseReduxFeatureServices,
} from '../BaseReduxFeature';

it('Can add middleware', async () => {
  const TestMiddleware: Middleware =
    (api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
      next(action);
      if (action.type === 'leaving') {
        api.dispatch({
          type: 'bye',
        });
      }
    };

  function testReducer(state = 'hi', action: Action): string {
    switch (action.type) {
      case 'leaving':
        return 'bye';
      case 'bye':
        return 'bye-bye';
    }

    return state;
  }

  const MyFeature: FF<unknown, BaseReduxFeatureServices<{ test: string }>> = ({
    register,
  }) => ({
    ...register('middleware', () => TestMiddleware),
    ...register('reducers', ['test', () => testReducer]),
  });

  const { store, middleware: m } = await solidgrounds()
    .add(BaseReduxFeature<{ test: string }, AnyAction>())
    .add(MyFeature)
    .build();

  expect(m.length).toEqual(1);

  expect(store.getState()).toEqual({ test: 'hi' });
  store.dispatch({ type: 'leaving' });
  expect(store.getState()).toEqual({ test: 'bye-bye' });
});
