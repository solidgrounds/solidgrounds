import { ServiceContainerFactory } from './ServiceContainerFactory';

export * from './ServiceContainerFactory';
export * from './Value';
export * from './Feature';

export const solidgrounds = ServiceContainerFactory.create;
export default solidgrounds;
