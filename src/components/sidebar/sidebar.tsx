import React from 'react';
import { Box } from '@peculiar/react-components';
import * as s from './sidebar.module.scss';

type SidebarProps = {
  children?: React.ReactNode
};

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { children } = props;

  return (
    <Box
      component="aside"
      className={s.root}
      background="gray-2"
      borderColor="gray-4"
      borderStyle="solid"
      borderPosition="right"
      borderWidth={2}
    >
      {children}
    </Box>
  );
};
