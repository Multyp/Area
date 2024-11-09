import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SquareCard = styled(Card)(({ theme }) => ({
  aspectRatio: '1/1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export const RectangularCard = styled(Card)(({ theme }) => ({
  aspectRatio: '1/1.5',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)', // Effet hover plus subtil
  },
}));
