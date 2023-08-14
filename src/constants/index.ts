import {
  TypographyType,
  TypographyPropertiesType,
  ThemeOptionsType,
} from '@peculiar/react-components';

export const mediaQueries = {
  TABLET: '(max-width: 1024px)',
  MOBILE: '(max-width: 768px)',
};

const color: ThemeOptionsType['color'] = {
  primary: '#0049DB',
  secondary: '#00A4B5',
  wrong: '#EB3638',
  attention: '#F0B400',
  success: '#1CBA75',
  'extra-1': '#7B00FF',
};

const text: Partial<Record<TypographyType, TypographyPropertiesType>> = {
  h2: {
    weight: '800',
    size: '35px',
    height: '45px',
    spacing: '0.1px',
  },
  h1: {
    weight: '700',
    size: '70px',
    height: '90px',
    spacing: '0.1px',
  },
  h3: {
    weight: '800',
    size: '27px',
    height: '35px',
    spacing: '0.1px',
  },
};

export const theme = {
  color,
  text,
};
