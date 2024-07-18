import React from 'react';
import { Modal, Box, Typography, Button, Divider, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const GlassBox = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: theme.spacing(4),
    color: theme.palette.text?.primary || '#000000',
  }));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const actionConfig = {
    deleteQuotations: {
      title: "Confirm Quotation Deletion",
      message: "You are about to delete quotations.",
      fields: [
        { key: 'totalQuotations', label: 'Total Quotations' },
        { key: 'quotationsToDelete', label: 'Quotations to Delete' },
        { key: 'quotationsRemaining', label: 'Quotations Remaining' },
        { key: 'imagesToDelete', label: 'Images to Delete' },
      ],
    },
    deleteProducts: {
      title: "Confirm Product Deletion",
      message: "You are about to delete products.",
      fields: [
        { key: 'totalProducts', label: 'Total Products' },
        { key: 'productsToDelete', label: 'Products to Delete' },
        { key: 'productsRemaining', label: 'Products Remaining' },
        { key: 'imagesToDelete', label: 'Images to Delete' },
      ],
    },
    deleteAllImages: {
      title: "Confirm Image Deletion",
      message: "You are about to delete images.",
      fields: [
        { key: 'totalImages', label: 'Total Images' },
        { key: 'imagesToDelete', label: 'Images to Delete' },
        { key: 'imagesRemaining', label: 'Images Remaining' },
      ],
    },
    deleteAllStaleImages: {
      title: "Confirm Stale Image Deletion",
      message: "You are about to delete all stale images.",
      fields: [
        { key: 'totalImages', label: 'Total Images' },
        { key: 'imagesToDelete', label: 'Stale Images to Delete' },
        { key: 'imagesRemaining', label: 'Images Remaining' },
      ],
    },
    quotationProductImageMapping: {
      title: "Confirm Quotation Product Image Mapping",
      message: "You are about to update quotation product image mappings.",
      fields: [
        { key: 'totalQuotationProducts', label: 'Total Quotation Products' },
        { key: 'quotationProductsToUpdate', label: 'Quotation Products to Update' },
        { key: 'quotationProductsUnchanged', label: 'Quotation Products Unchanged' },
      ],
    },
  };
  
  const AnalyticsModal = ({ open, onClose, onConfirm, analytics, loading, actionType }) => {
    const config = actionConfig[actionType] || {};
    
    const renderAnalytics = () => (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            {config.message || "You are about to perform an operation."}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>This action will affect the following:</Typography>
        <Box sx={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.03)', 
          borderRadius: '12px', 
          p: 2,
          mb: 3
        }}>
          {config.fields?.map(field => (
            <Typography key={field.key}>
              <strong>{field.label}:</strong> {analytics[field.key]}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" color="error" fontWeight="medium">
          Are you absolutely sure you want to proceed?
        </Typography>
      </>
    );
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GlassBox
          sx={{
            width: 450,
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="confirmation-modal-title" variant="h5" component="h2" fontWeight="bold" color="primary">
              {config.title || "Confirm Action"}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 3, mb: 4 }}>
            {analytics ? renderAnalytics() : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <StyledButton
              onClick={onClose}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              onClick={onConfirm}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </StyledButton>
          </Box>
        </GlassBox>
      </Modal>
    );
  };
  
  export default AnalyticsModal;
  