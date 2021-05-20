import solidgrounds, { FF } from '../../../index';
import { InferMapArgumentRegister } from '../RegistryMapContext';

it('Can infer types of object', () => {
  type T = {
    basket: {
      appel: string;
    };
  };

  type Type = InferMapArgumentRegister<T, T['basket']>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let check: Type;

  check = ['appel', () => 'correct'];
  check = { appel: () => 'correctObject' };

  // @ts-expect-error should be string
  check = ['appel', () => 1];
  // @ts-expect-error key does not exists.
  check = ['banana', () => 'correct'];
  // @ts-expect-error should be string
  check = { appel: () => 1 };
  // @ts-expect-error key does not exists.
  check = { banana: () => 'correctObject' };

  expect(check).toBeDefined();
});
interface SimpleMap<K, V> {
  set(key: K, value: V): this;
}

it('Can infer types of map', () => {
  type T = {
    basket: SimpleMap<'appel', string>;
  };

  type Type = InferMapArgumentRegister<T, T['basket']>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let check: Type;

  check = ['appel', () => 'correct'];
  check = { appel: () => 'correctObject' };

  // @ts-expect-error should be string
  check = ['appel', () => 1];
  // @ts-expect-error key does not exists.
  check = ['banana', () => 'correct'];
  // @ts-expect-error should be string
  check = { appel: () => 1 };
  // @ts-expect-error key does not exists.
  check = { banana: () => 'correctObject' };

  expect(check).toBeDefined();
});

it('Can use plain object', async () => {
  interface MyFeatureService {
    registry: Record<'hi', number>;
  }

  const MyFeature: FF<MyFeatureService> = ({ register }) => {
    return {
      registry: () => ({ hi: 2 }),
      ...register('registry', ['hi', () => 1]),

      ...register('registry', { hi: () => 1 }),

      // @ts-expect-error type is wrong.
      ...register('registry', ['hi', () => 'error']),

      // @ts-expect-error key is wrong.
      ...register('registry', ['bye', () => 1]),

      // @ts-expect-error type is wrong.
      ...register('registry', { hi: () => 'error' }),

      // @ts-expect-error key is wrong.
      ...register('registry', { cya: () => 1 }),
    };
  };
  const result = await solidgrounds().add(MyFeature).build();
  expect(result.registry).toEqual({
    bye: 1,
    cya: 1,
    hi: 'error',
  });
});

it('Can use map', async () => {
  interface MyFeatureService {
    registry: SimpleMap<'hi', number>;
  }

  class registry {
    public readonly values: [string, number][] = [];
    set(key: 'hi', value: number): this {
      this.values.push([key, value]);
      return this;
    }
  }

  const MyFeature: FF<MyFeatureService> = ({ register, construct }) => {
    return {
      registry: construct(registry),
      ...register('registry', ['hi', () => 1]),

      ...register('registry', { hi: () => 1 }),

      // @ts-expect-error type is wrong.
      ...register('registry', ['hi', () => 'error']),

      // @ts-expect-error key is wrong.
      ...register('registry', ['bye', () => 1]),

      // @ts-expect-error type is wrong.
      ...register('registry', { hi: () => 'error' }),

      // @ts-expect-error key is wrong.
      ...register('registry', { cya: () => 1 }),
    };
  };
  const result = await solidgrounds().add(MyFeature).build();
  expect((result.registry as registry).values).toMatchInlineSnapshot(`
    Array [
      Array [
        "hi",
        1,
      ],
      Array [
        "hi",
        1,
      ],
      Array [
        "hi",
        "error",
      ],
      Array [
        "bye",
        1,
      ],
      Array [
        "hi",
        "error",
      ],
      Array [
        "cya",
        1,
      ],
    ]
  `);
});
