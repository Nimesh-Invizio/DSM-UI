import React, { useCallback, useMemo, useState, useEffect, useContext } from "react";
import Axios from "axios";
import {
  Box,
  Button,
  IconButton,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  InputLabel,
  TextField,
  Tooltip,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { FaPencilAlt, FaPlus, FaTrash, FaMobile } from "react-icons/fa";
import { MdFolderSpecial } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Sidenav from "../../common/SideNav";
import Navbar from "../../common/Navbar";
import { ServerContext } from '../../context/ServerContext';
import DevicesModal from "../../common/DevicesModal";
import ShopsModal from "../../common/ShopsModal";
import apiContract from "../../pages/shop/services/shop.service";
import moment from "moment";

function Shops() {
  const [tableData, setTableData] = useState([]);
  const { uniqueId, id } = useParams();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [devicesModalOpen, setDevicesModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const [companyShopsMap, setCompanyShopsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [companies, setCompanies] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [deleteImages, setDeleteImages] = useState(false);
  const [deleteCustomers, setDeleteCustomers] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fetchStatus, setFetchStatus] = useState({ success: false, error: false });

  const [serverId, setServerId] = useState(() => {
    const serverDetails = JSON.parse(localStorage.getItem('serverDetails'));
    return serverDetails ? serverDetails.uniqueId : null;
  });

  useEffect(() => {
    if (uniqueId) {
      setServerId(uniqueId);
    }
  }, [uniqueId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getAllShop = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiContract.getAllShops(serverId);
      setTableData(response.data);
      
      const shopMap = {};
      response.data.forEach(shop => {
        if (shop.companyId) {
          if (!shopMap[shop.companyId]) {
            shopMap[shop.companyId] = [];
          }
          shopMap[shop.companyId].push(shop);
        }
      });
      setCompanyShopsMap(shopMap);
      setFetchStatus({ success: true, error: false });
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchStatus({ success: false, error: true });
    } finally {
      setIsLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    if (serverId) {
      getAllShop();
    }
  }, [serverId, getAllShop]);

  useEffect(() => {
    if (fetchStatus.success) {
      setSnackbar({
        open: true,
        message: "Shops fetched successfully",
        severity: "success",
      });
    } else if (fetchStatus.error) {
      setSnackbar({
        open: true,
        message: "Error fetching shops",
        severity: "error",
      });
    }
  }, [fetchStatus]);

  const handleCreateNewRow = useCallback(async (values) => {
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/servers/shop/${serverId}`,
        values
      );
      if (response.data.data.status){
        setCreateModalOpen(false);
        await getAllShop();
        setSnackbar({
          open: true,
          message: "Shop created successfully",
          severity: "success",
        });
      }
      else{
        // setCreateModalOpen(true);
        // await getAllShop();
        setSnackbar({
          open: true,
          message: response.data.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error creating a new row:", error);
     
    }
  }, [serverId, getAllShop]);

  const handleEditRow = useCallback(async (row) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/servers/singleshop/${serverId}/${row.id}`
      );
  
      if (response && response.data && response.data.data && response.data.data.data) {
        const updatedData = response.data.data.data;
        console.log(updatedData,"dssdsasdsa");
        setEditModalValues(updatedData);
        setEditModalOpen(true);
      } else {
        console.error("No data returned after fetching shop details");
        setSnackbar({
          open: true,
          message: "Error fetching shop details",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching shop details:", error);
      setSnackbar({
        open: true,
        message: "Error fetching shop details",
        severity: "error",
      });
    }
  }, [serverId]);

  const handleDeleteRow = useCallback((row) => {
    if (companyShopsMap[row.companyId] && companyShopsMap[row.companyId].length > 0) {
      setSnackbar({
        open: true,
        message: "Cannot delete a shop associated with a company",
        severity: "warning",
      });
      return;
    }

    setShopToDelete(row);
    setDeleteModalOpen(true);
  }, [companyShopsMap]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!shopToDelete) return;

    try {
      await apiContract.deleteShop(serverId, shopToDelete.id, {
        deleteImages,
        deleteCustomers
      });
      await getAllShop();
      setSnackbar({
        open: true,
        message: "Shop deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting shop:", error);
      setSnackbar({
        open: true,
        message: "Error deleting shop",
        severity: "error",
      });
    } finally {
      setDeleteModalOpen(false);
      setShopToDelete(null);
      setDeleteImages(false);
      setDeleteCustomers(false);
    }
  }, [serverId, shopToDelete, deleteImages, deleteCustomers, getAllShop]);

  const handleDevicesModal = useCallback((shop) => {
    setDevicesModalOpen(true);
    setSelectedShop(shop);
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", enableEditing: false },
      { accessorKey: "shopName", header: "Shop Name" },
      { accessorKey: "devices", header: "Devices" },
      { accessorKey: "features", header: "Features" },
    ],
    []
  );

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/servers/companies/${serverId}`);
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenShopModal = useCallback((shop) => {
    setShowShopModal(true);
    setSelectedShop(shop);
  }, []);

  const handleCloseShopModal = useCallback(() => {
    setShowShopModal(false);
  }, []);

  return (
    <>
      <Navbar />
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              color="primary"
              variant="contained"
              sx={{
                ml: "auto",
                background: "#6FC276",
                color: "white",
              }}
              onClick={() => setCreateModalOpen(true)}
            >
              <FaPlus style={{ marginRight: '5px' }} />
              Add Shop
            </Button>
            <DevicesModal
              open={devicesModalOpen}
              onClose={() => setDevicesModalOpen(false)}
              shop={selectedShop}
            />
          </Box>

          <Box sx={{ p: 3 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#6FC276' }} />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.accessorKey}
                          style={{
                            background: "#6FC276",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {column.header}
                        </TableCell>
                      ))}
                      <TableCell
                        style={{
                          background: "#6FC276",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {columns.map((column) => (
                            <TableCell
                              key={column.accessorKey}
                              style={{ textAlign: "center" }}
                            >
                              {column.accessorKey === "devices" ? (
                                <IconButton onClick={() => handleDevicesModal(row)}>
                                  <FaMobile />
                                </IconButton>
                              ) : column.accessorKey === "features" ? (
                                <IconButton onClick={() => handleOpenShopModal(row)}>
                                  <MdFolderSpecial />
                                </IconButton>
                              ) : (
                                row[column.accessorKey]
                              )}
                            </TableCell>
                          ))}
                          <TableCell style={{ textAlign: "center" }}>
                            <Tooltip title={companyShopsMap[row.companyId] && companyShopsMap[row.companyId].length > 0 ? "Cannot delete shop associated with a company" : "Delete shop"}>
                              <span>
                                <IconButton 
                                  onClick={() => handleDeleteRow(row)}
                                  disabled={companyShopsMap[row.companyId] && companyShopsMap[row.companyId].length > 0}
                                >
                                  <FaTrash />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <IconButton onClick={() => handleEditRow(row)}>
                              <FaPencilAlt />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={tableData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  nextIconButtonText="Next"
                  backIconButtonText="Previous"
                  sx={{
                    ".MuiTablePagination-toolbar": {
                      backgroundColor: "#6FC276",
                      color: "white",
                    },
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                      color: "white",
                    },
                  }}
                />
              </TableContainer>
            )}
          </Box>

          <ShopsModal shopDetails={selectedShop} open={showShopModal} onClose={handleCloseShopModal} />

          <CreateNewShopModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
            companies={companies}
          />

<EditShopModal
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  onSubmit={getAllShop}
  values={editModalValues}
  companies={companies}
  serverId={serverId}
/>
          <DeleteShopModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            shopName={shopToDelete?.shopName}
            deleteImages={deleteImages}
            setDeleteImages={setDeleteImages}
            deleteCustomers={deleteCustomers}
            setDeleteCustomers={setDeleteCustomers}
          />

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <MuiAlert 
              elevation={6} 
              variant="filled" 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </MuiAlert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}


const CreateNewShopModal = ({ open, onClose, onSubmit, companies }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object().shape({
    shopName: Yup.string().required('Shop name is required'),
    companyId: Yup.string().required('Company is required'),
    licenseRegAt: Yup.date().required('License registration date is required'),
    licenseExpiresAt: Yup.date().required('License expiration date is required'),
    addressLine1: Yup.string().required('Address line 1 is required'),
    addressLine2: Yup.string().required('Address line 2 is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pinCode: Yup.string().required('Pin code is required'),
    country: Yup.string().required('Country is required'),
    features: Yup.string().required('Features is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    allowedDevices: Yup.number().min(1, 'At least 1 device must be allowed').required('Number of allowed devices is required'),
  });

  const formik = useFormik({
    initialValues: {
      shopName: "",
      companyId: "",
      licenseRegAt: "",
      licenseExpiresAt: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      pinCode: "",
      country: "",
      isPrimary: 0,
      email: "",
      phone: "",
      features: "",
      allowedDevices: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await onSubmit(values);
        if (result) {
          setSnackbar({
            open: true,
            message: "Shop created successfully",
            severity: "success",
          });
          onClose();
        } 
  
      } catch (error) {
        console.log(error);
        // setSnackbar({
        //   open: true,
        //   message: "Error creating shop: " + error.message,
        //   severity: "error",
        // });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#6FC276', color: 'white' }}>Create New Shop</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <InputLabel>Company</InputLabel>
                <Select
                  name="companyId"
                  value={formik.values.companyId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.companyId && Boolean(formik.errors.companyId)}
                  fullWidth
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.companyId && formik.errors.companyId && (
                  <div style={{color: 'red'}}>{formik.errors.companyId}</div>
                )}
              </Grid>
              
              <Grid item xs={4}>
                <InputLabel>Shop Name</InputLabel>
                <TextField
                  name="shopName"
                  value={formik.values.shopName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.shopName && Boolean(formik.errors.shopName)}
                  helperText={formik.touched.shopName && formik.errors.shopName}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>License Registration Date</InputLabel>
                <TextField
                  name="licenseRegAt"
                  type="date"
                  value={formik.values.licenseRegAt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.licenseRegAt && Boolean(formik.errors.licenseRegAt)}
                  helperText={formik.touched.licenseRegAt && formik.errors.licenseRegAt}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* <Grid item xs={4}>
                <InputLabel>License Key</InputLabel>
                <TextField
                  name="licenseKey"
                  value={formik.values.licenseKey}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.licenseKey && Boolean(formik.errors.licenseKey)}
                  helperText={formik.touched.licenseKey && formik.errors.licenseKey}
                  fullWidth
                />
              </Grid> */}

              <Grid item xs={4}>
                <InputLabel>License Expiration Date</InputLabel>
                <TextField
                  name="licenseExpiresAt"
                  type="date"
                  value={formik.values.licenseExpiresAt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.licenseExpiresAt && Boolean(formik.errors.licenseExpiresAt)}
                  helperText={formik.touched.licenseExpiresAt && formik.errors.licenseExpiresAt}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Address Line 1</InputLabel>
                <TextField
                  name="addressLine1"
                  value={formik.values.addressLine1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                  helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Address Line 2</InputLabel>
                <TextField
                  name="addressLine2"
                  value={formik.values.addressLine2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.addressLine2 && Boolean(formik.errors.addressLine2)}
                  helperText={formik.touched.addressLine2 && formik.errors.addressLine2}

                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>State</InputLabel>
                <TextField
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>City</InputLabel>
                <TextField
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Pin Code</InputLabel>
                <TextField
                  name="pinCode"
                  value={formik.values.pinCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                  helperText={formik.touched.pinCode && formik.errors.pinCode}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Country</InputLabel>
                <TextField
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.country && Boolean(formik.errors.country)}
                  helperText={formik.touched.country && formik.errors.country}
                  fullWidth
                />
              </Grid>

              {/* <Grid item xs={4}>
                <InputLabel>Tax Type</InputLabel>
                <TextField
                  name="taxType"
                  value={formik.values.taxType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                />
              </Grid> */}

              {/* <Grid item xs={4}>
                <InputLabel>Tax Number</InputLabel>
                <TextField
                  name="taxNumber"
                  value={formik.values.taxNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                />
              </Grid> */}

              <Grid item xs={4}>
                <InputLabel>Is Primary</InputLabel>
                <Select
                  name="isPrimary"
                  value={formik.values.isPrimary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Email</InputLabel>
                <TextField
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Phone</InputLabel>
                <TextField
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  fullWidth
                />
              </Grid>

              {/* <Grid item xs={4}>
                <InputLabel>Password</InputLabel>
                <TextField
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                />
              </Grid> */}

              {/* <Grid item xs={4}>
                <InputLabel>Quotation All Status</InputLabel>
                <TextField
                  name="quotationAllStatus"
                  value={formik.values.quotationAllStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                />
              </Grid> */}

              <Grid item xs={4}>
                <InputLabel>Allowed Devices</InputLabel>
                <TextField
                  name="allowedDevices"
                  type="number"
                  value={formik.values.allowedDevices}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.allowedDevices && Boolean(formik.errors.allowedDevices)}
                  helperText={formik.touched.allowedDevices && formik.errors.allowedDevices}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel>Features</InputLabel>
                <TextField
                  name="features"
                  value={formik.values.features}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Button onClick={onClose} sx={{ color: "#6FC276" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#6FC276", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
// const CreateNewShopModal = ({ open, onClose, onSubmit, companies }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const validationSchema = useMemo(() => Yup.object().shape({
//     shopName: Yup.string().required('Shop name is required'),
//     companyId: Yup.string().required('Company is required'),
//     licenseRegAt: Yup.date().required('License registration date is required'),
//     licenseExpiresAt: Yup.date().required('License expiration date is required'),
//     addressLine1: Yup.string().required('Address line 1 is required'),
//     addressLine2: Yup.string(),
//     state: Yup.string().required('State is required'),
//     city: Yup.string().required('City is required'),
//     pinCode: Yup.string().required('Pin code is required'),
//     country: Yup.string().required('Country is required'),
//     features: Yup.string().required('Features is required'),
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     phone: Yup.string().required('Phone number is required'),
//     allowedDevices: Yup.number().min(1, 'At least 1 device must be allowed').required('Number of allowed devices is required'),
//   }), []);

//   const formikConfig = useMemo(() => ({
//     initialValues: {
//       shopName: "",
//       companyId: "",
//       licenseRegAt: "",
//       licenseExpiresAt: "",
//       addressLine1: "",
//       addressLine2: "",
//       state: "",
//       city: "",
//       pinCode: "",
//       country: "",
//       isPrimary: 0,
//       email: "",
//       phone: "",
//       features: "",
//       allowedDevices: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         await onSubmit(values);
//         setSnackbar({
//           open: true,
//           message: "Shop created successfully",
//           severity: "success",
//         });
//         onClose();
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: "Error creating shop: " + error.message,
//           severity: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   }), [onSubmit, onClose, validationSchema]);

//   const formik = useFormik(formikConfig);

//   useEffect(() => {
//     if (open) {
//       formik.resetForm();
//     }
//   }, [open, formik]);

//   const handleSnackbarClose = useCallback(() => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   }, []);

//   return (
//     <>
//       <Dialog open={open} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ bgcolor: '#6FC276', color: 'white' }}>Create New Shop</DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent sx={{ p: 3 }}>
//             <Grid container spacing={3}>
//               <Grid item xs={4}>
//                 <InputLabel>Company</InputLabel>
//                 <Select
//                   name="companyId"
//                   value={formik.values.companyId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.companyId && Boolean(formik.errors.companyId)}
//                   fullWidth
//                 >
//                   {companies.map((company) => (
//                     <MenuItem key={company.id} value={company.id}>
//                       {company.companyName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {formik.touched.companyId && formik.errors.companyId && (
//                   <div style={{color: 'red'}}>{formik.errors.companyId}</div>
//                 )}
//               </Grid>
              
//               <Grid item xs={4}>
//                 <InputLabel>Shop Name</InputLabel>
//                 <TextField
//                   name="shopName"
//                   value={formik.values.shopName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.shopName && Boolean(formik.errors.shopName)}
//                   helperText={formik.touched.shopName && formik.errors.shopName}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>License Registration Date</InputLabel>
//                 <TextField
//                   name="licenseRegAt"
//                   type="date"
//                   value={formik.values.licenseRegAt}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.licenseRegAt && Boolean(formik.errors.licenseRegAt)}
//                   helperText={formik.touched.licenseRegAt && formik.errors.licenseRegAt}
//                   fullWidth
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>License Expiration Date</InputLabel>
//                 <TextField
//                   name="licenseExpiresAt"
//                   type="date"
//                   value={formik.values.licenseExpiresAt}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.licenseExpiresAt && Boolean(formik.errors.licenseExpiresAt)}
//                   helperText={formik.touched.licenseExpiresAt && formik.errors.licenseExpiresAt}
//                   fullWidth
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Address Line 1</InputLabel>
//                 <TextField
//                   name="addressLine1"
//                   value={formik.values.addressLine1}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
//                   helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Address Line 2</InputLabel>
//                 <TextField
//                   name="addressLine2"
//                   value={formik.values.addressLine2}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>State</InputLabel>
//                 <TextField
//                   name="state"
//                   value={formik.values.state}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.state && Boolean(formik.errors.state)}
//                   helperText={formik.touched.state && formik.errors.state}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>City</InputLabel>
//                 <TextField
//                   name="city"
//                   value={formik.values.city}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.city && Boolean(formik.errors.city)}
//                   helperText={formik.touched.city && formik.errors.city}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Pin Code</InputLabel>
//                 <TextField
//                   name="pinCode"
//                   value={formik.values.pinCode}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
//                   helperText={formik.touched.pinCode && formik.errors.pinCode}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Country</InputLabel>
//                 <TextField
//                   name="country"
//                   value={formik.values.country}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.country && Boolean(formik.errors.country)}
//                   helperText={formik.touched.country && formik.errors.country}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Is Primary</InputLabel>
//                 <Select
//                   name="isPrimary"
//                   value={formik.values.isPrimary}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 >
//                   <MenuItem value={0}>No</MenuItem>
//                   <MenuItem value={1}>Yes</MenuItem>
//                 </Select>
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Email</InputLabel>
//                 <TextField
//                   name="email"
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.email && Boolean(formik.errors.email)}
//                   helperText={formik.touched.email && formik.errors.email}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Phone</InputLabel>
//                 <TextField
//                   name="phone"
//                   value={formik.values.phone}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.phone && Boolean(formik.errors.phone)}
//                   helperText={formik.touched.phone && formik.errors.phone}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Allowed Devices</InputLabel>
//                 <TextField
//                   name="allowedDevices"
//                   type="number"
//                   value={formik.values.allowedDevices}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.allowedDevices && Boolean(formik.errors.allowedDevices)}
//                   helperText={formik.touched.allowedDevices && formik.errors.allowedDevices}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <InputLabel>Features</InputLabel>
//                 <TextField
//                   name="features"
//                   value={formik.values.features}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                   multiline
//                   rows={4}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
//             <Button onClick={onClose} sx={{ color: "#6FC276" }}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{ background: "#6FC276", color: "white" }}
//               disabled={isLoading}
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Create"}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <MuiAlert 
//           elevation={6} 
//           variant="filled" 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </MuiAlert>
//       </Snackbar>
//     </>
//   );
// };


const EditShopModal = ({ open, onClose, onSubmit, values, serverId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object().shape({
    shopName: Yup.string().required('Shop name is required'),
    licenseRegAt: Yup.date().required('License registration date is required'),
    licenseKey: Yup.string().required('License key is required'),
    licenseExpiresAt: Yup.date().required('License expiration date is required')
      .min(Yup.ref('licenseRegAt'), 'Expiration date must be after registration date'),
    address: Yup.object().shape({
      addressLine1: Yup.string().required('Address line 1 is required'),
      addressLine2: Yup.string().required('Address line 2 is required'),
      state: Yup.string().required('State is required'),
      city: Yup.string().required('City is required'),
      pinCode: Yup.string().required('Pin code is required'),
      country: Yup.string().required('Country is required'),
    }),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    allowedDevices: Yup.number().min(1, 'At least 1 device must be allowed').required('Number of allowed devices is required'),
  });
  



  console.log(values,"values");
  const formik = useFormik({
    initialValues: {
      id: values.id || '',
      shopName: values.shopName || '',
      licenseRegAt: values.licenseRegAt ? moment(values.licenseRegAt).format('YYYY-MM-DD') : '',
      licenseExpiresAt: values.licenseExpiresAt ? moment(values.licenseExpiresAt).format('YYYY-MM-DD') : '',
      licenseKey: values.licenseKey || '',
      address: {
        addressLine1: values.address?.addressLine1 || '',
        addressLine2: values.address?.addressLine2 || '',
        state: values.address?.state || '',
        city: values.address?.city || '',
        pinCode: values.address?.pinCode || '',
        country: values.address?.country || '',
      },
      isPrimary: values.isPrimary || false,
      email: values.email || '',
      phone: values.phone || '',
      allowedDevices: values.allowedDevices || 0,
      features: values.features || '',
    },
  
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      setIsLoading(true);
      try {
        const response = await Axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/servers/shop/${serverId}/${formValues.id}`,
          formValues
        );
        if (response.data.status) {
          setSnackbar({
            open: true,
            message: "Shop updated successfully",
            severity: "success",
          });
          onSubmit();
          onClose();
        } else {
          throw new Error(response.data.message || "Failed to update shop");
        }
      } catch (error) {
        console.error("Error updating shop:", error);
        setSnackbar({
          open: true,
          message: "Error updating shop: " + (error.message || "Unknown error"),
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  console.log(formik.errors,"ggggggggggg");
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#6FC276', color: 'white' }}>Edit Shop</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <InputLabel>Shop Name</InputLabel>
                <TextField
                  name="shopName"
                  value={formik.values.shopName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.shopName && Boolean(formik.errors.shopName)}
                  helperText={formik.touched.shopName && formik.errors.shopName}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>License Registration Date</InputLabel>
                <TextField
                  name="licenseRegAt"
                  type="date"
                  value={formik.values.licenseRegAt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.licenseRegAt && Boolean(formik.errors.licenseRegAt)}
                  helperText={formik.touched.licenseRegAt && formik.errors.licenseRegAt}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>License Expiration Date</InputLabel>
                <TextField
                  name="licenseExpiresAt"
                  type="date"
                  value={formik.values.licenseExpiresAt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.licenseExpiresAt && Boolean(formik.errors.licenseExpiresAt)}
                  helperText={formik.touched.licenseExpiresAt && formik.errors.licenseExpiresAt}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>License Key</InputLabel>
                <TextField
                  name="licenseKey"
                  value={formik.values.licenseKey}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.licenseKey && Boolean(formik.errors.licenseKey)}
                  helperText={formik.touched.licenseKey && formik.errors.licenseKey}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Address Line 1</InputLabel>
                <TextField
                  name="address.addressLine1"
                  value={formik.values.address?.addressLine1 || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address?.addressLine1 && Boolean(formik.errors.address?.addressLine1)}
                  helperText={formik.touched.address?.addressLine1 && formik.errors.address?.addressLine1}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Address Line 2</InputLabel>
                <TextField
                  name="address.addressLine2"
                  value={formik.values.address?.addressLine2 || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>State</InputLabel>
                <TextField
                  name="address.state"
                  value={formik.values.address?.state || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                  helperText={formik.touched.address?.state && formik.errors.address?.state}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>City</InputLabel>
                <TextField
                  name="address.city"
                  value={formik.values.address?.city || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                  helperText={formik.touched.address?.city && formik.errors.address?.city}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Pin Code</InputLabel>
                <TextField
                  name="address.pinCode"
                  value={formik.values.address?.pinCode || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address?.pinCode && Boolean(formik.errors.address?.pinCode)}
                  helperText={formik.touched.address?.pinCode && formik.errors.address?.pinCode}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Country</InputLabel>
                <TextField
                  name="address.country"
                  value={formik.values.address?.country || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                  helperText={formik.touched.address?.country && formik.errors.address?.country}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Is Primary</InputLabel>
                <Select
                  name="isPrimary"
                  value={formik.values.isPrimary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Email</InputLabel>
                <TextField
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Phone</InputLabel>
                <TextField
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel>Allowed Devices</InputLabel>
                <TextField
                  name="allowedDevices"
                  type="number"
                  value={formik.values.allowedDevices}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.allowedDevices && Boolean(formik.errors.allowedDevices)}
                  helperText={formik.touched.allowedDevices && formik.errors.allowedDevices}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel>Features</InputLabel>
                <TextField
                  name="features"
                  value={formik.values.features}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Button onClick={onClose} sx={{ color: "#6FC276" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: "#6FC276", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};


// const EditShopModal = ({ open, onClose, onSubmit, values, companies }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const validationSchema = Yup.object().shape({
//     shopName: Yup.string().required('Shop name is required'),
//     companyId: Yup.string().required('Company is required'),
//     licenseRegAt: Yup.date().required('License registration date is required'),
//     licenseKey: Yup.string().required('License key is required'),
//     licenseExpiresAt: Yup.date().required('License expiration date is required'),
//     addressLine1: Yup.string().required('Address line 1 is required'),
//     state: Yup.string().required('State is required'),
//     city: Yup.string().required('City is required'),
//     pinCode: Yup.string().required('Pin code is required'),
//     country: Yup.string().required('Country is required'),
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     phone: Yup.string().required('Phone number is required'),
//     allowedDevices: Yup.number().min(1, 'At least 1 device must be allowed').required('Number of allowed devices is required'),
//   });

//   const formik = useFormik({
//     initialValues: values,
//     validationSchema: validationSchema,
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         await onSubmit(values);
//         setSnackbar({
//           open: true,
//           message: "Shop updated successfully",
//           severity: "success",
//         });
//         onClose();
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: "Error updating shop: " + error.message,
//           severity: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   });

//   return (
//     <>
//       <Dialog open={open} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ bgcolor: '#6FC276', color: 'white' }}>Edit Shop</DialogTitle>
//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent sx={{ p: 3 }}>
//             <Grid container spacing={3}>
//               <Grid item xs={4}>
//                 <InputLabel>Company</InputLabel>
//                 <Select
//                   name="companyId"
//                   value={formik.values.companyId}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.companyId && Boolean(formik.errors.companyId)}
//                   fullWidth
//                 >
//                   {companies.map((company) => (
//                     <MenuItem key={company.id} value={company.id}>
//                       {company.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {formik.touched.companyId && formik.errors.companyId && (
//                   <div style={{color: 'red'}}>{formik.errors.companyId}</div>
//                 )}
//               </Grid>
              
//               <Grid item xs={4}>
//                 <InputLabel>Shop Name</InputLabel>
//                 <TextField
//                   name="shopName"
//                   value={formik.values.shopName}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.shopName && Boolean(formik.errors.shopName)}
//                   helperText={formik.touched.shopName && formik.errors.shopName}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>License Registration Date</InputLabel>
//                 <TextField
//                   name="licenseRegAt"
//                   type="date"
//                   value={formik.values.licenseRegAt}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.licenseRegAt && Boolean(formik.errors.licenseRegAt)}
//                   helperText={formik.touched.licenseRegAt && formik.errors.licenseRegAt}
//                   fullWidth
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>License Key</InputLabel>
//                 <TextField
//                   name="licenseKey"
//                   value={formik.values.licenseKey}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.licenseKey && Boolean(formik.errors.licenseKey)}
//                   helperText={formik.touched.licenseKey && formik.errors.licenseKey}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>License Expiration Date</InputLabel>
//                 <TextField
//                   name="licenseExpiresAt"
//                   type="date"
//                   value={formik.values.licenseExpiresAt}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.licenseExpiresAt && Boolean(formik.errors.licenseExpiresAt)}
//                   helperText={formik.touched.licenseExpiresAt && formik.errors.licenseExpiresAt}
//                   fullWidth
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Address Line 1</InputLabel>
//                 <TextField
//                   name="addressLine1"
//                   value={formik.values.addressLine1}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
//                   helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Address Line 2</InputLabel>
//                 <TextField
//                   name="addressLine2"
//                   value={formik.values.addressLine2}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>State</InputLabel>
//                 <TextField
//                   name="state"
//                   value={formik.values.state}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.state && Boolean(formik.errors.state)}
//                   helperText={formik.touched.state && formik.errors.state}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>City</InputLabel>
//                 <TextField
//                   name="city"
//                   value={formik.values.city}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.city && Boolean(formik.errors.city)}
//                   helperText={formik.touched.city && formik.errors.city}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Pin Code</InputLabel>
//                 <TextField
//                   name="pinCode"
//                   value={formik.values.pinCode}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
//                   helperText={formik.touched.pinCode && formik.errors.pinCode}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Country</InputLabel>
//                 <TextField
//                   name="country"
//                   value={formik.values.country}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.country && Boolean(formik.errors.country)}
//                   helperText={formik.touched.country && formik.errors.country}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Tax Type</InputLabel>
//                 <TextField
//                   name="taxType"
//                   value={formik.values.taxType}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Tax Number</InputLabel>
//                 <TextField
//                   name="taxNumber"
//                   value={formik.values.taxNumber}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Is Primary</InputLabel>
//                 <Select
//                   name="isPrimary"
//                   value={formik.values.isPrimary}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 >
//                   <MenuItem value={0}>No</MenuItem>
//                   <MenuItem value={1}>Yes</MenuItem>
//                 </Select>
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Email</InputLabel>
//                 <TextField
//                   name="email"
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.email && Boolean(formik.errors.email)}
//                   helperText={formik.touched.email && formik.errors.email}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Phone</InputLabel>
//                 <TextField
//                   name="phone"
//                   value={formik.values.phone}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.phone && Boolean(formik.errors.phone)}
//                   helperText={formik.touched.phone && formik.errors.phone}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Quotation All Status</InputLabel>
//                 <TextField
//                   name="quotationAllStatus"
//                   value={formik.values.quotationAllStatus}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={4}>
//                 <InputLabel>Allowed Devices</InputLabel>
//                 <TextField
//                   name="allowedDevices"
//                   type="number"
//                   value={formik.values.allowedDevices}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.allowedDevices && Boolean(formik.errors.allowedDevices)}
//                   helperText={formik.touched.allowedDevices && formik.errors.allowedDevices}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <InputLabel>Features</InputLabel>
//                 <TextField
//                   name="features"
//                   value={formik.values.features}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   fullWidth
//                   multiline
//                   rows={4}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
//             <Button onClick={onClose} sx={{ color: "#6FC276" }}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{ background: "#6FC276", color: "white" }}
//               disabled={isLoading}
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <MuiAlert 
//           elevation={6} 
//           variant="filled" 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </MuiAlert>
//       </Snackbar>
//     </>
//   );
// };

const DeleteShopModal = ({ open, onClose, onConfirm, shopName, deleteImages, setDeleteImages, deleteCustomers, setDeleteCustomers }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#ff6b6b', color: 'white' }}>Confirm Delete</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete the shop "{shopName}"?
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={deleteImages}
              onChange={(e) => setDeleteImages(e.target.checked)}
              color="primary"
            />
          }
          label="Delete associated images"
        />
        <FormControlLabel
          control={
            <Switch
              checked={deleteCustomers}
              onChange={(e) => setDeleteCustomers(e.target.checked)}
              color="primary"
            />
          }
          label="Delete associated customers"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Button onClick={onClose} sx={{ color: "#6FC276" }}>
          Cancel
        </Button>
        <Button
          color="error"
          onClick={onConfirm}
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Shops;