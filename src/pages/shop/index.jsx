// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   FormControl, 
//   InputLabel, 
//   MenuItem, 
//   Select, 
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import QuotationCard from './components/QuotationCard';
// import ProductsCard from './components/ProductsCard';
// import apiContract from './services/shop.service';
// import LoadingSpinner from '../../common/LoadingSpinner';
// import './style.css';

// const Shop = () => {
//   const [actionType, setActionType] = useState("Shop Features");
//   const [shopData, setShopData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedShop, setSelectedShop] = useState(null);
//   const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;

//   useEffect(() => {
//     const fetchShops = async () => {
//       try {
//         setIsLoading(true);
//         const response = await apiContract.getAllShops(serverId);
//         if (response.status === 200) {
//           setShopData(response.data);
//         } else {
//           console.error(response.message);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchShops();
//   }, [serverId]);

//   const handleChange = (event) => {
//     setActionType(event.target.value);
//   };

//   const handleDeleteClick = (shop) => {
//     setSelectedShop(shop);
//     setDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       setIsLoading(true);
//       const response = await apiContract.deleteShop(serverId, selectedShop.id);
//       if (response.status === 200) {
//         setShopData(shopData.filter(shop => shop.id !== selectedShop.id));
//         setDeleteModalOpen(false);
//       } else {
//         console.error(response.message);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const FeaturesCard = ({ shopData, onDeleteClick }) => {
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
//         {shopData.map((shop) => (
//           <Card key={shop.id} sx={{ minWidth: 275, maxWidth: 300 }}>
//             <CardContent>
//               <Typography variant="h5" component="div">
//                 {shop.name}
//               </Typography>
//               <Typography sx={{ mb: 1.5 }} color="text.secondary">
//                 ID: {shop.id}
//               </Typography>
//               <Button 
//                 variant="outlined" 
//                 color="error" 
//                 startIcon={<DeleteIcon />}
//                 onClick={() => onDeleteClick(shop)}
//               >
//                 Delete
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   const DeleteShopModal = ({ open, handleClose, handleConfirm, shopName }) => {
//     return (
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: '#d32f2f' }}>
//             <DeleteIcon sx={{ mr: 1 }} />
//             Confirm Deletion
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete the shop "{shopName}"? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             No, Cancel
//           </Button>
//           <Button onClick={handleConfirm} color="error" variant="contained" autoFocus>
//             Yes, Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };

//   const renderActionComponent = () => {
//     if (isLoading) {
//       return <LoadingSpinner />;
//     }

//     if (!shopData) {
//       return <LoadingSpinner />;
//     }

//     switch (actionType) {
//       case "Shop Features":
//         return <FeaturesCard shopData={shopData} onDeleteClick={handleDeleteClick} />;
//       case "Quotation Delete":
//         return <QuotationCard shopData={shopData} />;
//       case "Products Delete":
//         return <ProductsCard shopData={shopData} />;
//       case "All Images Delete":
//         return <div>All Images Delete Component</div>;
//       case "Stale Images Delete":
//         return <div>Stale Images Delete Component</div>;
//       case "Quotation Product Image Sync":
//         return <div>Quotation Product Image Sync Component</div>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <React.Fragment>
//       <Box
//         sx={{
//           backgroundColor: "#ffffff",
//           boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//           margin: "5rem",
//           padding: "2rem",
//         }}
//       >
//         <div className="shop-header">
//           <FormControl>
//             <InputLabel id="demo-simple-select-label">Action Type</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={actionType}
//               defaultValue="Shop Features"
//               label="Action Type"
//               onChange={handleChange}
//               sx={{
//                 width: 250,
//                 marginBottom: 2,
//               }}
//             >
//               <MenuItem value="Shop Features">Shop Features</MenuItem>
//               <MenuItem value="Quotation Delete">Quotation Delete</MenuItem>
//               <MenuItem value="Products Delete">Products Delete</MenuItem>
//               <MenuItem value="Quotation Product Image Sync">Quotation Product Image Sync</MenuItem>
//               <MenuItem value="All Images Delete">All Images Delete</MenuItem>
//               <MenuItem value="Stale Images Delete">Stale Images Delete</MenuItem>
//             </Select>
//           </FormControl>
//         </div>
//         {renderActionComponent()}
//       </Box>
//       <DeleteShopModal
//         open={deleteModalOpen}
//         handleClose={() => setDeleteModalOpen(false)}
//         handleConfirm={handleDeleteConfirm}
//         shopName={selectedShop?.name || ''}
//       />
//     </React.Fragment>
//   );
// };

// export default Shop;