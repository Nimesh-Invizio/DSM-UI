import Sidenav from "../Sidenav";
import Navbar from "../Navbar";
import React, { useMemo, useState, useEffect } from "react";
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
} from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";

function Company() {
  const [tableData, setTableData] = useState([]);
  const { uniqueId } = useParams();
  const navigate = useNavigate();

  //Create Company
  const [createModalOpen, setCreateModalOpen] = useState(false);

  //Edit Company
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
          `http://127.0.0.1:3000/api/v1/servers/companies/${uniqueId}`
        );
        setTableData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Create Company Functions
  const handleCreateNewRow = async (values) => {
    try {
      const response = await Axios.post(
        `http://127.0.0.1:3000/api/v1/servers/company/${uniqueId}`,
        values
      );
      setTableData([...tableData, response.data]);
      console.log(response.data);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating a new row:", error);
    }
  };

  //Edit Company Functions
  const handleEditRow = async (row) => {
    console.log(uniqueId);
    console.log(row.id);
    try {
      console.log("TRY", uniqueId);
      const response = await Axios.patch(
        `http://127.0.0.1:3000/api/v1/servers/company/${uniqueId}/${row.id}`,
        row
      );
      console.log("RES", response);
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.data
      ) {
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

  const columns = useMemo(
    () => [
      // Define your columns as per your data structure
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
            sx={{ ml: "auto", display: "flex", justifyContent: "flex-end" }}
            onClick={() => setCreateModalOpen(true)}
          >
            + Add Company
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
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              navigate(
                                `/server/company/shop/${uniqueId}/${row.id}`
                              )
                            }
                          >
                            View Shop
                          </Button>
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
          <CreateNewCompanyModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />

          <EditCompanyModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEditRow}
            values={editModalValues}
          />
        </Box>
      </Box>
    </>
  );
}

export const CreateNewCompanyModal = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState({
    companyName: "",
    email: "",
    phone: "",
    maxLicense: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    pinCode: "",
    country: "",
    taxType: "",
    taxNumber: "",
    isPrimary: 0,
  });

  const handleSubmit = () => {
    // Implement your validation logic here if needed
    onSubmit(values);
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Create New Company</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <InputLabel>Company-Name</InputLabel>
            <Input
              value={values.companyName}
              onChange={(e) =>
                setValues({ ...values, companyName: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>E-Mail</InputLabel>
            <Input
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
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
            <InputLabel>Maximum License</InputLabel>
            <Input
              value={values.maxLicense}
              onChange={(e) =>
                setValues({ ...values, maxLicense: e.target.value })
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

// Edit Modal
export const EditCompanyModal = ({ open, onClose, onSubmit, values }) => {
  const [editedValues, setEditedValues] = useState(values);

  useEffect(() => {
    // Update editedValues when values change (initially and on subsequent edits)
    setEditedValues(values);
  }, [values]);

  const handleEditSubmit = async () => {
    // Implement your validation logic here if needed
    onSubmit(editedValues);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Server</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>Company-Name</InputLabel>
            <Input
              value={editedValues.companyName}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  companyName: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>E-Mail</InputLabel>
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
            <InputLabel>Address-Line-1</InputLabel>
            <Input
              value={editedValues.addressLine1}
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
              value={editedValues.addressLine2}
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
              value={editedValues.state}
              onChange={(e) =>
                setEditedValues({ ...editedValues, state: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>City</InputLabel>
            <Input
              value={editedValues.city}
              onChange={(e) =>
                setEditedValues({ ...editedValues, city: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Country</InputLabel>
            <Input
              value={editedValues.country}
              onChange={(e) =>
                setEditedValues({ ...editedValues, country: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Pincode</InputLabel>
            <Input
              value={editedValues.pinCode}
              onChange={(e) =>
                setEditedValues({ ...editedValues, pinCode: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Tax-Type</InputLabel>
            <Input
              value={editedValues.taxType}
              onChange={(e) =>
                setEditedValues({ ...editedValues, taxType: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Tax-Number</InputLabel>
            <Input
              value={editedValues.taxNumber}
              onChange={(e) =>
                setEditedValues({ ...editedValues, taxNumber: e.target.value })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Maximum License</InputLabel>
            <Input
              value={editedValues.maxLicense}
              onChange={(e) =>
                setEditedValues({ ...editedValues, maxLicense: e.target.value })
              }
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
  );
};

export default Company;
