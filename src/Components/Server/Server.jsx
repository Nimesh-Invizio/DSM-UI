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
} from "@mui/material";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Sidenav from "../Sidenav";
import GetData from "../../Utils/utility";
import { useNavigate } from "react-router-dom";

const Server = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverId, setServerId] = useState("uni");
  const [loginDetailsDialogOpen, setLoginDetailsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:3000/api/v1/servers/"
        );
        setTableData(response.data.data);
        // let serverIds = response.data.data.map(element => element.uniqueId);
        // setServerId(serverIds);
        console.log(response.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateNewRow = async (values) => {
    try {
      const response = await Axios.post(
        "http://localhost:3000/api/v1/servers/",
        values
      );
      setTableData([...tableData, response.data]);
      console.log(response.data);
      setServerId(response.data.uniqueId);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating a new row:", error);
    }
  };

  const getAllServer = async () => {
    console.log("SELECTED :", selectedRow);
    try {
      const response = await Axios.get("http://localhost:3000/api/v1/servers/");
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditRow = async (row) => {
    try {
      setSelectedRow(row);
      // Get updated data from the server
      const response = await Axios.get(
        `http://localhost:3000/api/v1/servers/${row.uniqueId}`
      );
      console.log(response);

      // Update state with the updated data
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
    console.log("uid", row.uniqueId);
    setLoginDetailsDialogOpen(true); // Open the dialog
    setSelectedRow(row);
    // setServerId(row.uniqueId); // Set the selected row
  };

  const handleLogin = (values) => {
    console.log(values);
    const apiUrl = `http://127.0.0.1:3000/api/v1/servers/diva/login?uniqueId=${selectedRow.uniqueId}`;
    console.log(apiUrl);
    Axios.post(apiUrl, values)
      .then((response) => {
        console.log("Login successful:", response.data.data);
        console.log("Token : ", response.data.data.token);
        navigate(`/server/company/${selectedRow.uniqueId}`);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle login failure here if needed
      });
  };

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ID: ${row.id}`)) {
      return;
    }

    try {
      await Axios.delete(
        `http://localhost:3000/api/v1/servers/${row.uniqueId}`
      );
      const updatedTableData = [...tableData];
      updatedTableData.splice(row.index, 1);
      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
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
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            sx={{ ml: "auto", display: "flex", justifyContent: "flex-end" }}
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
                          background: "#1976d2",
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
                        background: "#1976d2",
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
                    .map((row, rowIndex) => (
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
                          <IconButton
                            onClick={() => handleOpenLoginDetail(row)}
                          >
                            <FaPlus />
                          </IconButton>

                          <IconButton onClick={() => handleEditRow(row)}>
                            <FaPencilAlt></FaPencilAlt>
                          </IconButton>
                          <IconButton onClick={() => handleDeleteRow(row)}>
                            <FaTrash></FaTrash>
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
            onSubmit={getAllServer}
            values={editModalValues}
          />
          <LoginDetailsDialog
            open={loginDetailsDialogOpen}
            onClose={() => setLoginDetailsDialogOpen(false)}
            onSubmit={handleLogin}
            selectedRow={selectedRow}
          />
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
    // Implement your validation logic here if needed
    onSubmit(values);
    GetData();
    onClose();
    window.location.reload();
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
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
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
      `http://localhost:3000/api/v1/servers/${values.uniqueId}`,
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          onClick={() => {
            handleEditSubmit();
            onClose();
          }}
          variant="contained"
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
    onClose();
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
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Server;
