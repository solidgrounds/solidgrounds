// Map types
import { toPairs, every, isObjectLike, isArrayLike } from 'lodash';
import { GetServiceFactory, KSF, SF } from '../../Value';
import { CompileContext } from '../CompileContext';
import { ContainerError } from '../../Error';

export type MapKey = string | number | symbol;

export interface SetMapLike<TType, TKey extends MapKey> {
  set(key: TKey, value: TType): this | unknown;
}

export type MapRecord<TType, TKey extends MapKey> = Record<TKey, TType>;

export type MapLike<TType, TKey extends MapKey> =
  | SetMapLike<TType, TKey>
  | MapRecord<TType, TKey>;

export type MapTupleArgument<Services, TType, TKey> = [
  TKey,
  KSF<Services, TType>
];
export type MapObjectArgument<Services, TType, TKey extends MapKey> = Record<
  TKey,
  KSF<Services, TType>
>;

// Map arguments.
export type RegisterMapArgument<Services, TType, TKey extends MapKey> =
  | MapTupleArgument<Services, TType, TKey>
  | MapObjectArgument<Services, TType, TKey>;

export type InferMapArgumentRegister<T, S> = S extends MapLike<
  infer TType,
  infer TKey
>
  ? RegisterMapArgument<T, TType, TKey>
  : never;

export type InferMapArgumentsRegister<T, S> = S extends MapLike<
  infer TType,
  infer TKey
>
  ? RegisterMapArgument<T, TType, TKey>[]
  : never;

export const isMapObjectArgument = <Services, TType, TKey extends MapKey>(
  arg: unknown
): arg is MapObjectArgument<Services, TType, TKey> => {
  return isObjectLike(arg);
};

export const isTupleArgument = <Services, TType, TKey extends MapKey>(
  arg: unknown
): arg is MapTupleArgument<Services, TType, TKey> => {
  return isArrayLike(arg) && arg.length === 2;
};

export const isRegisterMapArgument = (
  arg: unknown
): arg is RegisterMapArgument<unknown, unknown, MapKey> => {
  return isMapObjectArgument(arg) || isTupleArgument(arg);
};

export const isRegisterMapArguments = (
  args: unknown[]
): args is RegisterMapArgument<unknown, unknown, MapKey>[] => {
  return every(args, (arg) => {
    return isRegisterMapArgument(arg);
  });
};

const getServices = <T, TType, TKey extends MapKey>(
  getService: GetServiceFactory<T>,
  items: RegisterMapArgument<T, TType, TKey>[]
): [TKey, SF<TType>][] => {
  const result: [TKey, SF<TType>][] = [];
  items.forEach((arg: RegisterMapArgument<T, TType, TKey>) => {
    if (isTupleArgument(arg)) {
      const [tag, item] = arg;
      result.push([tag, typeof item === 'string' ? getService(item) : item] as [
        TKey,
        SF<TType>
      ]);
    } else {
      toPairs(arg).forEach(([tag, item]) => {
        result.push([
          tag,
          typeof item === 'string' ? getService(item as keyof T) : item,
        ] as unknown as [TKey, SF<TType>]);
      });
    }
  });
  return result;
};

export function isMapLike<TType, TKey extends MapKey>(
  register: unknown
): register is MapLike<TType, TKey> {
  return isMapWithSet(register) || isObjectLike(register);
}

export function isMapWithSet<TType, TKey extends MapKey>(
  register: unknown
): register is SetMapLike<TType, TKey> {
  return (
    typeof register === 'object' &&
    typeof (register as SetMapLike<TType, TKey>).set === 'function'
  );
}

export const registerToMap = <
  TDependencies,
  TType,
  TKey extends MapKey,
  TService
>(
  context: CompileContext<TDependencies>,
  parent: SF<TService>,
  items: RegisterMapArgument<TDependencies, TType, TKey>[]
): TService => {
  const serverFactories = getServices<TDependencies, TType, TKey>(
    context.getServiceFactory,
    items
  );
  let map = parent() as unknown as MapLike<TType, TKey>;
  if (!isMapLike<TType, TKey>(map)) {
    throw new ContainerError(
      `Expected MapLike object, not ${parent.name} (${typeof map})`
    );
  }
  serverFactories.forEach(([key, service]) => {
    if (isMapWithSet(map)) {
      const result = map.set(key, service());
      if (isMapLike(result) && isMapWithSet(result)) {
        map = result;
      }
    } else {
      (map as unknown as MapRecord<TType, TKey>)[key as TKey] = service();
    }
  });
  return map as unknown as TService;
};
