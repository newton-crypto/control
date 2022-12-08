import * as React from 'react';
import { FunctionComponent } from 'react';

import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { isArray } from 'lodash';
import { useTranslation } from 'react-i18next';

import { SidebarProps } from '~/src/components/Layout/components/Sidebar/types';
import { routerConfig } from '~/src/components/Navbar/routes';
import LinkWrapper from '~/src/components/Wrappers/LinkWrapper';

const Sidebar: FunctionComponent<SidebarProps> = ({
  width,
  onResize,
  resized,
}) => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const buttonSx = {
    width: resized ? 'auto' : 200,
    m: '4px 0 4px 0',
    p: '10px',
    color: palette.blue.darker,
    display: 'flex',
    borderRadius: '6px',
    textTransform: 'none',
    justifyContent: resized ? 'center' : 'start',
    ':hover': {
      p: '10px',
      color: palette.blue.darker,
    },
  };

  return (
    <Box
      sx={{
        width,
        borderRight: `1px solid ${palette.neutral[200]} !important`,
        background: palette.neutral[100],
        transition: 'all 0.25s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: resized ? 'center' : 'flex-end',
          mt: 8,
          pr: resized ? 0 : 1,
        }}
      >
        <IconButton
          sx={{
            ...buttonSx,
            width: 'auto',
            transition: 'all 0.85s',
            ':hover': {
              transform: 'rotate(360deg)',
              transition: 'all 0.85s',
              background: 'transparent',
            },
          }}
          onClick={onResize}
        >
          {resized ? <NavigateNext /> : <NavigateBefore />}
        </IconButton>
      </Box>
      <Box>
        {routerConfig.map(({ label: groupLabel, children }, index) => (
          <Box key={index} sx={{ marginTop: resized ? '24px' : 'initial' }}>
            {groupLabel && !resized && (
              <Box mt={index === 1 ? 1 : 3} p={1} ml={3}>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    color: palette.neutral[500],
                  }}
                >
                  {t(groupLabel)}
                </Typography>
              </Box>
            )}

            {children.map(({ label, path, id, icon }) => {
              const selected = isArray(path)
                ? path.includes(location.pathname)
                : path === location.pathname;

              const sx = {
                ...buttonSx,
                background: selected ? palette.neutral[50] : 'inherit',
              };

              return (
                <Box
                  key={id}
                  sx={{
                    display: 'flex',
                    justifyContent: resized ? 'center' : 'space-between',
                    marginLeft: resized ? '0px' : '24px',
                    alignItems: 'center',
                  }}
                >
                  <LinkWrapper
                    to={isArray(path) ? (path[0] as string) : (path as string)}
                    prefetch="intent"
                    key={id}
                    color="inherit"
                  >
                    {!resized ? (
                      <Button sx={sx} startIcon={icon}>
                        {t(label)}
                      </Button>
                    ) : (
                      <IconButton sx={sx}>{icon}</IconButton>
                    )}
                  </LinkWrapper>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;