import Sidenav from "../../common/SideNav";
import Navbar from "../../common/Navbar";
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
  MenuItem,
  Select,
  CircularProgress
} from "@mui/material";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import apiContract from './services/device.service';
import LoadingSpinner from "../../common/LoadingSpinner";
import { generateRandomDeviceId } from "./util";

function Devices() {
  const [tableData, setTableData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalValues, setEditModalValues] = useState({});
  const [selectedShop, setSelectedShop] = useState("");
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;

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
        const response = await Axios.get(`http://localhost:8070/api/v1/servers/${serverId}/shops/${selectedShop}/devices`);
        setTableData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedShop]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const response = await apiContract.getAllShops(serverId);
        if (response.status === 200) {
          setShops(response.data);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleShopChange = (event) => {
    setSelectedShop(event.target.value);
  };

  const getAllDevices = async () => {
    try {
      const response = await Axios.get(`http://localhost:8070/api/v1/servers/${serverId}/shops/${selectedShop}/devices`);
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllDevicesApiCall = async () => {
    try {
      const response = await Axios.get(`http://localhost:8070/api/v1/servers/${serverId}/shops/${selectedShop}/devices`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateNewRow = async (values) => {
    try {
      values = { ...values, deviceId: generateRandomDeviceId(), shopId: selectedShop };
      const response = await apiContract.createDevice(serverId, selectedShop, values);
      const devices = await getAllDevicesApiCall();
  
      if (response.status === 200) {
        setTableData((prevTableData) => [...devices]);
        setCreateModalOpen(false);
      } else {
        console.error("Error creating a new device:", response.message);
      }
    } catch (error) {
      console.error("Error creating a new row:", error);
    }
  };
  
  const handleEditRow = async (row) => {
    try {
      const response = await Axios.get(
        `http://localhost:8070/api/v1/devices/single/${serverId}/${row.id}`
      );

      console.log("RES : ", response);
      if (response && response.data && response.data.data) {
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
        `http://localhost:8070/api/v1/devices/delete/${serverId}/${row.id}`
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
      { accessorKey: "deviceName", header: "Device Name" },
      { accessorKey: "deviceId", header: "Device ID" },
      { accessorKey: "brandName", header: "Brand Name" },
      { accessorKey: "apkVersion", header: "APK Version" },
      { accessorKey: "modelName", header: "Model Name" },
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Select
          value={selectedShop}
          onChange={handleShopChange}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Select Shop</MenuItem>
          {shops.map((shop) => (
            <MenuItem key={shop.id} value={shop.id}>
              {shop.shopName}
            </MenuItem>
          ))}
        </Select>
        <Button
          color="primary"
          variant="contained"
          sx={{
            background: "#6FC276",
            color: "white",
            ml: 2,
          }}
          onClick={() => setCreateModalOpen(true)}
        >
          + Add Device
        </Button>
      </Box>

      <Box sx={{ p: 3, position: "relative" }}>
        {!selectedShop && (
          <Box
            sx={{
              position: "absolute",
              top: "80%",
              left: "45%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{
      color: "#6FC276"
    }} size={60} thickness={4} />
          </Box>
        )}
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
              {selectedShop ? (
                tableData.length > 0 ? (
                  tableData
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
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )
              ) : null}
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

      <CreateNewDeviceModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      <EditDeviceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={getAllDevices}
        values={editModalValues}
      />
    </Box>
  </Box>
</>
 );
}

export const CreateNewDeviceModal = ({ open, onClose, onSubmit }) => {
  const { id } = useParams();
  const [values, setValues] = useState({
    deviceName: "",
    brandName: "",
    apkVersion: "",
    modelName: "",
    shopId: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const trimmedValues = {
      deviceName: values.deviceName.trim(),
      brandName: values.brandName.trim(),
      apkVersion: values.apkVersion.trim(),
      modelName: values.modelName.trim(),
      shopId: values.shopId.trim(),
    };
  
    const validationErrors = validateFields(trimmedValues);
  
    console.log("Trimmed Values:", trimmedValues);
    console.log("Validation Errors:", validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      console.log("No validation errors, submitting form...");
      onSubmit(trimmedValues);
      onClose();
    } else {
      console.log("Validation errors found, not submitting form.");
      setErrors(validationErrors);
    }
  };

  const validateFields = (values) => {
    const errors = {};

    if (!values.deviceName) {
      errors.deviceName = "Device Name is required";
    }

    if (!values.brandName) {
      errors.brandName = "Brand Name is required";
    }

    if (!values.apkVersion) {
      errors.apkVersion = "APK Version is required";
    }

    if (!values.modelName) {
      errors.modelName = "Model Name is required";
    }

   

    return errors;
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Create New Device</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InputLabel>Device Name</InputLabel>
            <Input
              value={values.deviceName}
              onChange={(e) =>
                setValues({ ...values, deviceName: e.target.value })
              }
              fullWidth
              error={!!errors.deviceName}
            />
            {errors.deviceName && (
              <div style={{ color: "red" }}>{errors.deviceName}</div>
            )}
          </Grid>

          <Grid item xs={4}>
            <InputLabel>Brand Name</InputLabel>
            <Input
              value={values.brandName}
              onChange={(e) =>
                setValues({ ...values, brandName: e.target.value })
              }
              fullWidth
              error={!!errors.brandName}
            />
            {errors.brandName && (
              <div style={{ color: "red" }}>{errors.brandName}</div>
            )}
          </Grid>
          <Grid item xs={4}>
            <InputLabel>APK Version</InputLabel>
            <Input
              value={values.apkVersion}
              onChange={(e) =>
                setValues({ ...values, apkVersion: e.target.value })
              }
              fullWidth
              error={!!errors.apkVersion}
            />
            {errors.apkVersion && (
              <div style={{ color: "red" }}>{errors.apkVersion}</div>
            )}
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Model Name</InputLabel>
            <Input
              value={values.modelName}
              onChange={(e) =>
                setValues({ ...values, modelName: e.target.value })
              }
              fullWidth
              error={!!errors.modelName}
            />
            {errors.modelName && (
              <div style={{ color: "red" }}>{errors.modelName}</div>
            )}
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

export const EditDeviceModal = ({ open, onClose, onSubmit, values }) => {
 const [editedValues, setEditedValues] = useState(values);
 const { uniqueId } = useParams();

 useEffect(() => {
   setEditedValues(values);
 }, [values]);

 const handleEditSubmit = async () => {
   const res = await Axios.patch(
     `http://localhost:8070/api/v1/devices/update/${uniqueId}/${values.id}`,
     editedValues
   );
   onSubmit(res);
   onClose();
 };

 return (
   <Dialog open={open}>
     <DialogTitle>Edit Device</DialogTitle>
     <DialogContent>
       <Grid container spacing={2}>
         <Grid item xs={4}>
           <InputLabel>Device Name</InputLabel>
           <Input
             value={editedValues.deviceName}
             onChange={(e) =>
               setEditedValues({
                 ...editedValues,
                 deviceName: e.target.value,
               })
             }
             fullWidth
           />
         </Grid>
         <Grid item xs={4}>
           <InputLabel>Device ID</InputLabel>
           <Input
             value={editedValues.deviceId}
             onChange={(e) =>
               setEditedValues({
                 ...editedValues,
                 deviceId: e.target.value,
               })
             }
             fullWidth
           />
         </Grid>
         <Grid item xs={4}>
           <InputLabel>Brand Name</InputLabel>
           <Input
             value={editedValues.brandName}
             onChange={(e) =>
               setEditedValues({
                 ...editedValues,
                 brandName: e.target.value,
               })
             }
             fullWidth
           />
         </Grid>
         <Grid item xs={4}>
           <InputLabel>APK Version</InputLabel>
           <Input
             value={editedValues.apkVersion}
             onChange={(e) =>
               setEditedValues({
                 ...editedValues,
                 apkVersion: e.target.value,
               })
             }
             fullWidth
           />
         </Grid>
         <Grid item xs={4}>
           <InputLabel>Model Name</InputLabel>
           <Input
             value={editedValues.modelName}
             onChange={(e) =>
               setEditedValues({
                 ...editedValues,
                 modelName: e.target.value,
               })
             }
             fullWidth
           />
         </Grid>
         <Grid item xs={4}>
           <InputLabel>Shop ID</InputLabel>
           <Input
             value={editedValues.shopId}
             onChange={(e) =>
               setEditedValues({
                 ...editedValues,
                 shopId: e.target.value,
               })
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

export default Devices;