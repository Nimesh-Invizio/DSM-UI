import React from 'react';
import { FaSyncAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const SyncButton = styled(Button)({
  backgroundColor: '#ffffff', 
  color: '#6FC276',
  border:'2px solid #6FC276',
  borderColor:'#6FC276',
  '&:hover': {
    color:'#ffffff',
    backgroundColor: '#6FC276',
  },
});

const QuotationProductImageSyncCard = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
    >
      <SyncButton
        startIcon={<FaSyncAlt />}
      >
        Sync Images
      </SyncButton>
    </Box>
  );
};

export default QuotationProductImageSyncCard;
