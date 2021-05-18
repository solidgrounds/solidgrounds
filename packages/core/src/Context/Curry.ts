import { LoDashStatic as __ } from 'lodash';
import { __ as placeholder } from 'lodash/fp';
import {
  getServiceFactories,
  getServiceInstances,
  KSF,
  SF,
  USF,
} from '../Value';
import { CompileContext } from './CompileContext';
import { curryN } from 'lodash/fp';

export { placeholder as __ };

export const composeCurryN = <T>(
  context: CompileContext<T>,
  arity: number,
  callback: (...services: unknown[]) => unknown
) => {
  return curryN(arity, (...keys: (keyof T | USF)[]) => {
    const serviceFactories = getServiceFactories(
      context.getServiceFactory,
      keys
    );
    return context.serviceReferenceFactory(() => {
      const serviceInstances = getServiceInstances(serviceFactories);
      return callback(...serviceInstances);
    });
  });
};

/**
 * @curryInterfaceGenerator({
 *    interfaceTemplate: "export interface Curry%<T, S, {{D%}}>",
 *    argTemplate: '{{["d%: KSF<T, D%>", "d%: __", "d%?: __"]}}',
 *    resultTemplate: "SF<S>;",
 *    maxCurry: 16,
 *    length: 4,
 *    curryResultTemplate: "Curry%<T, S, {{D%}}>;",
 * })
 */

export interface Curry1<T, S, D1> {
  (d1: KSF<T, D1>): SF<S>;

  (d1?: __): Curry1<T, S, D1>;
}

export interface Curry2<T, S, D1, D2> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>): SF<S>;

  (d1: __, d2: KSF<T, D2>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2?: __): Curry1<T, S, D2>;

  (d1?: __, d2?: __): Curry2<T, S, D1, D2>;
}

export interface Curry3<T, S, D1, D2, D3> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3?: __): Curry1<T, S, D3>;

  (d1: __, d2: __, d3: KSF<T, D3>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3?: __): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2?: __, d3?: __): Curry2<T, S, D2, D3>;

  (d1?: __, d2?: __, d3?: __): Curry3<T, S, D1, D2, D3>;
}

export interface Curry4<T, S, D1, D2, D3, D4> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __): Curry1<T, S, D4>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4?: __): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3?: __, d4?: __): Curry2<T, S, D3, D4>;

  (d1: __, d2: __, d3: __, d4: KSF<T, D4>): Curry3<T, S, D1, D2, D3>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4?: __): Curry3<T, S, D1, D2, D4>;

  (d1: __, d2: KSF<T, D2>, d3?: __, d4?: __): Curry3<T, S, D1, D3, D4>;

  (d1: KSF<T, D1>, d2?: __, d3?: __, d4?: __): Curry3<T, S, D2, D3, D4>;

  (d1?: __, d2?: __, d3?: __, d4?: __): Curry4<T, S, D1, D2, D3, D4>;
}
