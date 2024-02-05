import Sidenav from "../Sidenav";
import Navbar from "../Navbar";
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Axios from 'axios';
import { Box,
    Button,
    IconButton,
    TablePagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper} from '@mui/material'
import { FaPencilAlt, FaPlus, FaTrash} from 'react-icons/fa';

function Shop() {
    const [tableData, setTableData] = useState([]);
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
        const response = await Axios.get('http://127.0.0.1:3000/api/v1/servers/shop/1559ea44-e0f0-4318-a6ca-d8b17d32fe94/2');
        setTableData(response.data.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(() => [
    // Define your columns as per your data structure
    { accessorKey: 'id', header: 'ID', enableEditing: false },
    { accessorKey: 'shopName', header: 'Shop-Name' },
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
                        variant="contained"
                        sx={{ ml: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                        + Add Shop
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
                                    {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                        <TableRow key={row.id}>
                                            {columns.map((column) => (
                                                <TableCell key={column.accessorKey} style={{ textAlign: "center" }}>{row[column.accessorKey]}</TableCell>
                                            ))}
                                            <TableCell style={{ textAlign: "center" }}>
                                                <IconButton ><FaTrash></FaTrash></IconButton>
                                                <IconButton ><FaPencilAlt></FaPencilAlt></IconButton>
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
                </Box>
            </Box>
        </>
    );
}

export default Shop;
