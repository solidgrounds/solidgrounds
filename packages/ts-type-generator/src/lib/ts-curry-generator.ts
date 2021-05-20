import { EOL } from 'os';
import * as joi from 'joi';
import {
  BaseOptions,
  BaseSchema,
  generateInDocument,
  indent,
  generateRecurringString,
  generateInDirectory,
  createCurryPositions,
  generateFunctionByBinary,
} from './Functions';
import { map } from 'ramda';

export interface CurryOptions extends BaseOptions {
  length: number;
  maxCurry: number;
  argTemplate: string;
  resultTemplate: string;
  curryResultTemplate: string;
  functionTemplate: string;
}

export const CurryTemplateSchema = BaseSchema.append<CurryOptions>({
  length: joi.number().positive().default(10),
  maxCurry: joi.number().positive().default(10),
  argTemplate: joi.string().required(),
  resultTemplate: joi.string().required(),
  curryResultTemplate: joi.string().required(),
  functionTemplate: joi.string().default(''),
});

export function generateFunction(
  length: number,
  template: CurryOptions
): string {
  const binaryCombinations = createCurryPositions(length, template.maxCurry);
  const functions: string[] = map(
    generateFunctionByBinary(length, template),
    binaryCombinations
  );
  return indent(functions.join(''));
}

function generate(template: CurryOptions): string {
  return generateRecurringString(
    template.length,
    false,
    (i) => {
      return generateFunction(i, template);
    },
    EOL
  );
}

export const generateCurryInDocument = generateInDocument<CurryOptions>(
  'curryGenerator',
  CurryTemplateSchema,
  generate
);
export const generateCurryInDirectory = generateInDirectory(
  'curryGenerator',
  generateCurryInDocument
);
