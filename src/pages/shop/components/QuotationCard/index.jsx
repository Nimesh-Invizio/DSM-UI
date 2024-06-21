import { Box, InputLabel, MenuItem, Paper, Select, Typography, FormControl, Switch, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';

const QuotationCard = ({ shopData, shopDetails }) => {
    const [itemStatus, setItemStatus] = useState([]);
    const [hardDelete, setHardDelete] = useState(false);
    const [imageDelete, setImageDelete] = useState(false);
    const [date, setDate] = useState(moment());
    const [formErrors, setFormErrors] = useState({});
    const [deleteQuotations, setDeleteQuotations] = useState({});
    const [snackBarStatus, setSnackBarStatus] = useState(false);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;

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

    const handleSave = async () => {
        setFormErrors({});

        const errors = {};
        if (!itemStatus.length) {
            errors.itemStatus = 'Please select an item status';
        }
        if (!date.isValid()) {
            errors.date = 'Please select a valid date';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const shopId = shopDetails.id;
            let dataObj = {
                shopId,
                date: date.toDate(),
                itemStatus: itemStatus.map(element => element === "All" ? element = "" : element),
                hardDelete: hardDelete ? 1 : 0,
                imageDelete: imageDelete ? 1 : 0
            }

            const response = await apiContract.deleteQuotations(serverId, shopId, dataObj);
            setSnackBarStatus(!snackBarStatus);
            setDeleteQuotations(response);
        } catch (error) {
            console.error('Error deleting quotations:', error);
        }

        handleClear();
    };

    const handleClear = () => {
        setHardDelete(false);
        setImageDelete(false);
        setItemStatus('');
        setDate(moment());
    };

    useEffect(() => {
        setFormErrors({});
    }, [itemStatus, date]);

    return (
        <Paper sx={{ borderRadius: 2, backgroundColor: "#ffffff", margin: 'auto', maxWidth: 800, padding: 4, boxShadow: 4, marginTop: 5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!formErrors.itemStatus}>
                        <InputLabel id="item-status-select-label">Item Status</InputLabel>
                        <Select
                            labelId="item-status-select-label"
                            id="item-status-select"
                            value={itemStatus || []}
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
                            <MenuItem value="App">App</MenuItem>
                            <MenuItem value="Instock">Instock</MenuItem>
                            <MenuItem value="Catalogue">Catalogue</MenuItem>
                        </Select>
                        {formErrors.itemStatus && <Typography variant="caption" color="error">{formErrors.itemStatus}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>Hard Delete</Typography>
                        <Switch
                            checked={hardDelete}
                            onChange={handleHardDeleteChange}
                            inputProps={{ 'aria-label': 'Hard Delete' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
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
                <Grid item xs={12} display="flex" justifyContent="flex-end">
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
                onClose={() => setSnackBarStatus(!snackBarStatus)}
                message={deleteQuotations?.message || "Quotations deleted successfully"}
            />
        </Paper>
    );
};

export default QuotationCard;