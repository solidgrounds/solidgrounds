import { solidgrounds } from '@solidgrounds/core';
import { DatabaseFeature } from './DatabaseFeature';

solidgrounds()
  .add(DatabaseFeature)
  .build()
  .then((container) => {
    container.database.someFancyQuery();
  })
  .catch((error) => {
    process.stdout.write(`${error}
`);
  });
