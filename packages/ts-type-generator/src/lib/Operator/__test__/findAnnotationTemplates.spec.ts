import { toArray } from 'rxjs/operators';
import { of } from 'rxjs';
import { findAnnotationTemplates } from '../findAnnotationTemplates';

it('findFunctionAnnotationTemplates', async () => {
  expect(
    await of(`
  /**
   * @typeGenerator({ length: 10, templates:
   * ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"]
   * } )
   */
 `)
      .pipe(findAnnotationTemplates('typeGenerator'), toArray())
      .toPromise()
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "dockBlock": "/**
       * @typeGenerator({ length: 10, templates:
       * [\\"services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];\\"]
       * } )
       */
    ",
        "indentation": 2,
        "template": " @typeGenerator({ length: 10, templates:
     [\\"services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];\\"]
     } )
    /",
      },
    ]
  `);
});

it('findFunctionAnnotationTemplates multiple', async () => {
  expect(
    await of(`
  /**
   * @typeGenerator({ length: 10, templates: ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"] })
   */
   export function servives(tags: any): any[];

  /**
   * @typeGenerator({ length: 10, templates: ["export function toInt({a%i: number}): void;"], removeNextLines: /;/})
   */
   export toInt(...args: number[]): void;
  `)
      .pipe(findAnnotationTemplates('typeGenerator'), toArray())
      .toPromise()
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "dockBlock": "/**
       * @typeGenerator({ length: 10, templates: [\\"services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];\\"] })
       */
       export function servives(tags: any): any[];

      /**
       * @typeGenerator({ length: 10, templates: [\\"export function toInt({a%i: number}): void;\\"], removeNextLines: /;/})
       */",
        "indentation": 2,
        "template": " @typeGenerator({ length: 10, templates: [\\"services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];\\"] })
    /",
      },
      Object {
        "dockBlock": "/**
       * @typeGenerator({ length: 10, templates: [\\"export function toInt({a%i: number}): void;\\"], removeNextLines: /;/})
       */
    ",
        "indentation": 2,
        "template": " @typeGenerator({ length: 10, templates: [\\"export function toInt({a%i: number}): void;\\"], removeNextLines: /;/})
    /",
      },
    ]
  `);
});
