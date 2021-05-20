import { CompileContext } from '../CompileContext';
import { ContainerError } from '../../Error';
import {
  InferListArgumentsRegister,
  isRegisterListArguments,
  registerToList,
} from './RegistryListContext';
import {
  InferMapArgumentsRegister,
  isRegisterMapArguments,
  registerToMap,
} from './RegistryMapContext';
import { createOverrideContext } from '../OverrideContext';
import { SF, SFR } from '../../Value';

export interface RegistryContext<T> {
  register: <K extends keyof T>(
    name: K,
    ...args:
      | InferMapArgumentsRegister<T, T[K]>
      | InferListArgumentsRegister<T, T[K]>
  ) => Record<string, never>;
}

export const registersTo =
  <T>(context: CompileContext<T>) =>
  <K extends keyof T>(
    name: K,
    ...args:
      | InferMapArgumentsRegister<T, T[K]>
      | InferListArgumentsRegister<T, T[K]>
  ): Record<string, never> => {
    if (args.length === 0) {
      return {};
    }
    const override = createOverrideContext(context);

    override.override(name, (register: SF<T[K]>) => {
      if (isRegisterListArguments(args)) {
        return () => registerToList(context, register as SFR<T[K]>, args);
      } else if (isRegisterMapArguments(args)) {
        return () => registerToMap(context, register, args);
      } else {
        throw new ContainerError('Wrong register arguments');
      }
    });
    return {};
  };

export const createFeatureFactoryRegistryContext = <T>(
  context: CompileContext<T>
): RegistryContext<T> => {
  return {
    register: registersTo(context),
  };
};
