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

const Server = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loginDetailsDialogOpen, setLoginDetailsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
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
        const response = await Axios.get('http://localhost:3000/api/v1/servers/getallservers');
        console.log("DATA",response.data.data)
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
      const response = await Axios.post('http://localhost:3000/api/v1/servers/createservers', values);
      setTableData([...tableData, response.data]);
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating a new row:', error);
    }
  };

  const handleOpenLoginDetails = (row) => {
    setSelectedRow(row);
    setLoginDetailsDialogOpen(true);
  }

  const handleEditRow = (row) => {
    console.log('Edit row', row);
    setEditModalOpen(true);
    setEditModalValues(row);
    console.log(`http://localhost:3000/api/v1/servers/updateservers?id=${row.id}`)
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    console.log(row)
    try {

      console.log("Values: ", values)
      await Axios.put(`http://localhost:3000/api/v1/servers/updateservers?id=${row.id}`, values);
      const updatedTableData = [...tableData];
      updatedTableData[row.index] = values;
      setTableData(updatedTableData);

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
        await Axios.delete(`http://localhost:3000/api/v1/servers/deleteservers?id=${row.id}`);
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
    // { accessorKey: 'id', header: 'ID', enableEditing: false },
    { accessorKey: 'protocols', header: 'Protocol' },
    { accessorKey: 'portNumber', header: 'Port' },
    { accessorKey: 'IPaddress', header: 'IP Address' },
    { accessorKey: 'pathName', header: 'Provider' },
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
            + Add Server
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
                        <IconButton onClick={() => handleOpenLoginDetails(row)}><FaPlus></FaPlus></IconButton>
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
          <CreateNewServerModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
          <EditServerModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleSaveRowEdits}
            values={editModalValues}
          />
          <LoginDetailsDialog
            open={loginDetailsDialogOpen}
            onClose={() => setLoginDetailsDialogOpen(false)}
            selectedRow={selectedRow}
          />
        </Box>
      </Box>
    </>
  );
};

export const CreateNewServerModal = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState({ protocols: '', portNumber: '', IPaddress: '', pathName: '' });

  const handleSubmit = () => {
    // Implement your validation logic here if needed
    onSubmit(values);
    onClose();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Create New Server</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputLabel>Protocol</InputLabel>
              <Input
                value={values.protocols}
                onChange={(e) => setValues({ ...values, protocols: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>IP Address</InputLabel>
              <Input
                value={values.IPaddress}
                onChange={(e) => setValues({ ...values, IPaddress: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Port</InputLabel>
              <Input
                value={values.portNumber}
                onChange={(e) => setValues({ ...values, portNumber: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Provider</InputLabel>
              <Input
                value={values.pathName}
                onChange={(e) => setValues({ ...values, pathName: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Status (Either True or False)</InputLabel>
              <Input
                value={values.status}
                onChange={(e) => setValues({ ...values, status: e.target.value })}
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
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Edit Server</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputLabel>Protocol</InputLabel>
              <Input
                value={editedValues.protocols}
                onChange={(e) => handleInputChange('protocols', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>IP Address</InputLabel>
              <Input
                value={editedValues.IPaddress}
                onChange={(e) => handleInputChange('IPaddress', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Port</InputLabel>
              <Input
                value={editedValues.portNumber}
                onChange={(e) => handleInputChange('portNumber', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Provider</InputLabel>
              <Input
                value={editedValues.pathName}
                onChange={(e) => handleInputChange('pathName', e.target.value)}
                fullWidth
              />
            </Grid>
            {/* <Grid item xs={4}>
              <InputLabel>Status (Either True or False)</InputLabel>
              <Input
                value={values.status}
                onChange={(e) => setValues({ ...values, status: e.target.value })}
                fullWidth
              />
            </Grid> */}
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


export const LoginDetailsDialog = ({ open, onClose, selectedRow }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = () => {
    // Implement logic for handling login with the provided username and password
    console.log('Username:', username);
    console.log('Password:', password);

    // Close the dialog after handling login
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>DIVA Login</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel>Username</InputLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Password</InputLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Link to='/server/company'>
          <Button color="primary" variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  )
};



export default Server;
