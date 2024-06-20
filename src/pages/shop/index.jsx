import React, { useState, useEffect } from 'react';
import FeaturesCard from './components/FeaturesCard';
import './style.css';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import QuotationCard from './components/QuotationCard';
import ProductsCard from './components/ProductsCard';
import apiContract from './services/shop.service';
import LoadingSpinner from '../../common/LoadingSpinner'; 

const Shop = () => {
  const [actionType, setActionType] = useState("Shop Features");
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
      case "Shop Features":
        return <FeaturesCard shopData={shopData} />;
      case "Quotation Delete":
        return <QuotationCard shopData={shopData} />;
      case "Products Delete":
        return <ProductsCard shopData={shopData} />;
      case "All Images Delete":
        return <div>All Images Delete Component</div>;
      case "Stale Images Delete":
        return <div>Stale Images Delete Component</div>;
      case "Quotation Product Image Sync":
          return <div>Quotation Product Image Sync Component</div>;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "1rem",
          borderRadius: "2px solid red",
          margin: "5rem",
        }}
      >
        <div className="shop-header">
          <FormControl>
            <InputLabel id="demo-simple-select-label">Action Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={actionType}
              defaultValue="Shop Features"
              label="Action Type"
              onChange={handleChange}
              sx={{
                width: 200,
              }}
            >
              <MenuItem value="Shop Features">Shop Features</MenuItem>
              <MenuItem value="Quotation Delete">Quotation Delete</MenuItem>
              <MenuItem value="Products Delete">Products Delete</MenuItem>
              <MenuItem value="Quotation Product Image Sync">Quotation Product Image Sync</MenuItem>
              <MenuItem value="All Images Delete">All Images Delete</MenuItem>
              <MenuItem value="Stale Images Delete">Stale Images Delete</MenuItem>
            </Select>
          </FormControl>
        </div>
        {renderActionComponent()}
      </Box>
    </React.Fragment>
  );
};

export default Shop;