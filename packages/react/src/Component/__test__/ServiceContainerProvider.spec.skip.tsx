import * as React from 'react';
import { Subject, lastValueFrom } from 'rxjs';
import { render } from '@testing-library/react';
import { ServiceContainerProvider, ServiceContainerConsumer } from '..';
import solidgrounds from '@solidgrounds/core';

it('Provide loading component', async () => {
  const subject = new Subject();

  const rendered = render(
    <ServiceContainerProvider
      serviceContainer={solidgrounds().add(({ synchronize }) => ({
        service: synchronize(async () => lastValueFrom(subject)),
      }))}
      loader={<div>Loading!</div>}
    >
      <ServiceContainerConsumer>
        {({ service }: { service: string }) => <div>{service}</div>}
      </ServiceContainerConsumer>
    </ServiceContainerProvider>
  );

  expect(await rendered.findAllByText('Loading!')).toHaveLength(1);

  subject.next('Hi!');
  subject.complete();

  expect(await rendered.findAllByText('Hi!')).toHaveLength(1);
});

it('Able to nest providers', (done) => {
  render(
    <ServiceContainerProvider
      serviceContainer={solidgrounds().add(() => ({ service1: () => 1 }))}
    >
      <ServiceContainerConsumer>
        {(container) => {
          expect(container).toHaveProperty('service1', 1);
          done();
          return <div />;
        }}
      </ServiceContainerConsumer>
      <ServiceContainerProvider
        serviceContainer={solidgrounds().add(() => ({ service2: () => 2 }))}
      >
        <ServiceContainerConsumer>
          {(container) => {
            expect(container).toHaveProperty('service2', 2);
            done();
            return <div />;
          }}
        </ServiceContainerConsumer>
      </ServiceContainerProvider>
    </ServiceContainerProvider>
  );
});
