import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Snackbar,
  TablePagination,
} from '@mui/material';
import { Edit, Delete, Add, Warning } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import Sidenav from "../../common/SideNav";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const User = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [deleteModalValues, setDeleteModalValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:8070/api/v1/users/');
      setTableData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data', 'error');
    }
  };

  const handleCreateNewRow = async (values) => {
    try {
      await Axios.post('http://localhost:8070/api/v1/auth/register', values);
      fetchData();
      setCreateModalOpen(false);
      showSnackbar('User created successfully', 'success');
    } catch (error) {
      console.error('Error creating a new row:', error);
      showSnackbar('Error creating user', 'error');
    }
  };

  const handleEditRow = (row) => {
    setEditModalOpen(true);
    setEditModalValues(row);
  };

  const handleSaveRowEdits = async (editedValues) => {
    try {
      await Axios.patch(`http://localhost:8070/api/v1/users/${editedValues.uniqueId}`, editedValues);
      fetchData();
      setEditModalOpen(false);
      showSnackbar('User updated successfully', 'success');
    } catch (error) {
      console.error('Error saving row edits:', error);
      showSnackbar('Error updating user', 'error');
    }
  };

  const handleDeleteRow = (row) => {
    setDeleteModalOpen(true);
    setDeleteModalValues(row);
  };

  const confirmDeleteRow = async () => {
    try {
      await Axios.delete(`http://localhost:8070/api/v1/users/${deleteModalValues.uniqueId}`);
      fetchData();
      setDeleteModalOpen(false);
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting row:', error);
      showSnackbar('Error deleting user', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedTableData = [...tableData].sort((a, b) => b.id - a.id);

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">User Management</Typography>
            <Button
              startIcon={<Add />}
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              sx={{ backgroundColor: '#6FC276', '&:hover': { backgroundColor: '#5DA266' } }}
            >
              Add User
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#6FC276', color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ backgroundColor: '#6FC276', color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ backgroundColor: '#6FC276', color: 'white', fontWeight: 'bold' }}>E-Mail</TableCell>
                  <TableCell sx={{ backgroundColor: '#6FC276', color: 'white', fontWeight: 'bold' }}>Is Admin</TableCell>
                  <TableCell sx={{ backgroundColor: '#6FC276', color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.isAdmin ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditRow(row)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteRow(row)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <CreateNewUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleSaveRowEdits}
        values={editModalValues}
      />
      <DeleteUserModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteRow}
        user={deleteModalValues}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          maxWidth: '90%'
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            maxWidth: '400px'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const CreateNewUserModal = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState({ email: '', username: '', password: '', isAdmin: false });

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <TextField
          label="E-Mail"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Username"
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.isAdmin}
              onChange={(e) => setValues({ ...values, isAdmin: e.target.checked })}
              color="primary"
            />
          }
          label="Is Admin"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#6FC276', '&:hover': { backgroundColor: '#5DA266' } }}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditUserModal = ({ open, onClose, onSubmit, values }) => {
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    if (open) {
      setEditedValues({ ...values, isAdmin: values.isAdmin || false });
    }
  }, [open, values]);

  const handleEditSubmit = () => {
    onSubmit(editedValues);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="E-Mail"
          name="email"
          value={editedValues.email || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Username"
          name="username"
          value={editedValues.username || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              name="isAdmin"
              checked={editedValues.isAdmin || false}
              onChange={handleInputChange}
              color="primary"
            />
          }
          label="Is Admin"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleEditSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#6FC276',
            '&:hover': { backgroundColor: '#5DA266' }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteUserModal = ({ open, onClose, onConfirm, user }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        <Warning sx={{ mr: 1, fontSize: 28 }} />
        Confirm Deletion
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the user <strong>{user.username}</strong>?
        </Typography>
        <Box
          sx={{
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '0.875rem',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#495057' }}>User Details:</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>ID: {user.id}</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>Username: {user.username}</Typography>
          <Typography variant="body2">Email: {user.email}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#6c757d',
            '&:hover': { backgroundColor: '#f8f9fa' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#dc3545',
            '&:hover': { backgroundColor: '#c82333' },
            fontWeight: 'bold',
          }}
        >
          Delete User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default User;