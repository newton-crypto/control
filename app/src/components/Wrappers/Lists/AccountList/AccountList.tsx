import React, { FunctionComponent } from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Chip,
  LoadingButton,
  Row,
  SourceDestination,
} from '@numaryhq/storybook';

import { getLedgerAccountDetailsRoute } from '~/src/components/Navbar/routes';
import { AccountListProps } from '~/src/components/Wrappers/Lists/AccountList/types';
import Table from '~/src/components/Wrappers/Table';
import { Account } from '~/src/types/ledger';

const AccountList: FunctionComponent<AccountListProps> = ({ accounts }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderRowActions = (account: Account) => (
    <Box key={account.address} component="span">
      <LoadingButton
        id={`show-${account.address}`}
        onClick={() =>
          navigate(
            getLedgerAccountDetailsRoute(account.address, account.ledger)
          )
        }
        endIcon={<ArrowRight />}
      />
    </Box>
  );

  const handleAction = (account: Account) =>
    navigate(getLedgerAccountDetailsRoute(account.address, account.ledger));

  return (
    <Table
      items={accounts}
      action
      columns={[
        {
          key: 'address',
          label: t('pages.accounts.table.columnLabel.address'),
        },
        {
          key: 'ledger',
          label: t('pages.accounts.table.columnLabel.ledger'),
        },
      ]}
      renderItem={(account: Account, index) => (
        <Row
          key={index}
          keys={[
            <SourceDestination
              ellipse={false}
              key={account.address}
              label={account.address}
              onClick={() => handleAction(account)}
            />,
            <Chip
              key={index}
              label={account.ledger}
              variant="square"
              color="brown"
            />,
          ]}
          item={account}
          renderActions={() => renderRowActions(account)}
        />
      )}
    />
  );
};

export default AccountList;