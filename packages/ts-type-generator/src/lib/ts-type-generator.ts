import * as joi from 'joi';
import {
  generateTemplates,
  generateInDirectory,
  BaseSchema,
  BaseOptions,
  generateInDocument,
} from './Functions';

export interface TypeGenerator extends BaseOptions {
  length: number;
  empty: boolean;
  templates: string[];
}

export const TypeTemplateSchema = BaseSchema.append<TypeGenerator>({
  length: joi.number().positive().default(10),
  templates: joi.array().has(joi.string().required()).required(),
  empty: joi.boolean().default(false),
});

export const generateType = (options: TypeGenerator): string =>
  generateTemplates(options.length, options.empty, options.templates);

export const generateTypesInDocument = generateInDocument<TypeGenerator>(
  'typeGenerator',
  TypeTemplateSchema,
  generateType
);
export const generateTypesInDirectory = generateInDirectory(
  'typeGenerator',
  generateTypesInDocument
);
