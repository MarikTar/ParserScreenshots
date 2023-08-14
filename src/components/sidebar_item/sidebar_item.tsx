import React from 'react';
import {
  Box,
  IconButton,
  Collapse,
  Typography,
  Button,
} from '@peculiar/react-components';
import { Link } from 'react-router-dom';
import { IGroupParseDate } from '../../utils';
import * as s from './sidebar_item.module.scss';

type SidebarItemProps = {
  title: string;
  currentHash: string;
  list: IGroupParseDate;
};

export const SidebarItem: React.FC<SidebarItemProps> = (props) => {
  const { title, list, currentHash } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <Box
      component="li"
      background="white"
      borderColor="gray-2"
      borderStyle="solid"
      borderPosition="bottom"
      borderWidth={1}
    >
      <label
        className={s.title_wrapper}
        htmlFor={title}
      >
        <Typography
          variant="b3"
          className={s.title}
        >
          {title}
        </Typography>

        <IconButton
          id={title}
          className={s.icon}
          color="primary"
          size="small"
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M12.39 14.512a.5.5 0 0 1-.78 0l-2.96-3.7A.5.5 0 0 1 9.04 10h5.92a.5.5 0 0 1 .39.812l-2.96 3.7Z" />
          </svg>
        </IconButton>
      </label>

      <Collapse in={open}>
        <ul className={s.list}>
          {Object.keys(list).map((testCaseName) => (
            <Button
              key={testCaseName}
              component={Link}
              to={{ hash: testCaseName }}
              className={s.list_item}
              data-active={currentHash === testCaseName}
              size="small"
              textVariant="c1"
            >
              {testCaseName}
            </Button>
          ))}
        </ul>
      </Collapse>
    </Box>
  );
};
