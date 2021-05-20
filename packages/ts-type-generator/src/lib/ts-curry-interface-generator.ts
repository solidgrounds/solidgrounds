import { EOL } from 'os';
import * as joi from 'joi';
import {
  generateInDocument,
  generateTemplate,
  generateRecurringString,
  generateInDirectory,
} from './Functions';
import {
  CurryOptions,
  CurryTemplateSchema,
  generateFunction,
} from './ts-curry-generator';

export interface CurryInterfaceOptions extends CurryOptions {
  interfaceTemplate: string;
}

const CurryInterfaceSchema = CurryTemplateSchema.append<CurryInterfaceOptions>({
  interfaceTemplate: joi.string().required(),
});

export function generateInterface(template: CurryInterfaceOptions): string {
  return generateRecurringString(
    template.length,
    false,
    (i) => {
      return `
${generateTemplate(template.interfaceTemplate, i)} {
${generateFunction(i, template)}
}
      `;
    },
    EOL
  );
}

export const generateCurryInterfaceInDocument =
  generateInDocument<CurryInterfaceOptions>(
    'curryInterfaceGenerator',
    CurryInterfaceSchema,
    generateInterface
  );
export const generateCurryInterfaceInDirectory = generateInDirectory(
  'curryInterfaceGenerator',
  generateCurryInterfaceInDocument
);
