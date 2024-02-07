import Sidenav from "../Sidenav";
import Navbar from "../Navbar";
import React, { useCallback, useMemo, useState, useEffect } from "react";
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
} from "@mui/material";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";

function Shop() {
  const [tableData, setTableData] = useState([]);
  const { uniqueId, id } = useParams();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  //Pagination Start

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        const response = await Axios.get(
          `http://127.0.0.1:3000/api/v1/servers/shop/${uniqueId}/${id}`
        );
        setTableData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateNewRow = async (values) => {
    try {
      const response = await Axios.post(
        `http://127.0.0.1:3000/api/v1/servers/shop/${uniqueId}`,
        values
      );
      setTableData([...tableData, response.data]);
      console.log(response.data);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating a new row:", error);
    }
  };

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ID: ${row.id}`)) {
      return;
    }

    try {
      await Axios.delete(
        `http://127.0.0.1:3000/api/v1/servers/deleteshop/${uniqueId}/${row.id}`
      );
      const updatedTableData = [...tableData];
      updatedTableData.splice(row.index, 1);
      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const columns = useMemo(
    () => [
      // Define your columns as per your data structure
      { accessorKey: "id", header: "ID", enableEditing: false },
      { accessorKey: "shopName", header: "Shop-Name" },
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
            sx={{ ml: "auto", display: "flex", justifyContent: "flex-end" }}
            onClick={() => setCreateModalOpen(true)}
          >
            + Add Shop
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
                          <IconButton onClick={() => handleDeleteRow(row)}>
                            <FaTrash></FaTrash>
                          </IconButton>
                          <IconButton>
                            <FaPencilAlt></FaPencilAlt>
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

          <CreateNewShopModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
        </Box>
      </Box>
    </>
  );
}

export const CreateNewShopModal = ({ open, onClose, onSubmit }) => {
  const { id } = useParams();
  const [values, setValues] = useState({
    shopName: "",
    companyId: id,
    licenseRegAt: "",
    licenseKey: "",
    licenseExpiresAt: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    pinCode: "",
    country: "",
    taxType: "",
    taxNumber: "",
    isPrimary: 0,
    email: "",
    phone: "",
    password: "",
    features: "",
    quotationAllStatus: "",
    allowedDevices: "",
  });

  const handleSubmit = () => {
    // Implement your validation logic here if needed
    onSubmit(values);
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Create New Shop</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>CompanyId</InputLabel>
            <Input
              value={values.companyId}
              onChange={(e) =>
                setValues({ ...values, companyId: e.target.value })
              }
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Shop-Name</InputLabel>
            <Input
              value={values.shopName}
              onChange={(e) =>
                setValues({ ...values, shopName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>License Create at</InputLabel>
            <Input
              type="date"
              value={values.licenseRegAt}
              onChange={(e) =>
                setValues({ ...values, licenseRegAt: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>License-Key</InputLabel>
            <Input
              value={values.licenseKey}
              onChange={(e) =>
                setValues({ ...values, licenseKey: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>License Expires at</InputLabel>
            <Input
              type="date"
              value={values.licenseExpiresAt}
              onChange={(e) =>
                setValues({ ...values, licenseExpiresAt: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Address-Line-1</InputLabel>
            <Input
              value={values.addressLine1}
              onChange={(e) =>
                setValues({ ...values, addressLine1: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Address-Line-2</InputLabel>
            <Input
              value={values.addressLine2}
              onChange={(e) =>
                setValues({ ...values, addressLine2: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>State</InputLabel>
            <Input
              value={values.state}
              onChange={(e) => setValues({ ...values, state: e.target.value })}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>City</InputLabel>
            <Input
              value={values.city}
              onChange={(e) => setValues({ ...values, city: e.target.value })}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Country</InputLabel>
            <Input
              value={values.country}
              onChange={(e) =>
                setValues({ ...values, country: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Pincode</InputLabel>
            <Input
              value={values.pinCode}
              onChange={(e) =>
                setValues({ ...values, pinCode: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Primary</InputLabel>
            <Input
              value={values.isPrimary}
              onChange={(e) => setValues({ ...values, isPrimary: 0 })}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Tax-Type</InputLabel>
            <Input
              value={values.taxType}
              onChange={(e) =>
                setValues({ ...values, taxType: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Tax-Number</InputLabel>
            <Input
              value={values.taxNumber}
              onChange={(e) =>
                setValues({ ...values, taxNumber: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Email</InputLabel>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Password</InputLabel>
            <Input
              type="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Contact</InputLabel>
            <Input
              value={values.phone}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>QuotationAllStatus</InputLabel>
            <Input
              defaultValue=""
              value={values.quotationAllStatus}
              onChange={(e) =>
                setValues({ ...values, quotationAllStatus: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Allowed-Devices</InputLabel>
            <Input
              type="number"
              value={values.allowedDevices}
              onChange={(e) =>
                setValues({ ...values, allowedDevices: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Features</InputLabel>
            <TextField
              value={values.features}
              onChange={(e) =>
                setValues({ ...values, features: e.target.value })
              }
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

export default Shop;
