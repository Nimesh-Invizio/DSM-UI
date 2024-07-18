import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, FormControl, Button, Grid } from '@mui/material';
import { DatePicker } from 'antd';
import moment from 'moment';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';
import AnalyticsModal from '../../../../common/AnalyticsModal';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SuperFunkyLoader = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const Circle = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 8px solid transparent;
  border-top-color: #6FC276;
  animation: ${spin} 1s linear infinite;

  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: 8px solid transparent;
  }

  &::before {
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-top-color: #FF6B6B;
    animation: ${spin} 3s linear infinite;
  }

  &::after {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-top-color: #FFA500;
    animation: ${spin} 1.5s linear infinite;
  }
`;

const AllImageCard = ({ shopDetails }) => {
    const [date, setDate] = useState(moment());
    const [formErrors, setFormErrors] = useState({});
    const [deleteAllImages, setDeleteAllImages] = useState({});
    const [snackBarStatus, setSnackBarStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;

    const handleDateChange = (date, dateString) => {
        setDate(date);
    };

    const handleDelete = async () => {
        setFormErrors({});

        const errors = {};
        if (!date.isValid()) {
            errors.date = 'Please select a valid date';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            const shopId = shopDetails.id;
            const analyticsQueryData = {
                shopId: parseInt(shopId),
                actionType: "deleteAllImages",
                date: date.toDate()
            };

            const analyticsResponse = await apiContract.getAnalytics(serverId, analyticsQueryData);
            if (analyticsResponse.data.status) {
                setAnalytics(analyticsResponse.data.data);
                setConfirmModalOpen(true);
            } else {
                setSnackBarStatus(true);
                setDeleteAllImages({
                    status: 400,
                    message: 'Failed to fetch analytics data. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setSnackBarStatus(true);
            setDeleteAllImages({
                status: 500,
                message: error.message || 'An error occurred while fetching analytics'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const shopId = shopDetails.id;
            const dataObj = {
                shopId,
                date: date.toDate(),
            }

            const response = await apiContract.allImagesDelete(serverId, shopId, dataObj);
            setSnackBarStatus(true);
            setDeleteAllImages(response);
        } catch (error) {
            console.error('Error deleting all images:', error);
            setSnackBarStatus(true);
            setDeleteAllImages({
                status: 500,
                message: error.message || 'An error occurred while deleting images'
            });
        } finally {
            setIsLoading(false);
            setConfirmModalOpen(false);
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
        <Paper sx={{ borderRadius: 4, backgroundColor: "#ffffff", margin: 'auto', maxWidth: 600, padding: 6, boxShadow: 4, marginTop: 8, position: 'relative' }}>
            {isLoading && (
                <LoadingOverlay>
                    <SuperFunkyLoader>
                        <Circle style={{ top: 5, left: 35 }}/>
                    </SuperFunkyLoader>
                </LoadingOverlay>
            )}
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Delete All Images
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
                        onClick={handleDelete}
                        disabled={isLoading}
                        sx={{
                            color: "#6FC276",
                            borderColor: "#6FC276",
                            border: 1,
                            backgroundColor: "#ffffff",
                            marginRight: 2,
                            '&:hover': {
                                color: "#ffffff",
                                backgroundColor: "#6FC276",
                                transition: 'all 0.8s ease'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <AnalyticsModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                analytics={analytics}
                loading={isLoading}
                actionType="deleteAllImages"
            />
            <SnackAlert
                type={deleteAllImages.status === 200 ? 'success' : 'error'}
                status={snackBarStatus}
                onClose={() => setSnackBarStatus(false)}
                message={deleteAllImages?.message || "All images deleted successfully"}
            />
        </Paper>
    );
};

export default AllImageCard;
