import * as joi from 'joi';
import { mergeMap, toArray } from 'rxjs/Operators';
import { findAnnotationTemplates, parseAnnotationArguments } from '../Operator';
import { of } from 'rxjs';
import { Schema } from 'joi';
import * as os from 'os';
import { findTextToRemove, matchEmptyOrStatement } from './findTextToRemove';
import { indent } from './indent';
import { replaceAll } from './replaceAll';

export interface BaseOptions {
  removeNextLines: RegExp;
}

export const BaseSchema = joi.object<BaseOptions>({
  removeNextLines: joi.function().default(matchEmptyOrStatement),
});

export const generateInDocument = <T extends BaseOptions>(
  name: string,
  schema: Schema<T>,
  generate: (options: T) => string
) =>
  mergeMap((document: string) =>
    of(document).pipe(
      findAnnotationTemplates(name),
      mergeMap(({ dockBlock, template, indentation }) =>
        of(template).pipe(
          parseAnnotationArguments(schema, name),
          mergeMap((options) => {
            const generated = generate(options);
            const endIndex = document.indexOf(dockBlock) + dockBlock.length;
            const toRemove = findTextToRemove(
              document.slice(endIndex),
              options.removeNextLines
            );
            const target = dockBlock + toRemove;
            const replacement =
              dockBlock + os.EOL + indent(generated, indentation);
            return [
              {
                options,
                generated,
                target,
                replacement,
                template,
                dockBlock,
              },
            ];
          })
        )
      ),
      toArray(),
      replaceAll(document)
    )
  );
