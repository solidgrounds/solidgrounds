import solidgrounds, { FF } from '../../index';

it('Can use async service as synchronise service', async () => {
  interface MyFeatureService {
    foo: number;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo: synchronize(async () => {
        return 1;
      }),
    };
  };
  const result = await solidgrounds()
    .add(MyFeature)
    .build();
  expect(result.foo).toEqual(1);
});

it('Can depend on async services as if they where synchronise service', async () => {
  interface MyFeatureService {
    foo: string;
    bar: string;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo() {
        return `foo-${this.bar()}`;
      },
      bar: synchronize(async () => {
        return 'bar';
      }),
    };
  };
  const result = await solidgrounds()
    .add(MyFeature)
    .build();
  expect(result.foo).toEqual('foo-bar');
});

interface MyAsyncFeatureService {
  foo: string;
  bar: string;
  aa: string;
  bb: string;
}

const MyAsyncFeature: FF<MyAsyncFeatureService> = ({ synchronize, compose }) => {
  return {
    foo() {
      return `foo-${this.bar()}-${this.aa()}`;
    },
    bar: synchronize(async () => {
      return 'bar';
    }),
    aa: synchronize(compose(async (bb: string) => {
      return `aa-${bb}`;
    }, 'bb')),
    bb: synchronize(compose(async (bar) => {
      return `bb-${bar}`;
    }, 'bar')),
  };
};
it('Can depend nested async services as if they where synchronise service', async () => {
  const result = await solidgrounds()
    .add(MyAsyncFeature)
    .build();
  expect(result.foo).toEqual('foo-bar-aa-bb-bar');
});

it('Can merge async services', async () => {
  const MergedFeature: FF<MyAsyncFeatureService> = ({ merge }) => {
    const result = merge(MyAsyncFeature).create();
    return result;
  };
  const result = await solidgrounds()
    .add(MergedFeature)
    .build();
  expect(result.foo).toEqual('foo-bar-aa-bb-bar');
});

it('Can catch errors', async () => {
  interface MyFeatureService {
    foo: number;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo: synchronize(async () => {
        throw new Error('Hi!');
      }),
    };
  };
  const result = solidgrounds()
    .add(MyFeature)
    .build();
  await expect(result).rejects.toThrow('Hi!');
});

it('Can catch referenced errors', async () => {
  interface MyFeatureService {
    foo: string;
    bar: string;
  }

  const MyFeature: FF<MyFeatureService> = ({ synchronize }) => {
    return {
      foo: synchronize(async () => {
        throw new Error('foo');
      }),
      bar() {
        return `${this.foo()}-bar`;
      },
    };
  };
  const result = solidgrounds()
    .add(MyFeature)
    .build();
  await expect(result).rejects.toThrow('foo');
});
