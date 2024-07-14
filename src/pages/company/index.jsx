import React, { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";
import PropTypes from 'prop-types';
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
  TextField,
  Typography,
  InputAdornment,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Sidenav from "../../common/SideNav";
import Navbar from "../../common/Navbar";
import apiContract from "../shop/services/shop.service";

const Company = () => {
  const [tableData, setTableData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [companyShopsMap, setCompanyShopsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const serverDetails = JSON.parse(localStorage.getItem('serverDetails'));
  const serverId = serverDetails ? serverDetails.uniqueId : null;

  const fetchShopsAndCreateMap = useCallback(async () => {
    try {
      const response = await apiContract.getAllShops(serverId);
      if (response.status === 200 && response.data) {
        const shopMap = response.data.reduce((acc, shop) => {
          if (shop.company && shop.company.id) {
            if (!acc[shop.company.id]) {
              acc[shop.company.id] = [];
            }
            acc[shop.company.id].push(shop);
          }
          return acc;
        }, {});
        setCompanyShopsMap(shopMap);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      setSnackbar({ open: true, message: 'Error fetching shops', severity: 'error' });
    }
  }, [serverId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/servers/companies/${serverId}`
      );
      setTableData(response.data.data || []);
      await fetchShopsAndCreateMap();
      setSnackbar({ open: true, message: 'Companies fetched successfully', severity: 'success' });
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({ open: true, message: 'Error fetching companies', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [serverId, fetchShopsAndCreateMap]);

  useEffect(() => {
    if (serverId) {
      fetchData();
    }
  }, [serverId, fetchData]);

  const handleCreateNewRow = async (values) => {
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/servers/company/${serverId}`,
        values
      );
      setTableData(prevData => [response.data, ...prevData]);
      setCreateModalOpen(false);
      setSnackbar({ open: true, message: 'Company created successfully', severity: 'success' });
      fetchData();
    } catch (error) {
      console.error("Error creating a new row:", error);
      setSnackbar({ open: true, message: 'Error creating company', severity: 'error' });
    }
  };

  const handleEditRow = async (row) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/servers/singleComp/${serverId}/${row.id}`
      );
      if (response && response.data && response.data.data) {
        setEditModalValues({
          id: response.data.data[0].id,
          companyName: response.data.data[0].companyName,
          email: response.data.data[0].email,
          maxLicense: response.data.data[0].maxLicense,
          phone: response.data.data[0].phone,
          state: response.data.data[0].addressId.state,
          city: response.data.data[0].addressId.city,
          country: response.data.data[0].addressId.country,
          pincode: response.data.data[0].addressId.pincode,
          addressLine1: response.data.data[0].addressId.addressLine1,
          addressLine2: response.data.data[0].addressId.addressLine2,
        });
        setEditModalOpen(true);
      } else {
        console.error("No data returned after editing");
        setSnackbar({ open: true, message: 'Error fetching company details', severity: 'error' });
      }
    } catch (error) {
      console.error("Error editing row:", error);
      setSnackbar({ open: true, message: 'Error fetching company details', severity: 'error' });
    }
  };

  const handleDeleteRow = (row) => {
    setCompanyToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await Axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/servers/deletecompany/${serverId}/${companyToDelete.id}`
        );
        setDeleteModalOpen(false);
        setCompanyToDelete(null);
        setSnackbar({ open: true, message: 'Company deleted successfully', severity: 'success' });
        fetchData();
      } catch (error) {
        console.error("Error deleting row:", error);
        setSnackbar({ open: true, message: 'Error deleting company', severity: 'error' });
      }
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", enableEditing: false },
      { accessorKey: "companyName", header: "Company-Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Contact No." },
      { accessorKey: "maxLicense", header: "Max-License" },
    ],
    []
  );

  return (
    <>
      <Navbar />
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Button
            color="primary"
            variant="contained"
            sx={{
              ml: "auto",
              display: "flex",
              justifyContent: "flex-end",
              background: "#6FC276",
              color: "white",
            }}
            onClick={() => setCreateModalOpen(true)}
          >
            + Add Company
          </Button>

          <Box sx={{ p: 3 }}>
            <TableContainer component={Paper}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                  <CircularProgress size={60} thickness={4} sx={{ color: '#6FC276' }} />
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.accessorKey}
                          style={{
                            background: "#6FC276",
                            color: "white",
                            fontSize: "20px",
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
                          fontSize: "20px",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.length > 0 ? (
                      tableData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id}>
                            {columns.map((column) => (
                              <TableCell
                                key={column.accessorKey}
                                style={{ textAlign: "center" }}
                              >
                                {row[column.accessorKey]}
                              </TableCell>
                            ))}
                            <TableCell style={{ textAlign: "center" }}>
                              <IconButton onClick={() => handleEditRow(row)}>
                                <FaPencilAlt />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteRow(row)}
                                disabled={companyShopsMap[row.id] && companyShopsMap[row.id].length > 0}
                                title={companyShopsMap[row.id] && companyShopsMap[row.id].length > 0 ?
                                  "Cannot delete company with shops" : "Delete company"}
                              >
                                <FaTrash color={companyShopsMap[row.id] && companyShopsMap[row.id].length > 0 ?
                                  "#ccc" : "inherit"} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} style={{ textAlign: "center" }}>
                          No companies available. Add a new company to get started!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </TableContainer>
          </Box>
          <CreateNewCompanyModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />

          <EditCompanyModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={fetchData}
            values={editModalValues}
          />
          
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this company?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#6FC276" }}>
          No
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ background: "#6FC276", color: "white" }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateNewCompanyModal = ({ open, onClose, onSubmit }) => {
  const initialValues = {
    companyName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    isPrimary: false,
    maxLicense: '',
    password: '',
  };

  const [values, setValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((prop) => (event) => {
    setValues(prevValues => ({ ...prevValues, [prop]: event.target.value }));
    setErrors(prevErrors => ({ ...prevErrors, [prop]: '' }));
  }, []);

  const handleSwitchChange = useCallback((event) => {
    setValues(prevValues => ({ ...prevValues, isPrimary: event.target.checked }));
  }, []);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prevShow => !prevShow);
  }, []);

  const validateForm = useCallback(() => {
    let tempErrors = {};
    Object.keys(values).forEach(key => {
      if (key !== 'isPrimary') {
        tempErrors[key] = values[key] ? '' : `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    tempErrors.email = /\S+@\S+\.\S+/.test(values.email) ? '' : 'Email is invalid';
    tempErrors.phone = /^\d{10}$/.test(values.phone) ? '' : 'Phone number must be 10 digits';
    tempErrors.pincode = /^\d{6}$/.test(values.pincode) ? '' : 'Pincode must be 6 digits';
    tempErrors.password = values.password.length >= 6 ? '' : 'Password must be at least 6 characters';
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === '');
  }, [values]);

  const handleSubmit = useCallback(async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await onSubmit(values);
        setValues(initialValues);
        onClose();
      } catch (error) {
        console.error("Error creating company:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [validateForm, values, onSubmit, onClose, initialValues]);

  useEffect(() => {
    if (!open) {
      setValues(initialValues);
      setErrors({});
    }
  }, [open, initialValues]);

  return (
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" component="div" sx={{ color: '#6FC276', fontWeight: 'bold', mb: 2 }}>
          Create New Company
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ '& .MuiTextField-root': { my: 1 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                value={values.companyName}
                onChange={handleChange('companyName')}
                fullWidth
                required
                error={!!errors.companyName}
                helperText={errors.companyName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={values.phone}
                onChange={handleChange('phone')}
                fullWidth
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max License"
                type="number"
                value={values.maxLicense}
                onChange={handleChange('maxLicense')}
                fullWidth
                required
                error={!!errors.maxLicense}
                helperText={errors.maxLicense}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                value={values.addressLine1}
                onChange={handleChange('addressLine1')}
                fullWidth
                multiline
                rows={2}
                required
                error={!!errors.addressLine1}
                helperText={errors.addressLine1}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 2"
                value={values.addressLine2}
                onChange={handleChange('addressLine2')}
                fullWidth
                multiline
                rows={2}
                required
                error={!!errors.addressLine2}
                helperText={errors.addressLine2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                value={values.state}
                onChange={handleChange('state')}
                fullWidth
                required
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                value={values.city}
                onChange={handleChange('city')}
                fullWidth
                required
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                value={values.country}
                onChange={handleChange('country')}
                fullWidth
                required
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pincode"
                value={values.pincode}
                onChange={handleChange('pincode')}
                fullWidth
                required
                error={!!errors.pincode}
                helperText={errors.pincode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.isPrimary}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Is Primary"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color: '#6FC276', borderColor: '#6FC276' }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#6FC276',
            '&:hover': { bgcolor: '#5BA362' },
            fontWeight: 'bold',
            px: 4
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditCompanyModal = ({ open, onClose, onSubmit, values }) => {
  const [editedValues, setEditedValues] = useState(values);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedValues(values);
  }, [values]);

  const handleChange = useCallback((field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setEditedValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = ['companyName', 'email', 'phone', 'maxLicense', 'state', 'city', 'country', 'pincode', 'addressLine1'];
    
    requiredFields.forEach(field => {
      if (!editedValues[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (editedValues.email && !/\S+@\S+\.\S+/.test(editedValues.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (editedValues.phone && !/^\d{10}$/.test(editedValues.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (editedValues.pincode && !/^\d{6}$/.test(editedValues.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editedValues]);

  const handleSubmit = useCallback(async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const serverDetails = JSON.parse(localStorage.getItem('serverDetails'));
        const serverId = serverDetails?.uniqueId;
        await Axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/servers/company/${serverId}/${values.id}`,
          editedValues
        );
        await onSubmit(editedValues);
        onClose();
      } catch (error) {
        console.error("Error updating company:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [validateForm, editedValues, values.id, onSubmit, onClose]);

  const formFields = useMemo(() => [
    { name: 'companyName', label: 'Company Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'maxLicense', label: 'Max License', type: 'number' },
    { name: 'addressLine1', label: 'Address Line 1', type: 'text' },
    { name: 'addressLine2', label: 'Address Line 2', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'country', label: 'Country', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
  ], []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" sx={{ color: '#6FC276', fontWeight: 'bold' }}>
          Edit Company
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  value={editedValues[field.name] || ''}
                  onChange={handleChange(field.name)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editedValues.isPrimary || false}
                    onChange={handleChange('isPrimary')}
                    color="primary"
                  />
                }
                label="Is Primary"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ color: '#6FC276', borderColor: '#6FC276' }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#6FC276',
            '&:hover': { bgcolor: '#5BA362' },
            fontWeight: 'bold',
            px: 4
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

CreateNewCompanyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

EditCompanyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default Company;