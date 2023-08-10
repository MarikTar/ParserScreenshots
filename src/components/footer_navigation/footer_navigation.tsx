import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Image,
} from '@peculiar/react-components';
import * as s from './footer_navigation.module.scss';
import { IPageData } from '../../parser';

type FooterNavigationProps = {
  pageData: IPageData[];
  currentNumber: number;
  onClick: (index: number) => void;
};

export const FooterNavigation: React.FC<FooterNavigationProps> = (props) => {
  const { pageData, currentNumber, onClick } = props;

  return (
    <Box
      background="gray-1"
      borderColor="gray-3"
      borderStyle="solid"
      borderPosition="top"
      borderWidth={1}
      className={s.root}
    >
      {pageData.map((item, index) => {
        const isCurrent = index === currentNumber;

        return [
          index && !Number(item.page) ? (
            <Typography
              key="divider"
              variant="s2"
              className={s.divider}
            >
              Re-run
            </Typography>
          ) : null,
          (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.url}-${index}`}
              component={Chip}
              onClick={() => onClick(index)}
              color={isCurrent ? 'secondary' : 'default'}
              variant="outlined"
              className={s.preview_item}
              borderRadius={4}
              borderWidth={1}
            >
              <Box
                borderRadius={4}
                borderWidth={1}
                borderColor="gray-4"
                borderStyle="solid"
                component={Image}
                src={item.url}
                alt={item.time}
                className={s.preview_image}
              />

              <Typography
                variant="c2"
                className={s.preview_description}
              >
                {`Page: ${item.page}`}
              </Typography>
            </Box>
          ),
        ];
      })}
    </Box>
  );
};
