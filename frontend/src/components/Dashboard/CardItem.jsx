import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
}));

const CardItem = ({
  title,
  value,
  icon: Icon
}) => {

  return (
    <StyledCard>
      <CardHeader
        sx={{ pb: 1 }}
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            {Icon && (
              <IconWrapper elevation={0} sx={{marginLeft: '4px'}}>
                <Icon sx={{ fontSize: 20, color: 'grey.900' }} />
              </IconWrapper>
            )}
          </Box>
        }
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end">
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CardItem;