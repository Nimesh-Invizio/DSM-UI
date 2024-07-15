import React, { useState, useEffect } from "react";
import Axios from "axios";
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
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Navbar from "../../common/Navbar";
import Sidenav from "../../common/SideNav";
import GetData from "../../utils/utility";
import { useNavigate } from "react-router-dom";

const Server = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginDetailsDialogOpen, setLoginDetailsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/servers/`
      );
      setTableData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateNewRow = async (values) => {
    try {
      let status = Boolean(values.status)
      const response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/servers/`,
        values
      );
      fetchData(); 
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating a new row:", error);
    }
  };

  const handleEditRow = async (row) => {
    try {
      setSelectedRow(row);
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/servers/${row.uniqueId}`
      );
      if (response && response.data && response.data.data) {
        const updatedData = response.data.data;
        setEditModalValues(updatedData);
        setEditModalOpen(true);
      } else {
        console.error("No data returned after editing");
      }
    } catch (error) {
      console.error("Error editing row:", error);
    }
  };

  const handleOpenLoginDetail = (row) => {
    setLoginDetailsDialogOpen(true);
    setSelectedRow(row);
  };

  const handleLogin = (values) => {
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/servers/diva/login?uniqueId=${selectedRow.uniqueId}`;
    Axios.post(apiUrl, values)
      .then((response) => {
        if (response.data.data.status) {
          localStorage.setItem('serverDetails', JSON.stringify(response.data.data));

          setSnackbar({
            open: true,
            message: "Connection successful!",
            severity: "success",
          });
          setLoginDetailsDialogOpen(false);
          navigate(`/companies`);
        } else {
          setSnackbar({
            open: true,
            message: response.data.message,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setSnackbar({
          open: true,
          message: 'Connection failed',
          severity: "error",
        });
      });
  };

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ID: ${row.id}`)) {
      return;
    }

    try {
      await Axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/servers/${row.uniqueId}`
      );
      fetchData(); // Refresh the table data
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { accessorKey: "protocols", header: "Protocol" },
    { accessorKey: "portNumber", header: "Port" },
    { accessorKey: "IPaddress", header: "IP Address" },
    { accessorKey: "pathName", header: "Provider" },
  ];

  return (
    <>
      <Navbar />
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            sx={{
              ml: "auto",
              display: "flex",
              justifyContent: "flex-end",
              background: "#6FC276",
              color: "white",
            }}
          >
            + Add Server
          </Button>
          <Box sx={{ p: 3 }}>
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
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.uniqueId}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.accessorKey}
                            style={{ textAlign: "center" }}
                          >
                            {row[column.accessorKey]}
                          </TableCell>
                        ))}
                        <TableCell style={{ textAlign: "center" }}>
                          <IconButton
                            onClick={() => handleOpenLoginDetail(row)}
                          >
                            <FaPlus />
                          </IconButton>
                          <IconButton onClick={() => handleEditRow(row)}>
                            <FaPencilAlt />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteRow(row)}>
                            <FaTrash />
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
            onSubmit={fetchData}
            values={editModalValues}
          />
          <LoginDetailsDialog
            open={loginDetailsDialogOpen}
            onClose={() => setLoginDetailsDialogOpen(false)}
            onSubmit={handleLogin}
            selectedRow={selectedRow}
          />
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};


export const CreateNewServerModal = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState({
    protocols: "",
    portNumber: "",
    IPaddress: "",
    pathName: "",
    status: "",
  });

  const handleSubmit = () => {
    onSubmit(values);
    GetData();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Create New Server</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>Protocol</InputLabel>
            <Input
              value={values.protocols}
              onChange={(e) =>
                setValues({ ...values, protocols: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>IP Address</InputLabel>
            <Input
              value={values.IPaddress}
              onChange={(e) =>
                setValues({ ...values, IPaddress: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Port</InputLabel>
            <Input
              value={values.portNumber}
              onChange={(e) =>
                setValues({ ...values, portNumber: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Provider</InputLabel>
            <Input
              value={values.pathName}
              onChange={(e) =>
                setValues({ ...values, pathName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Status (T & F)</InputLabel>
            <Input
              value={values.status}
              onChange={(e) => setValues({ ...values, status: e.target.value })}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#6FC276" }}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          variant="contained"
          sx={{ background: "#6FC276", color: "white" }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Define EditServerModal
export const EditServerModal = ({ open, onClose, onSubmit, values }) => {
  const [editedValues, setEditedValues] = useState(values);

  useEffect(() => {
    // Update editedValues when values change (initially and on subsequent edits)
    setEditedValues(values);
  }, [values]);

  const handleEditSubmit = async () => {
    // Implement your validation logic here if needed
    const res = await Axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/servers/${values.uniqueId}`,
      editedValues
    );
    onSubmit(res.data.data);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Server</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>Protocol</InputLabel>
            <Input
              value={editedValues.protocols}
              onChange={(e) =>
                setEditedValues({ ...editedValues, protocols: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>IP Address</InputLabel>
            <Input
              value={editedValues.IPaddress}
              onChange={(e) =>
                setEditedValues({ ...editedValues, IPaddress: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Port</InputLabel>
            <Input
              value={editedValues.portNumber}
              onChange={(e) =>
                setEditedValues({ ...editedValues, portNumber: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Provider</InputLabel>
            <Input
              value={editedValues.pathName}
              onChange={(e) =>
                setEditedValues({ ...editedValues, pathName: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#6FC276" }}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleEditSubmit();
            onClose();
          }}
          variant="contained"
          sx={{ background: "#6FC276", color: "white" }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

//LoginDetailsDialog
export const LoginDetailsDialog = ({
  open,
  onClose,
  onSubmit,
  selectedRow,
}) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    onSubmit(values);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>DIVA Login</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel>E-Mail</InputLabel>
            <Input
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Password</InputLabel>
            <Input
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
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
        <Button onClick={onClose} sx={{ color: "#6FC276" }}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleLogin}
          sx={{ background: "#6FC276", color: "white" }}
        >
          Login
        </Button>
      </DialogActions>
      
    </Dialog>

  );
};

export default Server;
