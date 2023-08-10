import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  Drawer,
} from '@peculiar/react-components';
import * as s from './header.module.scss';

type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { title, children } = props;
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      component="header"
      background="gray-2"
      className={s.root}
    >
      <Typography
        variant={isMobile ? 's2' : 'h5'}
      >
        {title}
      </Typography>
      {isMobile ? (
        <>
          <IconButton
            size="large"
            onClick={() => setOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-15h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1Zm0 6h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1Zm0 6h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1Z"
              />
            </svg>
          </IconButton>

          <Drawer
            open={open}
            onClose={() => setOpen(false)}
          >
            {children}
          </Drawer>
        </>
      ) : null}
    </Box>
  );
};
