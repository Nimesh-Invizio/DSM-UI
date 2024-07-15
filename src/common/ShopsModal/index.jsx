import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
    Paper,
    Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import FeaturesCard from '../../pages/shop/components/FeaturesCard';
import QuotationCard from '../../pages/shop/components/QuotationCard';
import ProductsCard from '../../pages/shop/components/ProductsCard';
import apiContract from '../../pages/shop/services/shop.service';
import LoadingSpinner from '../LoadingSpinner';
import { FaBuilding } from 'react-icons/fa';
import AllImageCard from '../../pages/shop/components/AllImageCard';
import QuotationProductImageSyncCard from '../../pages/shop/components/QuotationProductImageSyncCard';
import StaleImageCard from '../../pages/shop/components/StaleImageCard';

const ShopModal = ({ open, onClose, shopDetails }) => {
    const [actionType, setActionType] = useState('Shop Features');
    const [shopData, setShopData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;


    useEffect(() => {
        const fetchShops = async () => {
            try {
                setIsLoading(true);
                const response = await apiContract.getAllShops(serverId);
                if (response.status === 200) {
                    setShopData(response.data);
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShops();
    }, []);

    const handleChange = (event) => {
        setActionType(event.target.value);
    };

    const renderActionComponent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }

        if (!shopData) {
            return <LoadingSpinner />;
        }

        switch (actionType) {
            case 'Quotation Delete':
                return <QuotationCard  shopDetails={shopDetails} />;
            case 'Products Delete':
                return <ProductsCard  shopDetails={shopDetails} />;
            case 'All Images Delete':
                return <AllImageCard  shopDetails={shopDetails} />;
            case 'Stale Images Delete':
                return <StaleImageCard  shopDetails={shopDetails} />;
            case "Quotation Product Image Sync":
                return <QuotationProductImageSyncCard  shopDetails={shopDetails} />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 1,
                        ml: 0,
                        borderRadius: 2,
                        boxShadow: 3,
                        bgcolor: '#6FC276',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <FaBuilding size={20} color="#ffffff" />
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold', color: '#ffffff', ml: 1 }}
                    >
                        {shopDetails ? shopDetails.shopName : ''}
                    </Typography>
                </Paper>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="action-type-label">Action Type</InputLabel>
                        <Select
                            labelId="action-type-label"
                            id="action-type-select"
                            value={actionType}
                            defaultValue="Shop Features"
                            label="Action Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="Quotation Delete">Quotation Delete</MenuItem>
                            <MenuItem value="Products Delete">Products Delete</MenuItem>
                            <MenuItem value="Quotation Product Image Sync">Quotation Product Image Sync</MenuItem>
                            <MenuItem value="All Images Delete">All Images Delete</MenuItem>
                            <MenuItem value="Stale Images Delete">Stale Images Delete</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {renderActionComponent()}
            </DialogContent>
        </Dialog>
    );
};

export default ShopModal;