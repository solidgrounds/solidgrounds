import solidgrounds, { FF } from '@solidgrounds/core';
import { Action, AnyAction, Dispatch, Middleware } from 'redux';
import { filter, mapTo } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReduxFeature, ReduxFeatureServices } from '../ReduxFeature';

it('Can add reducers, middleware and epics from other features', async () => {
  const spyMiddleware = jest.fn();

  const TestMiddleware: Middleware =
    () => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
      spyMiddleware(action.type);
      return next(action);
    };

  function preferenceEpic(action$: Observable<Action>) {
    return action$.pipe(
      filter((action) => action.type === 'leaving'),
      mapTo({ type: 'bye!!' })
    );
  }

  function testReducer(state = 'hi', action: Action): string {
    switch (action.type) {
      case 'leaving':
        return 'bye';
    }
    return state;
  }

  const MyFeature: FF<unknown, ReduxFeatureServices<{ test: string }>> = ({
    register,
  }) => ({
    ...register('middleware', () => TestMiddleware),
    ...register('reducers', ['test', () => testReducer]),
    ...register('epics', () => preferenceEpic),
  });

  const { store, middleware, epics } = await solidgrounds()
    .add(ReduxFeature<{ test: string }>())
    .add(MyFeature)
    .build();

  expect(epics.length).toEqual(1);
  expect(middleware.length).toEqual(2);

  expect(store.getState()).toEqual({ test: 'hi' });
  store.dispatch({ type: 'leaving' });
  expect(store.getState()).toEqual({ test: 'bye' });
  expect(spyMiddleware).toBeCalledWith('leaving');
  expect(spyMiddleware).toBeCalledWith('bye!!');
});
