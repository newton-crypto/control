import * as React from 'react';

import type { MetaFunction, Session } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Page } from '@numaryhq/storybook';

import { payments as paymentsConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import Select from '~/src/components/Wrappers/Table/Filters/Select';
import Text from '~/src/components/Wrappers/Table/Filters/Text';
import { TableFiltersContext } from '~/src/contexts/tableFilters';
import { Cursor } from '~/src/types/generic';
import {
  Payment,
  PaymentProviders,
  PaymentStatuses,
  PaymentTypes,
} from '~/src/types/payment';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { API_SEARCH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { sanitizeQuery } from '~/src/utils/search';

const paymentTypes = [PaymentTypes.PAY_IN, PaymentTypes.PAY_OUT];
const paymentProviders = [
  PaymentProviders.STRIPE,
  PaymentProviders.DEVENGO,
  PaymentProviders.MONGOPAY,
  PaymentProviders.WISE,
  PaymentProviders.PAYPAL,
];
const paymentStatus = [
  PaymentStatuses.PENDING,
  PaymentStatuses.SUCCEEDED,
  PaymentStatuses.FAILED,
  PaymentStatuses.CANCELLED,
];

export const meta: MetaFunction = () => ({
  title: 'Payments',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const results = await (
      await createApiClient(session)
    ).postResource<Cursor<Payment>>(
      API_SEARCH,
      {
        ...sanitizeQuery(request),
        target: SearchTargets.PAYMENT,
        policy: SearchPolicies.AND,
      },
      'cursor'
    );
    if (results) return results;

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={paymentsConfig.id}
      title="pages.payments.title"
      error={error}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const payments = useLoaderData();

  return (
    <Page id={paymentsConfig.id}>
      <TableFiltersContext.Provider
        value={{
          filters: [
            { field: 'type', name: Filters.TERMS },
            { field: 'status', name: Filters.TERMS },
            { field: 'provider', name: Filters.TERMS },
            { field: 'reference', name: Filters.TERMS },
          ],
        }}
      >
        <Form method="get">
          <FiltersBar>
            <>
              <Select
                id="payment-type-autocomplete"
                options={paymentTypes}
                field="type"
                name="payment-type-autocomplete"
                placeholder={t('pages.payments.filters.type')}
              />
              <Select
                id="payment-status-autocomplete"
                options={paymentStatus}
                field="status"
                name="payment-status-autocomplete"
                placeholder={t('pages.payments.filters.status')}
              />
              <Select
                id="payment-provider-autocomplete"
                options={paymentProviders}
                field="provider"
                name="payment-provider-autocomplete"
                placeholder={t('pages.payments.filters.provider')}
              />
              <Text
                placeholder={t('pages.payments.filters.reference')}
                name="reference"
              />
              {/* TODO uncomment when Search API is ready to filter on initialAmount*/}
              {/* https://linear.app/formance/issue/NUM-778/search-minor-improvements-searchable-field-empty-data*/}
              {/*<Text*/}
              {/*  placeholder={t('pages.payments.filters.value')}*/}
              {/*  name="initialAmount"*/}
              {/*/>*/}
            </>
          </FiltersBar>
          <PaymentList payments={payments} />
        </Form>
      </TableFiltersContext.Provider>
    </Page>
  );
}