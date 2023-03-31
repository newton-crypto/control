import React, { FunctionComponent } from 'react';

import { SwapHoriz } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { JsonViewer } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { RevertTransactionProps } from '~/src/components/Wrappers/Workflows/histories/activities/RevertTransaction/types';
import {
  containerSx,
  jsonContainer,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const RevertTransaction: FunctionComponent<RevertTransactionProps> = ({
  metadata,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.brown.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.revertTransaction.title')}
        color={palette.brown.light}
        onToggle={toggle}
        icon={<SwapHoriz />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx}>
            {!isEmpty(metadata) && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.activities.revertTransaction.metadata')}
                </Typography>
                <JsonViewer jsonData={metadata} expanded />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default RevertTransaction;
