import React from 'react';
import {
  Slide,
  Box,
  Button,
  Typography,
} from '@peculiar/react-components';
import * as s from './sidebar.module.scss';

type SidebarProps = {

};

export const Sidebar: React.FC<SidebarProps> = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={s.root}>
      <Box
        in={open}
        direction="left"
        component={Slide}
        className={s.slider}
        background="primary"
      >
        <Typography color="wrong-shade-1">
          test
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => { setOpen((prev) => !prev); }}
      >
        Open
      </Button>
    </div>
  );
};
