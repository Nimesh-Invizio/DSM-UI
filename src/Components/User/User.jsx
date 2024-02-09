import Sidenav from "../Sidenav";
import Navbar from "../Navbar";
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Input,
  InputLabel,
  InputAdornment
} from '@mui/material';
import { FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from "react-router-dom";

const User = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Pagination Start

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  //----------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get('http://127.0.0.1:8183/api/v1/users/');
        console.log("DATA", response.data.data)
        setTableData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Make sure to set loading to false in case of an error
      }
    };

    fetchData();
  }, []);


  const handleCreateNewRow = async (values) => {
    try {
      const response = await Axios.post('http://127.0.0.1:8183/api/v1/auth/register', values);
      setTableData([...tableData, response.data]);
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating a new row:', error);
    }
  };

  const handleEditRow = (row) => {
    console.log('Edit row', row.uniqueId);
    setEditModalOpen(true);
    setEditModalValues(row);
    console.log(`http://127.0.0.1:8183/api/v1/users/${row.uniqueId}`)

  };

  const exitEditingMode = () => {
    setEditModalOpen(false);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, values }) => {
    try {
      // console.log("Values: ", values);
  
      // Assuming the uniqueId is available in the values object
      const response = await Axios.patch(`http://127.0.0.1:8183/api/v1/users/${values.uniqueId}`, values);
  
      console.log('Update Response:', response.data); // Log the response
      
  
      // Update the existing row in the state without creating a new object
      setTableData((prevTableData) => {
        const updatedTableData = [...prevTableData];
        console.log('Updated tableData:', updatedTableData);

        const index = updatedTableData.findIndex((row) => row.uniqueId === values.uniqueId);
        if (index !== -1) {
          // Update the existing row values with editedValues
          updatedTableData[index] = { ...updatedTableData[index], ...values.editedValues };
        }
        return updatedTableData;
      });
  
      exitEditingMode();
  
      // Close the edit modal
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving row edits:', error);
    }
  };
  
  
  

  const handleDeleteRow = useCallback(
    async (row) => {
      if (!window.confirm(`Are you sure you want to delete ID: ${row.id}`)) {
        return;
      }

      try {
        await Axios.delete(`http://127.0.0.1:8183/api/v1/users/${row.uniqueId}`);
        const updatedTableData = [...tableData];
        updatedTableData.splice(row.index, 1);
        setTableData(updatedTableData);
      } catch (error) {
        console.error('Error deleting row:', error);
      }
    },
    [tableData],
  );

  const columns = useMemo(() => [
    // Define your columns as per your data structure
    { accessorKey: 'id', header: 'ID', enableEditing: false },
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'email', header: 'E-Mail' },
    // { accessorKey: 'createdAt', header: 'Date of Creation' }
  ], []);

  return (
    <>
      <Navbar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Button
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            sx={{ ml: 'auto', display: 'flex', justifyContent: 'flex-end' }}
          >
            + Add User
          </Button>
          <Box sx={{ p: 3 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.accessorKey} style={{ background: '#1976d2', color: 'white', fontSize: '20px', textAlign: 'center' }}>{column.header}</TableCell>
                    ))}
                    <TableCell style={{ background: '#1976d2', color: 'white', fontSize: '20px', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log("tableData type:", typeof tableData)}
                  {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.accessorKey} style={{ textAlign: "center" }}>{row[column.accessorKey]}</TableCell>
                      ))}
                      <TableCell style={{ textAlign: "center" }}>
                        <IconButton onClick={() => handleEditRow(row)}><FaPencilAlt></FaPencilAlt></IconButton>
                        <IconButton onClick={() => handleDeleteRow(row)}><FaTrash></FaTrash></IconButton>
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
              />
            </TableContainer>

          </Box>
          <CreateNewUserModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />

          <EditServerModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={(editedValues) => handleSaveRowEdits({ exitEditingMode, values: { ...editModalValues, ...editedValues } })}
            values={editModalValues}
          />``
        </Box>
      </Box>
    </>
  );
};

export const CreateNewUserModal = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState({ email: '', username: '', password: '', });

  const handleSubmit = () => {
    // Implement your validation logic here if needed
    onSubmit(values);
    onClose();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputLabel>E-Mail</InputLabel>
              <Input
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <InputLabel>Username</InputLabel>
              <Input
                value={values.username}
                onChange={(e) => setValues({ ...values, username: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Password</InputLabel>
              <Input
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export const EditServerModal = ({ open, onClose, onSubmit, values }) => {
  const [editedValues, setEditedValues] = useState(values);
  const [editModalValues, setEditModalValues] = useState({});

  const handleEditSubmit = () => {
    // Implement your validation logic here if needed
    onSubmit({ values, editedValues });
    onClose();
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  
    setEditModalValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputLabel>E-Mail</InputLabel>
              <Input
                value={editedValues.email}
                onChange={(e) => handleInputChange( 'email', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <InputLabel>Username</InputLabel>
              <Input
                value={editedValues.username}
                onChange={(e) => handleInputChange('username', e.target.value )}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Change Password</InputLabel>
              <Input
                value={editedValues.password}
                onChange={(e) => handleInputChange('password',  e.target.value )}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default User;
