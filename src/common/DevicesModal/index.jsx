import React, { useState, useEffect } from 'react';
import {
    Box,
    Modal,
    Button,
    Typography,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import { FaPencilAlt, FaPhone, FaTrash, FaTimes } from 'react-icons/fa';
import apiContract from '../../pages/device/services/device.service';
import { CreateNewDeviceModal, EditDeviceModal } from '../../pages/device';

const DevicesModal = () => {
    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalValues, setEditModalValues] = useState({});
    const [selectedShop, setSelectedShop] = useState('');
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const serverId = JSON.parse(localStorage.getItem('serverDetails')).uniqueId;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiContract.getDevices(serverId, selectedShop);
                setTableData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
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
            const response = await apiContract.getDevices(serverId, selectedShop);
            setTableData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCreateNewRow = async (values) => {
        try {
            const response = await apiContract.createDevice(serverId, selectedShop, values);
            if (response.status === 200) {
                getAllDevices();
                setCreateModalOpen(false);
            } else {
                console.error('Error creating a new device:', response.message);
            }
        } catch (error) {
            console.error('Error creating a new row:', error);
        }
    };

    const handleEditRow = async (row) => {
        try {
            const response = await apiContract.getDeviceById(serverId, row.id);
            if (response && response.data && response.data.data) {
                const updatedData = response.data.data.data;
                setEditModalValues(updatedData);
                setEditModalOpen(true);
            } else {
                console.error('No data returned after editing');
            }
        } catch (error) {
            console.error('Error editing row:', error);
        }
    };

    const handleDeleteRow = async (row) => {
        if (!window.confirm(`Are you sure you want to delete ID: ${row.id}`)) {
            return;
        }

        try {
            await apiContract.deleteDevice(serverId, row.id);
            getAllDevices();
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const columns = [
        { accessorKey: 'deviceName', header: 'Device Name' },
        { accessorKey: 'deviceId', header: 'Device ID' },
        { accessorKey: 'brandName', header: 'Brand Name' },
        { accessorKey: 'apkVersion', header: 'APK Version' },
        { accessorKey: 'modelName', header: 'Model Name' },
    ];

    return (
        <div>
            <Button
                color="primary"
                variant="contained"
                sx={{
                    background: '#6FC276',
                    color: 'white',
                    ml: 2,
                }}
                onClick={handleOpen}
            >
                Devices
                <FaPhone />
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: 1000,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        position: 'relative',
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: 'text.primary',
                        }}
                        onClick={handleClose}
                    >
                        <FaTimes />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                        Devices
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
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
                                background: '#6FC276',
                                color: 'white',
                                ml: 2,
                            }}
                            onClick={() => setCreateModalOpen(true)}
                        >
                            + Add Device
                        </Button>
                    </Box>

                    <Box sx={{ p: 3, position: 'relative' }}>
                        {!selectedShop && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '80%',
                                    left: '45%',
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                        )}
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
                                                    fontSize: '20px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {column.header}
                                            </TableCell>
                                        ))}
                                        <TableCell
                                            style={{
                                                background: '#6FC276',
                                                color: 'white',
                                                fontSize: '20px',
                                                textAlign: 'center',
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
                                                                style={{ textAlign: 'center' }}
                                                            >
                                                                {row[column.accessorKey]}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell style={{ textAlign: 'center' }}>
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
            </Modal>
        </div>
    );
};
export default DevicesModal;
