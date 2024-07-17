import React, { useState } from 'react';
import { FaSyncAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { styled, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SyncButton = styled(Button)(({ theme, isSpinning }) => ({
  backgroundColor: '#ffffff',
  color: '#6FC276',
  border: '2px solid #6FC276',
  borderColor: '#6FC276',
  width: '160px',
  height: '40px', 
  '&:hover': {
    color: '#ffffff',
    backgroundColor: '#6FC276',
  },
  '& .syncIcon': {
    animation: isSpinning ? `${spin} 1s linear infinite` : 'none',
    display: 'inline-block',
  },
}));

const QuotationProductImageSyncCard = ({ shopDetails }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState(false);
  const [syncResult, setSyncResult] = useState({});
  const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;

  const handleSync = async () => {
    setIsSpinning(true);
    try {
      const shopId = shopDetails.id;
      const response = await apiContract.quotationProductImageSync(serverId, shopId, {});
      setSyncResult(response);
      setSnackBarStatus(true);
    } catch (error) {
      console.error('Error syncing images:', error);
      setSyncResult({
        status: 500,
        message: error.message || 'An error occurred while syncing images'
      });
      setSnackBarStatus(true);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      gap={2}
    >
      <SyncButton
        startIcon={<FaSyncAlt className="syncIcon" />}
        onClick={handleSync}
        disabled={isSpinning}
        isSpinning={isSpinning}
      >
        {isSpinning ? 'Syncing...' : 'Sync Images'}
      </SyncButton>
      <SnackAlert
        type={syncResult.status === 200 ? 'success' : 'error'}
        status={snackBarStatus}
        onClose={() => setSnackBarStatus(false)}
        message={syncResult?.message || "Images synced successfully"}
      />
    </Box>
  );
};

export default QuotationProductImageSyncCard;