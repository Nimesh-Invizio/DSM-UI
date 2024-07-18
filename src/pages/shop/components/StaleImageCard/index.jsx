import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, FormControl, Button, Grid, Snackbar } from '@mui/material';
import { DatePicker } from 'antd';
import moment from 'moment';
import MuiAlert from '@mui/material/Alert';
import styled, { keyframes } from 'styled-components';
import apiContract from '../../services/shop.service';
import AnalyticsModal from '../../../../common/AnalyticsModal';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const colors = keyframes`
  0%, 100% { stroke: #6FC276; }
  25% { stroke: #FF9800; }
  50% { stroke: #2196F3; }
  75% { stroke: #F44336; }
`;

const StyledSVG = styled.svg`
  animation: ${rotate} 2s linear infinite;
  width: 100px;
  height: 100px;
`;

const StyledCircle = styled.circle`
  stroke-width: 5;
  stroke-linecap: round;
  fill: none;
  animation: ${dash} 1.5s ease-in-out infinite, ${colors} 6s ease-in-out infinite;
`;

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
`;

const LoadingText = styled(Typography)`
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
  margin-top: 20px;
  font-weight: bold;
  color: #6FC276;
`;



const StaleImageCard = ({ shopData, shopDetails }) => {
    const [date, setDate] = useState(moment());
    const [formErrors, setFormErrors] = useState({});
    const [deleteStaleImages, setDeleteStaleImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const serverId = JSON.parse(localStorage.getItem('serverDetails'))?.uniqueId;

    const handleDateChange = (date) => {
        setDate(date);
    };

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const validateForm = () => {
        const errors = {};
        if (!date.isValid()) errors.date = 'Please select a valid date';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDelete = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const staleImagesDeleteQueryData = {
                shopId: parseInt(shopDetails.id),
                actionType: "deleteAllStaleImages",
                date
            }
            const analyticsResponse = await apiContract.getAnalytics(serverId, staleImagesDeleteQueryData);
            console.log(analyticsResponse,"analyticsResponse");
            if (analyticsResponse.data.status) {
                setAnalytics(analyticsResponse.data.data);
                setConfirmModalOpen(true);
            } else {
                showSnackbar('Failed to fetch analytics data. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            showSnackbar('Failed to fetch analytics data. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            const shopId = shopDetails.id;
            const dataObj = {
                shopId,
                date: date.toDate(),
            }

            const response = await apiContract.staleImagesDelete(serverId, shopId, dataObj);
            showSnackbar(response.message || "Stale images deleted successfully", 'success');
            handleClear();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to delete stale images. Please try again.', 'error');
        } finally {
            setLoading(false);
            setConfirmModalOpen(false);
        }
    };

    const handleClear = () => {
        setDate(moment());
        setFormErrors({});
    };

    useEffect(() => {
        setFormErrors({});
    }, [date]);

    return (
        <Paper sx={{ borderRadius: 4, backgroundColor: "#ffffff", margin: 'auto', maxWidth: 800, padding: 6, boxShadow: 4, marginTop: 4, position: 'relative' }}>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1500,
                        borderRadius: 4,
                    }}
                >
                    <StyledSVG viewBox="0 0 50 50">
                        <StyledCircle cx="25" cy="25" r="20" />
                    </StyledSVG>
                    <LoadingText variant="h6">
                        Processing...
                    </LoadingText>
                </Box>
            )}
            
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Delete Stale Images
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!formErrors.date}>
                        <DatePicker
                            size="large"
                            className="modal-datepicker"
                            style={{ width: '100%', fontSize: '1.2rem' }}
                            value={date}
                            defaultValue={moment()}
                            onChange={handleDateChange}
                            popupStyle={{ zIndex: 1501 }}
                        />
                        {formErrors.date && <Typography variant="caption" color="error">{formErrors.date}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                   
                    <Button
                        sx={{
                            backgroundColor: "#6FC276",
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ffffff',
                                color: "#6FC276"
                            }
                        }}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Delete'}
                    </Button>
                </Grid>
            </Grid>
            <AnalyticsModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                analytics={analytics}
                loading={loading}
                actionType="deleteAllStaleImages"
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default StaleImageCard;