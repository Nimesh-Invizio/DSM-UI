import { Box, Paper, Typography, FormControl, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';
import styled, { keyframes } from 'styled-components';

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
    const [snackBarStatus, setSnackBarStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;

    const handleDateChange = (date, dateString) => {
        setDate(date);
    };

    const handleSave = async () => {
        setFormErrors({});

        const errors = {};
        if (!date.isValid()) {
            errors.date = 'Please select a valid date';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);

        try {
            const shopId = shopDetails.id;
            const dataObj = {
                shopId,
                date: date.toDate(),
            }

            const response = await apiContract.staleImagesDelete(serverId, shopId, dataObj);
            setSnackBarStatus(true);
            setDeleteStaleImages(response);
        } catch (error) {
            console.error('Error deleting stale images:', error);
            setSnackBarStatus(true);
            setDeleteStaleImages({
                status: 500,
                message: error.message || 'An error occurred while deleting stale images'
            });
        } finally {
            setLoading(false);
        }

        handleClear();
    };

    const handleClear = () => {
        setDate(moment());
    };

    useEffect(() => {
        setFormErrors({});
    }, [date]);

    return (
        <Paper sx={{ borderRadius: 4, backgroundColor: "#ffffff", margin: 'auto', maxWidth: 600, padding: 6, boxShadow: 4, marginTop: 4, position: 'relative' }}>
        {!loading && (
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
                    Deleting Stale Images...
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
                        size="large"
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                            color: "#6FC276",
                            borderColor: "#6FC276",
                            border: 1,
                            backgroundColor: "#ffffff",
                            '&:hover': {
                                color: "#ffffff",
                                backgroundColor: "#6FC276",
                                transition: '0.8s'
                            },
                            '&:disabled': {
                                color: "#9e9e9e",
                                borderColor: "#9e9e9e",
                                backgroundColor: "#f5f5f5",
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <SnackAlert
                type={deleteStaleImages.status === 200 ? 'success' : 'error'}
                status={snackBarStatus}
                onClose={() => setSnackBarStatus(false)}
                message={deleteStaleImages?.message || "Stale images deleted successfully"}
            />
        </Paper>
    );
};

export default StaleImageCard;