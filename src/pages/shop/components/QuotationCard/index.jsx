

import { Box, InputLabel, MenuItem, Paper, Select, Typography, FormControl, Switch, Button, Grid } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { DatePicker } from 'antd';
import { ShopContext } from '../../../../context/ShopContext';
import apiContract from '../../services/shop.service';
import SnackAlert from '../../../../common/SnackAlert';

const QuotationCard = () => {
    const [itemStatus, setItemStatus] = useState([]);
    const [shops, setShops] = useState('');
    const [hardDelete, setHardDelete] = useState(false);
    const [imageDelete, setImageDelete] = useState(false);
    const [date, setDate] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [deleteQuotations,setDeletQuotations] = useState({});
    const [snackBarStatus,setSnackBarStatus] = useState(false);

    const shop = useContext(ShopContext);


    const handleChangeItemStatus = (event) => {
        const value = event.target.value.toUpperCase();
    
        if (value === "ALL") {
            setItemStatus(["", "INSTOCK", "CATALOGUE"]);
        } 
        else if (value === "APP"){
            setItemStatus([""]);
        }
         else {
            setItemStatus([value]);
        }
    };

    const handleChangeShops = (event) => {
        setShops(event.target.value);
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
        if (!shops) {
            errors.shops = 'Please select a shop';
        }
        if (!itemStatus) {
            errors.itemStatus = 'Please select an item status';
        }
        if (!date) {
            errors.date = 'Please select a date';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const serverId = 'af92ccfb-ea3c-40f7-b9bc-0f5d055c763c';
            const shopId = shops;
            let dataObj = {
                shopId,
                date,
                itemStatus:itemStatus.map(element => element === "All" ? element = "" : element),
                hardDelete,
                imageDelete
            }
            
            const response = await apiContract.deleteQuotations(serverId, shopId, dataObj);
            setSnackBarStatus(!snackBarStatus);
            setDeletQuotations(response);


        } catch (error) {
            // Handle the error here
            console.error('Error deleting quotations:', error);
        }

        // Clear form after successful save
        handleClear();
    };

    const handleClear = () => {
        setHardDelete(false);
        setImageDelete(false);
        setItemStatus('');
        setShops('');
        setDate(null);
    };

    useEffect(() => {
        setFormErrors({});
    }, [shops, itemStatus, date]);

    return (
        <Paper sx={{
            borderRadius: 2,
            backgroundColor: "#ffffff",
            margin: 'auto',
            maxWidth: 800,
            padding: 4,
            boxShadow: 4,
            marginTop: 5
        }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!formErrors.shops}>
                        <InputLabel id="shop-select-label">Shops</InputLabel>
                        <Select
                            labelId="shop-select-label"
                            id="shop-select"
                            value={shops}
                            label="Shops"
                            onChange={handleChangeShops}
                        >
                            <MenuItem value="">Select a shop</MenuItem>
                            <MenuItem value={23}>Shop 1</MenuItem>
                            <MenuItem value={24}>Shop 2</MenuItem>
                            <MenuItem value={31}>Shop 3</MenuItem>
                        </Select>
                        {formErrors.shops && <Typography variant="caption" color="error">{formErrors.shops}</Typography>}
                    </FormControl>
                </Grid>
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
                            style={{ width: '100%' }}
                            value={date}
                            defaultValue={new Date()}
                            onChange={handleDateChange}
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
                onClose={() => setSnackBarStatus(!snackBarStatus)}
                message={deleteQuotations?.message || "Quotations deleted successfully"}
            />
        </Paper>
    );
};

export default QuotationCard;