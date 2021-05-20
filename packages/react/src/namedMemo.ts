import {
  ComponentType,
  memo,
  MemoExoticComponent,
  NamedExoticComponent,
  PropsWithChildren,
  FC,
  ComponentProps,
  SFC,
} from 'react';

/**
 * Exists for browser dev tools so components still preserves there names with memo function.
 */
export function namedMemo<P>(
  name: string,
  Component: SFC<P>,
  propsAreEqual?: (
    prevProps: Readonly<PropsWithChildren<P>>,
    nextProps: Readonly<PropsWithChildren<P>>
  ) => boolean
): NamedExoticComponent<P>;
export function namedMemo<T extends ComponentType<never>>(
  name: string,
  Component: T,
  propsAreEqual?: (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>
  ) => boolean
): MemoExoticComponent<T>;
export function namedMemo(
  name: string,
  Component: FC,
  // eslint-disable-next-line
  propsAreEqual?: any
) {
  // eslint-disable-next-line
  Component.displayName = name;
  return memo(Component, propsAreEqual);
}
