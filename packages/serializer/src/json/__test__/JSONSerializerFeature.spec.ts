import { solidgrounds } from '@solidgrounds/core';
import { JSONSerializerFeature } from '../JSONSerializerFeature';
import { JSONSerializer } from '../JSONSerializer';

it('Exposes serializer', async () => {
  const { serializer } = await solidgrounds()
    .add(JSONSerializerFeature)
    .build();
  expect(serializer).toBeInstanceOf(JSONSerializer);
});
