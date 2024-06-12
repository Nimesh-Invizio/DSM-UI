

import { Box, InputLabel, MenuItem, Paper, Select, Typography, FormControl, Switch, Button, Grid } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { DatePicker } from 'antd';
import { ShopContext } from '../../../../context/ShopContext';

const QuotationCard = () => {
    const [itemStatus, setItemStatus] = useState('');
    const [shops, setShops] = useState('');
    const [hardDelete, setHardDelete] = useState(false);
    const [imageDelete, setImageDelete] = useState(false);
    const [date, setDate] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const shop  = useContext(ShopContext);
    console.log(shop,"wqdesfawq");

    const handleChange = (event) => {
        setItemStatus(event.target.value);
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

    const handleSave = (event) => {
        // Reset form errors
        setFormErrors({});

        // Validate form data
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

        // If there are errors, set them in state and return
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // If form data is valid, perform save logic here
        // ...

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
        // Reset form errors when form values change
        setFormErrors({});
    }, [shops, itemStatus, date]);

    return (
        <Paper sx={{
            borderRadius: 2,
            backgroundColor: "#ffffff",
            margin: 'auto',
            maxWidth: 800,
            padding: 4,
            boxShadow: 4
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
                            <MenuItem value={10}>Shop 1</MenuItem>
                            <MenuItem value={20}>Shop 2</MenuItem>
                            <MenuItem value={30}>Shop 3</MenuItem>
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
                            value={itemStatus}
                            label="Item Status"
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select an item status</MenuItem>
                            <MenuItem value={10}>All</MenuItem>
                            <MenuItem value={20}>Instock</MenuItem>
                            <MenuItem value={30}>Catalogue</MenuItem>
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
        </Paper>
    );
};

export default QuotationCard;