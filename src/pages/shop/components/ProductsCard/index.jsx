import { Box, InputLabel, MenuItem, Paper, Select, Typography, FormControl, Switch, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';
import moment from 'moment';

const CoolLoadingAnimation = () => (
    <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#6FC276" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="251.2">
            <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="251.2" to="0"/>
        </circle>
        <circle cx="50" cy="50" r="20" fill="#6FC276">
            <animate attributeName="r" dur="1s" repeatCount="indefinite" values="20;25;20"/>
        </circle>
    </svg>
);

const ProductsCard = ({ shopDetails }) => {
    const [itemStatus, setItemStatus] = useState([]);
    const [hardDelete, setHardDelete] = useState(false);
    const [imageDelete, setImageDelete] = useState(false);
    const [date, setDate] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [deleteQuotations, setDeleteQuotations] = useState({});
    const [snackBarStatus, setSnackBarStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;
    const [abortController, setAbortController] = useState(null);

    const handleChangeItemStatus = (event) => {
        const value = event.target.value.toUpperCase();

        if (value === "ALL") {
            setItemStatus(["", "INSTOCK", "CATALOGUE"]);
        }
        else if (value === "APP") {
            setItemStatus([""]);
        }
        else {
            setItemStatus([value]);
        }
    };

    const handleHardDeleteChange = (event) => {
        setHardDelete(event.target.checked);
    };

    const handleImageDeleteChange = (event) => {
        setImageDelete(event.target.checked);
    };

    const handleDateChange = (date, dateString) => {
        setDate(date);
    };

    const handleSave = async (event) => {
        setFormErrors({});

        const errors = {};
        if (itemStatus.length === 0) {
            errors.itemStatus = 'Please select an item status';
        }
        if (!date) {
            errors.date = 'Please select a date';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);
        const controller = new AbortController();
        setAbortController(controller);

        try {
            const shopId = shopDetails.id;
            let dataObj = {
                shopId: parseInt(shopId),
                date: date.format('YYYY-MM-DD'),
                itemStatus: itemStatus.map(element => element === "All" ? "" : element.toUpperCase()),
                hardDelete: hardDelete ? 1 : 0,
                imageDelete: imageDelete ? 1 : 0
            }

            const response = await apiContract.deleteProducts(serverId, shopId, dataObj, controller.signal);
            
            setSnackBarStatus(true);
            setDeleteQuotations({
                status: response.status,
                message: response.message || "Products deleted successfully"
            });

        } catch (error) {
            if (error.name === 'AbortError') {
                setSnackBarStatus(true);
                setDeleteQuotations({
                    status: 'info',
                    message: "Delete operation was cancelled"
                });
            } else {
                console.error('Error deleting products:', error);
                setSnackBarStatus(true);
                setDeleteQuotations({
                    status: error.status || 500,
                    message: error.message || "An error occurred while deleting products"
                });
            }
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }

        handleClear();
    };

    const handleCancel = () => {
        if (abortController) {
            abortController.abort();
        }
        setIsLoading(false);
    };

    const handleClear = () => {
        setHardDelete(false);
        setImageDelete(false);
        setItemStatus([]);
        setDate(null);
    };

    useEffect(() => {
        setFormErrors({});
    }, [itemStatus, date]);

    return (
        <Paper sx={{
            borderRadius: 2,
            backgroundColor: "#ffffff",
            margin: 'auto',
            maxWidth: 800,
            padding: 4,
            boxShadow: 4,
            marginTop: 5,
            position: 'relative',
        }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!formErrors.itemStatus}>
                        <InputLabel id="item-status-select-label">Item Status</InputLabel>
                        <Select
                            labelId="item-status-select-label"
                            id="item-status-select"
                            value={itemStatus}
                            label="Item Status"
                            onChange={handleChangeItemStatus}
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                    return "Select an item status";
                                } else if (selected.includes("") && selected.length > 1) {
                                    return "All";
                                } else if (selected.includes("")) {
                                    return "App";
                                } else {
                                    return selected.join(", ");
                                }
                            }}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Instock">Instock</MenuItem>
                            <MenuItem value="Catalogue">Catalogue</MenuItem>
                        </Select>
                        {formErrors.itemStatus && <Typography variant="caption" color="error">{formErrors.itemStatus}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center">
                        <Typography>Hard Delete</Typography>
                        <Switch
                            checked={hardDelete}
                            onChange={handleHardDeleteChange}
                            inputProps={{ 'aria-label': 'Hard Delete' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center">
                        <Typography>Image Delete</Typography>
                        <Switch
                            checked={imageDelete}
                            onChange={handleImageDeleteChange}
                            inputProps={{ 'aria-label': 'Image Delete' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!formErrors.date}>
                    <DatePicker
                            size="middle"
                            className="modal-datepicker"
                            style={{ width: '100%' }}
                            value={date}
                            defaultValue={moment()}
                            onChange={handleDateChange}
                            popupStyle={{ zIndex: 1501 }}
                        />
                        {formErrors.date && <Typography variant="caption" color="error">{formErrors.date}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12} display="flex" justifyContent="flex-end">
                    <Button
                        sx={{
                            backgroundColor: "#6FC276",
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ffffff',
                                color: "#6FC276"
                            },
                            marginRight: 2
                        }}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "#6FC276",
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ffffff',
                                color: "#6FC276"
                            }
                        }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
            <SnackAlert
                type={deleteQuotations.status === 200 ? 'success' : 'error'}
                status={snackBarStatus}
                onClose={() => setSnackBarStatus(false)}
                message={deleteQuotations.message || "Operation completed"}
            />
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                >
                    <CoolLoadingAnimation />
                    <Typography variant="h6" sx={{ mt: 2, color: '#6FC276' }}>
                        Deleting Products...
                    </Typography>
                    <Button
                        sx={{
                            mt: 2,
                            backgroundColor: "#6FC276",
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ffffff',
                                color: "#6FC276"
                            }
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default ProductsCard;