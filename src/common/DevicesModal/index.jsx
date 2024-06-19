import React, { useState, useEffect } from 'react';
import {
    Box,
    Modal,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TablePagination,
    CircularProgress,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { FaPencilAlt, FaTrash, FaTimes, FaBuilding } from 'react-icons/fa';
import apiContract from '../../pages/device/services/device.service';

const DevicesModal = ({ open, onClose, shop }) => {
    const [tableData, setTableData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalValues, setEditModalValues] = useState({});
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (shop) {
            setIsLoading(true);
        } else {
            setTableData([]);
            setIsLoading(false);
        }
    }, [shop]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const devices = await apiContract.getDevices(serverId, shop.id);
                setTableData(devices);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (shop) {
            fetchData();
        }
    }, [shop, serverId]);

    const handleEditRow = async (row) => {
        try {
            const response = await apiContract.getDeviceById(serverId, shop.id, row.id);
            if (response && response.length === 1) {
                const updatedData = response[0];
                setEditModalValues(updatedData);
                setEditModalOpen(true);
            } else {
                console.error('No data returned after editing');
            }
        } catch (error) {
            console.error('Error editing row:', error);
        }
    };

    const handleDeleteRow = (row) => {
        setDeviceToDelete(row);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deviceToDelete) {
            try {
                await apiContract.deleteDevice(serverId, shop.id, deviceToDelete.id);
                const updatedTableData = tableData.filter((device) => device.id !== deviceToDelete.id);
                setTableData(updatedTableData);
                setDeleteConfirmOpen(false);
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        }
    };

    const columns = [
        { accessorKey: 'deviceName', header: 'Device Name' },
        { accessorKey: 'deviceId', header: 'Device ID' },
        { accessorKey: 'brandName', header: 'Brand Name' },
        { accessorKey: 'apkVersion', header: 'APK Version' },
        { accessorKey: 'modelName', header: 'Model Name' },
    ];

    const handleEditModalSubmit = async () => {
        try {
            // Update the device with the new values
            let editedValues = {
                brandName:editModalValues.brandName,
                modelName:editModalValues.modelName,
                deviceId:editModalValues.deviceId,
                deviceName : editModalValues.deviceName,
                apkVersion: editModalValues?.apkVersion || '',
                shopId : editModalValues.shopId.id
            }
            console.log(serverId, shop.id, editModalValues.deviceId, editedValues,"Yyyyyyyyyy");
            await apiContract.updateDevice(serverId, shop.id, editModalValues.deviceId, editedValues);
            setEditModalOpen(false);

            // Fetch the updated data
            const updatedDevices = await apiContract.getDevices(serverId, shop.id);
            setTableData(updatedDevices);
        } catch (error) {
            console.error('Error updating device:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 1200,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 1,
                            ml: 1,
                            borderRadius: 2,
                            boxShadow: 3,
                            bgcolor: '#6FC276',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <FaBuilding size={28} color="#ffffff" />
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ fontWeight: 'bold', color: '#ffffff', ml: 1 }}
                        >
                            {shop ? shop.shopName : ''}
                        </Typography>
                    </Paper>

                    <IconButton
                        onClick={onClose}
                        sx={{ color: 'text.secondary', ml: 'auto' }}
                    >
                        <FaTimes />
                    </IconButton>
                </Box>

                <Box sx={{ p: 1, position: 'relative' }}>
                    {!shop ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '300px',
                            }}
                        >
                            <Typography variant="h6">Please select a shop</Typography>
                        </Box>
                    ) : !isLoading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '300px',
                            }}
                        >
                            <CircularProgress
                                sx={{
                                    color: '#6FC276',
                                }}
                                size={60}
                                thickness={4}
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Box}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.accessorKey}
                                                style={{
                                                    background: '#6FC276',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                    padding: '8px 12px',
                                                }}
                                            >
                                                {column.header}
                                            </TableCell>
                                        ))}
                                        <TableCell
                                            style={{
                                                background: '#6FC276',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                padding: '8px 12px',
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
                                            .map((row, rowIndex) => (
                                                <TableRow
                                                    key={rowIndex}
                                                    hover
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                    }}
                                                >
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.accessorKey}
                                                            style={{
                                                                textAlign: 'center',
                                                                fontSize: '14px',
                                                                padding: '8px 12px',
                                                            }}
                                                        >
                                                            {row[column.accessorKey]}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize: '14px',
                                                            padding: '8px 12px',
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={() => handleDeleteRow(row)}
                                                            sx={{
                                                                color: '#e53935',
                                                                '&:hover': {
                                                                    backgroundColor: '#fbe9e7',
                                                                },
                                                                mr: 1,
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleEditRow(row)}
                                                            sx={{
                                                                color: '#4caf50',
                                                                '&:hover': {
                                                                    backgroundColor: '#e8f5e9',
                                                                },
                                                                mr: 1,
                                                            }}
                                                        >
                                                            <FaPencilAlt />
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
                                    )}
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
                                sx={{
                                    '.MuiTablePagination-toolbar': {
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '4px',
                                        padding: '8px 16px',
                                    },
                                    '.MuiTablePagination-selectRoot': {
                                        marginRight: '8px',
                                    },
                                    '.MuiTablePagination-select': {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    },
                                    '.MuiTablePagination-displayedRows': {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </TableContainer>
                    )}
                </Box>
                <Modal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    aria-labelledby="edit-modal-title"
                    aria-describedby="edit-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            maxWidth: 600,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Typography id="edit-modal-title" variant="h6" component="h2">
                                Edit Device: {editModalValues.deviceName || ''}
                            </Typography>
                            <IconButton
                                onClick={() => setEditModalOpen(false)}
                                sx={{ color: 'text.secondary' }}
                            >
                                <FaTimes />
                            </IconButton>
                        </Box>
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                value={editModalValues[column.accessorKey] || ''}
                                onChange={(e) =>
                                    setEditModalValues({
                                        ...editModalValues,
                                        [column.accessorKey]: e.target.value,
                                    })
                                }
                                disabled = {column.accessorKey === 'deviceId' ?  true : false }
                                fullWidth
                                margin="normal"
                            />
                        ))}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2,
                            }}
                        >
                            <Button
                                onClick={() => setEditModalOpen(false)}
                                sx={{
                                    mr: 2,
                                    color: '#6FC276',
                                    borderColor: '#6FC276',
                                    border: 1,
                                    backgroundColor: '#ffffff',
                                    '&:hover': {
                                        color: '#ffffff',
                                        backgroundColor: '#6FC276',
                                        transition: 0.8,
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEditModalSubmit}
                                color="primary"
                                sx={{
                                    mr: 2,
                                    color: '#6FC276',
                                    borderColor: '#6FC276',
                                    border: 1,
                                    backgroundColor: '#ffffff',
                                    '&:hover': {
                                        color: '#ffffff',
                                        backgroundColor: '#6FC276',
                                        transition: 0.8,
                                    },
                                }}                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6">Confirm Delete</Typography>
                            <IconButton
                                onClick={() => setDeleteConfirmOpen(false)}
                                sx={{ color: 'text.secondary' }}
                            >
                                <FaTimes />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this device?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)} sx={{
                            color: "#6FC276",
                            borderColor: "#6FC276",
                            border: 1,
                            backgroundColor: "#fffff",
                            '&:hover': {
                                color: "#ffffff",
                                backgroundColor: "#6FC276",
                                transition: 0.8
                            }

                        }} >
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} sx={{
                            color: "#6FC276",
                            borderColor: "#6FC276",
                            border: 1,
                            backgroundColor: "#fffff",
                            '&:hover': {
                                color: "#ffffff",
                                backgroundColor: "#6FC276",
                                transition: 0.8
                            }

                        }} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};
export default DevicesModal;
