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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});

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
          `http://127.0.0.1:8183/api/v1/servers/shop/${uniqueId}/${id}`
        );
        setTableData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getAllShop = async () => {
    try {
      const response = await Axios.get(
        `http://127.0.0.1:8183/api/v1/servers/shop/${uniqueId}/${id}`
      );
      setTableData(response.data.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateNewRow = async (values) => {
    try {
      const response = await Axios.post(
        `http://127.0.0.1:8183/api/v1/servers/shop/${uniqueId}`,
        values
      );
      setTableData([...tableData, response.data]);
      console.log(response.data);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating a new row:", error);
    }
  };

  const handleEditRow = async (row) => {
    try {
      const response = await Axios.get(
        `http://127.0.0.1:8183/api/v1/servers/singleshop/${uniqueId}/${row.id}`,
        row
      );

      console.log("RES : ", response);
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.data
      ) {
        const updatedData = response.data.data.data;
        console.log("updatedData", updatedData);
        setEditModalValues(updatedData);
        setEditModalOpen(true);
      } else {
        console.error("No data returned after editing");
      }
    } catch (error) {
      console.error("Error editing row:", error);
    }
  };

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ID: ${row.id}`)) {
      return;
    }

    try {
      await Axios.delete(
        `http://127.0.0.1:8183/api/v1/servers/deleteshop/${uniqueId}/${row.id}`
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
            sx={{
              ml: "auto",
              display: "flex",
              justifyContent: "flex-end",
              background: "#6FC276",
              color: "white",
            }}
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
                  {console.log(typeof tableData)}
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
                          <IconButton onClick={() => handleEditRow(row)}>
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

          <EditShopModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={getAllShop}
            values={editModalValues}
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

export const EditShopModal = ({ open, onClose, onSubmit, values }) => {
  const [editedValues, setEditedValues] = useState(values);
  const { uniqueId } = useParams();
  // console.log("values :", values.id);
  console.log("Model :", uniqueId);
  useEffect(() => {
    // Update editedValues when values change (initially and on subsequent edits)
    setEditedValues(values);
  }, [values]);

  const handleEditSubmit = async () => {
    // Implement your validation logic here if needed
    const res = await Axios.patch(
      `http://127.0.0.1:8183/api/v1/servers/shop/${uniqueId}/${values.id}`,
      editedValues
    );
    onSubmit(res);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Shop</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>Company-Name</InputLabel>
            <Input
              value={editedValues.shopName}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  shopName: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>License Create At</InputLabel>
            <Input
              type="date"
              value={editedValues.licenseRegAt}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  licenseRegAt: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>License Expires At</InputLabel>
            <Input
              type="date"
              value={editedValues.licenseExpiresAt}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  licenseExpiresAt: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>License Key</InputLabel>
            <Input
              value={editedValues.licenseKey}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  licenseKey: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Address-Line-1</InputLabel>
            <Input
              value={
                editedValues &&
                editedValues.address &&
                editedValues.address.addressLine1
                  ? editedValues.address.addressLine1
                  : ""
              }
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  addressLine1: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Address-Line-2</InputLabel>
            <Input
              value={
                editedValues &&
                editedValues.address &&
                editedValues.address.addressLine2
                  ? editedValues.address.addressLine2
                  : ""
              }
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  addressLine2: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>State</InputLabel>
            <Input
              value={
                editedValues &&
                editedValues.address &&
                editedValues.address.state
                  ? editedValues.address.state
                  : ""
              }
              onChange={(e) =>
                setEditedValues({ ...editedValues, state: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>City</InputLabel>
            <Input
              value={
                editedValues &&
                editedValues.address &&
                editedValues.address.city
                  ? editedValues.address.city
                  : ""
              }
              onChange={(e) =>
                setEditedValues({ ...editedValues, city: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Country</InputLabel>
            <Input
              value={
                editedValues &&
                editedValues.address &&
                editedValues.address.country
                  ? editedValues.address.country
                  : ""
              }
              onChange={(e) =>
                setEditedValues({ ...editedValues, country: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Pincode</InputLabel>
            <Input
              value={
                editedValues &&
                editedValues.address &&
                editedValues.address.pinCode
                  ? editedValues.address.pinCode
                  : ""
              }
              onChange={(e) =>
                setEditedValues({ ...editedValues, pinCode: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Email</InputLabel>
            <Input
              value={editedValues.email}
              onChange={(e) =>
                setEditedValues({ ...editedValues, email: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Contact</InputLabel>
            <Input
              value={editedValues.phone}
              onChange={(e) =>
                setEditedValues({ ...editedValues, phone: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>QuatationAllStatus</InputLabel>
            <Input
              value={editedValues.quotationAllStatus}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  quotationAllStatus: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Allowed Devices</InputLabel>
            <Input
              type="number"
              value={editedValues.allowedDevices}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  allowedDevices: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel>Features</InputLabel>
            <TextField
              value={editedValues.features}
              onChange={(e) =>
                setEditedValues({ ...editedValues, features: e.target.value })
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

export default Shop;
