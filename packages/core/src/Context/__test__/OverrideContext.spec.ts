import { FF, solidgrounds } from '../../index';

interface SpeakServiceInterface {
  speak(name: string): string;
}

interface GreetingsFeatureServices {
  halloService: SpeakServiceInterface;

  byeService: SpeakServiceInterface;

  halloAndByeService: SpeakServiceInterface;
}

const GreetingsFeature: FF<GreetingsFeatureServices> = () => ({
  halloService(): SpeakServiceInterface {
    return {
      speak: (name: string): string => {
        return `Hallo ${name}`;
      },
    };
  },

  byeService(): SpeakServiceInterface {
    return {
      speak: (name: string): string => {
        return `Bye ${name}`;
      },
    };
  },

  halloAndByeService(): SpeakServiceInterface {
    return {
      speak: (name: string): string => {
        return `${this.halloService().speak(name)}, ${this.byeService().speak(
          name
        )}`;
      },
    };
  },
});

it('Override service', async () => {
  const MyHalloFeature: FF<void, GreetingsFeatureServices> = ({ override }) => {
    return {
      ...override('halloService', () => () => ({
        speak: (): string => {
          return '@'; // tumbleweed
        },
      })),
    };
  };

  const container = await solidgrounds()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('@');
  expect(container.halloAndByeService.speak('John')).toEqual('@, Bye John');
});

const screamSpeakService =
  (service: () => SpeakServiceInterface) => (): SpeakServiceInterface => ({
    speak: (name: string): string => `${service().speak(name)}!!!`,
  });

const ScreamGreetingsFeature: FF<void, GreetingsFeatureServices> = ({
  override,
}) => {
  return {
    ...override('halloService', screamSpeakService),
    ...override('byeService', screamSpeakService),
  };
};

const HiHalloFeature: FF<void, GreetingsFeatureServices> = ({ override }) => {
  return {
    ...override('halloService', (original) => () => ({
      speak: (name: string): string =>
        original().speak(name).replace('Hallo', 'Hi'),
    })),
  };
};

it('Can override by key', async () => {
  const MyHalloFeature: FF<
    { stutter: SpeakServiceInterface },
    GreetingsFeatureServices
  > = ({ override }) => {
    return {
      stutter: () => ({
        speak(name: string): string {
          return `Halllll    o ${name}`;
        },
      }),
      ...override('halloService', 'stutter'),
    };
  };

  const container = await solidgrounds()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('Halllll    o John');
});

it('Can be decorated multiple times', async () => {
  const container = await solidgrounds()
    .add(GreetingsFeature)
    .add(ScreamGreetingsFeature)
    .add(HiHalloFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('Hi John!!!');

  expect(container.halloAndByeService.speak('John')).toEqual(
    'Hi John!!!, Bye John!!!'
  );
});

it('Can be decorated in a different order', async () => {
  const container = await solidgrounds()
    .add(GreetingsFeature)
    .add(HiHalloFeature)
    .add(ScreamGreetingsFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('Hi John!!!');

  expect(container.halloAndByeService.speak('John')).toEqual(
    'Hi John!!!, Bye John!!!'
  );
});

it('Can alter multiple services', async () => {
  const container = await solidgrounds()
    .add(GreetingsFeature)
    .add(HiHalloFeature)
    .add(ScreamGreetingsFeature)
    .build();

  expect(container.byeService.speak('John')).toEqual('Bye John!!!');

  expect(container.halloAndByeService.speak('Jane')).toEqual(
    'Hi Jane!!!, Bye Jane!!!'
  );
});

it('Cannot add extra services with overrides', async () => {
  const MyHalloFeature: FF<unknown> = ({ override }) =>
    // @ts-expect-error test does not exists.
    override('test' as unknown, () => () => void 0);

  const container = await solidgrounds().add(MyHalloFeature);

  await expect(container.build()).rejects.toThrow();
});

it('If service is override, original should not be called anymore', async () => {
  const spy = jest.fn();

  interface MyFeatureServices {
    foo: string;
  }

  const MyFeature: FF<MyFeatureServices> = () => ({
    foo: spy,
  });
  const MyOverrideFeature: FF<unknown, MyFeatureServices> = ({ override }) => ({
    ...override('foo', () => () => 'bar'),
  });
  const { foo: f } = await solidgrounds()
    .add(MyFeature)
    .add(MyOverrideFeature)
    .build();

  expect(f).toEqual('bar');
  expect(spy).not.toBeCalled();
});
