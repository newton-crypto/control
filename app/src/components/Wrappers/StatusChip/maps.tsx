import React from 'react';

import {
  Block,
  Done,
  ErrorOutline,
  HourglassTop,
  LoopOutlined,
  MoreHoriz,
  PauseCircle,
} from '@mui/icons-material';

import { ConnectorStatuses, TaskStatuses } from '~/src/types/connectorsConfig';
import { PaymentStatuses } from '~/src/types/payment';

export const paymentIconMap = {
  [PaymentStatuses.FAILED]: <ErrorOutline />,
  [PaymentStatuses.SUCCEEDED]: <Done />,
  [PaymentStatuses.PENDING]: <HourglassTop />,
  [PaymentStatuses.CANCELLED]: <Block />,
  [PaymentStatuses.OTHER]: <MoreHoriz />,
};

export const paymentColorMap = {
  [PaymentStatuses.FAILED]: 'red',
  [PaymentStatuses.SUCCEEDED]: 'green',
  [PaymentStatuses.PENDING]: 'blue',
  [PaymentStatuses.CANCELLED]: 'brown',
  [PaymentStatuses.OTHER]: 'violet',
};

export const appTaskIconMap = {
  [TaskStatuses.STOPPED]: <PauseCircle />,
  [TaskStatuses.PENDING]: <HourglassTop />,
  [TaskStatuses.TERMINATED]: <Done />,
  [TaskStatuses.FAILED]: <ErrorOutline />,
  [TaskStatuses.ACTIVE]: <LoopOutlined />,
};
export const appTaskColorMap = {
  [TaskStatuses.STOPPED]: 'brown',
  [TaskStatuses.PENDING]: 'blue',
  [TaskStatuses.TERMINATED]: 'blue',
  [TaskStatuses.FAILED]: 'red',
  [TaskStatuses.ACTIVE]: 'green',
};

export const appIconMap = {
  [ConnectorStatuses.ACTIVE]: <Done />,
  [ConnectorStatuses.INACTIVE]: <PauseCircle />,
};
export const appColorMap = {
  [ConnectorStatuses.ACTIVE]: 'green',
  [ConnectorStatuses.INACTIVE]: 'red',
};