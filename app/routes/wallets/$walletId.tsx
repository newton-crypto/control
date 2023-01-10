import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import {
  Chip,
  CopyPasteTooltip,
  Date,
  JsonViewer,
  Page,
  Row,
  SectionWrapper,
} from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import Table from '~/src/components/Wrappers/Table';
import { Cursor } from '~/src/types/generic';
import { Transaction } from '~/src/types/ledger';
import {
  Wallet,
  WalletBalance,
  WalletDetailedBalance,
  WalletHold,
} from '~/src/types/wallet';
import { API_WALLET } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

type WalletDetailsData = {
  wallet: Wallet;
  balances: WalletDetailedBalance[];
  holds: WalletHold[];
  transactions: Cursor<Transaction>;
};

export const meta: MetaFunction = () => ({
  title: 'Wallet',
  description: 'Show a wallet',
});

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.walletId, 'Expected params.walletId');
    const api = await createApiClient(session);
    const wallet = await api.getResource<Wallet>(
      `${API_WALLET}/wallets/${params.walletId}`,
      'data'
    );
    const holds = await api.getResource<WalletHold[]>(
      `${API_WALLET}/holds/?walletID${params.walletId}`,
      'cursor.data'
    );
    const transactions = await api.getResource<Cursor<Transaction>>(
      `${API_WALLET}/transactions/?wallet_id${params.walletId}`,
      'cursor'
    );
    const rawBalances = await (
      await createApiClient(session)
    ).getResource<WalletBalance[]>(
      `${API_WALLET}/wallets/${params.walletId}/balances`,
      'cursor.data'
    );

    if (wallet && rawBalances && transactions && holds) {
      const balances = [];

      for (const balance of rawBalances) {
        const detailedBalance = await (
          await createApiClient(session)
        ).getResource<WalletBalance[]>(
          `${API_WALLET}/wallets/${params.walletId}/balances/${balance.name}`,
          'cursor.data'
        );
        balances.push(detailedBalance);
      }

      return {
        wallet,
        balances,
        holds,
        transactions: {
          ...transactions,
          data: transactions.data.map((transaction) => ({
            ...transaction,
            ledger: 'wallets-002', // TODO remove hardcoded ledger when NUM 1427 is done
          })),
        },
      };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="wallet"
      title="pages.wallet.title"
      error={error}
      showAction={false}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const data =
    useLoaderData<WalletDetailsData>() as unknown as WalletDetailsData;

  return (
    <Page id="wallet" title={data.wallet.name}>
      <>
        <SectionWrapper title={t('pages.wallet.sections.balances.title')}>
          {/* TODO ajust table with data from balances */}
          <Table
            withHeader={false}
            items={[]}
            action
            columns={[]}
            renderItem={(balance: WalletDetailedBalance, index) => (
              <Row key={index} keys={[]} item={balance} />
            )}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.holds.title')}>
          <Table
            items={data.holds}
            action
            columns={[
              {
                key: 'id',
                label: t('pages.wallet.sections.holds.table.columnLabel.id'),
                width: 40,
              },
              {
                key: 'asset',
                label: t('pages.wallet.sections.holds.table.columnLabel.asset'),
                width: 40,
              },
              {
                key: 'destination',
                label: t(
                  'pages.wallet.sections.holds.table.columnLabel.destination'
                ),
                width: 40,
              },
              {
                key: 'createdAt',
                label: t(
                  'pages.wallet.sections.holds.table.columnLabel.createdAt'
                ),
                width: 40,
              },
            ]}
            renderItem={(hold: WalletHold, index) => (
              <Row
                key={index}
                keys={[
                  <CopyPasteTooltip
                    key={index}
                    tooltipMessage={t('common.tooltip.copied')}
                    value={hold.id}
                  >
                    <Chip key={index} label={hold.id} variant="square" />
                  </CopyPasteTooltip>,
                  <Chip
                    key={index}
                    label={hold.asset}
                    variant="square"
                    color="blue"
                  />,
                  <Chip
                    key={index}
                    label={hold.destination.identifier}
                    variant="square"
                  />,
                  <Date key={index} timestamp={hold.createdAt} />,
                ]}
                item={hold}
              />
            )}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.transactions.title')}>
          <TransactionList
            withPagination={false}
            transactions={data.transactions as unknown as Cursor<Transaction>}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.metadata.title')}>
          <JsonViewer jsonData={data.wallet.metadata} />
        </SectionWrapper>
      </>
    </Page>
  );
}
