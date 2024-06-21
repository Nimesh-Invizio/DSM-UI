import { Box, Paper, Typography, FormControl, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';

const AllImageCard = ({ shopDetails }) => {
    const [date, setDate] = useState(moment());
    const [formErrors, setFormErrors] = useState({});
    const [deleteAllImages, setDeleteAllImages] = useState({});
    const [snackBarStatus, setSnackBarStatus] = useState(false);
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
        <Paper sx={{ borderRadius: 4, backgroundColor: "#ffffff", margin: 'auto', maxWidth: 600, padding: 6, boxShadow: 4, marginTop: 8 }}>
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
                        sx={{
                            color: "#6FC276",
                            borderColor: "#6FC276",
                            border: 1,
                            backgroundColor: "#fffff",
                            marginRight: 2,
                            '&:hover': {
                                color: "#ffffff",
                                backgroundColor: "#6FC276",
                                transition: 0.8
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