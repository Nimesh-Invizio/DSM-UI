import { Box, Paper, Typography, FormControl, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(0.9); }
  50% { transform: scale(1.1); }
`;

const moveLeftRight = keyframes`
  0%, 100% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
`;

const moveUpDown = keyframes`
  0%, 100% { transform: translateY(-10px); }
  50% { transform: translateY(10px); }
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

const Square = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #4A90E2;
  animation: ${pulse} 1s ease-in-out infinite, ${moveLeftRight} 2s ease-in-out infinite;
`;

const Triangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid #F0DB4F;
  animation: ${pulse} 1s ease-in-out infinite, ${moveUpDown} 2s ease-in-out infinite;
`;

const AllImageCard = ({ shopDetails }) => {
    const [date, setDate] = useState(moment());
    const [formErrors, setFormErrors] = useState({});
    const [deleteAllImages, setDeleteAllImages] = useState({});
    const [snackBarStatus, setSnackBarStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
                        {/* <Square style={{ top: 0, left: 0 }} />
                        <Square style={{ bottom: 0, right: 0 }} />
                        <Triangle style={{ top: 0, right: 0 }} />
                        <Triangle style={{ bottom: 0, left: 0 }} /> */}
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
                        onClick={handleSave}
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