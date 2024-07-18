import React, { useState, useEffect } from 'react';
import { Box, InputLabel, MenuItem, Paper, Select, Typography, FormControl, Switch, Button, Grid, Modal, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { DatePicker } from 'antd';
import moment from 'moment';
import apiContract from '../../services/shop.service';
import AnalyticsModal from '../../../../common/AnalyticsModal';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const QuotationCard = ({ shopData, shopDetails }) => {
    const [itemStatus, setItemStatus] = useState([]);
    const [hardDelete, setHardDelete] = useState(false);
    const [imageDelete, setImageDelete] = useState(false);
    const [date, setDate] = useState(moment());
    const [formErrors, setFormErrors] = useState({});
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const serverId = JSON.parse(localStorage.getItem('serverDetails'))?.uniqueId;

    const handleChangeItemStatus = (event) => {
        const value = event.target.value.toUpperCase();
        if (value === "ALL") {
            setItemStatus(["", "INSTOCK", "CATALOGUE"]);
        } else if (value === "APP") {
            setItemStatus([""]);
        } else {
            setItemStatus([value]);
        }
    };

    const handleHardDeleteChange = (event) => setHardDelete(event.target.checked);
    const handleImageDeleteChange = (event) => setImageDelete(event.target.checked);
    const handleDateChange = (date) => setDate(date);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const validateForm = () => {
        const errors = {};
        if (!itemStatus.length) errors.itemStatus = 'Please select an item status';
        if (!date.isValid()) errors.date = 'Please select a valid date';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDelete = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const quotationDeleteQueryData = {
                shopId: parseInt(shopDetails.id),
                actionType: "deleteQuotations",
                itemStatus,
                imageDelete,
                hardDelete,
                date
            }
            const analyticsResponse = await apiContract.getAnalytics(serverId, quotationDeleteQueryData);
            if (analyticsResponse.data.status){
                setAnalytics(analyticsResponse.data.data);
                setConfirmModalOpen(true);
            }
            else{
                showSnackbar('Failed to fetch analytics data. Please try again.', 'error');
            }
         
        } catch (error) {
            console.error('Error fetching analytics:', error);
            showSnackbar('Failed to fetch analytics data. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            const shopId = shopDetails.id;
            const dataObj = {
                shopId,
                date: date.toDate(),
                itemStatus: itemStatus.map(element => element === "All" ? "" : element),
                hardDelete: hardDelete ? 1 : 0,
                imageDelete: imageDelete ? 1 : 0
            };

            const response = await apiContract.deleteQuotations(serverId, shopId, dataObj);
            showSnackbar(response.message || "Quotations deleted successfully", 'success');
            handleClear();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to delete quotations. Please try again.', 'error');
        } finally {
            setLoading(false);
            setConfirmModalOpen(false);
        }
    };

    const handleClear = () => {
        setHardDelete(false);
        setImageDelete(false);
        setItemStatus([]);
        setDate(moment());
        setFormErrors({});
    };

    useEffect(() => {
        setFormErrors({});
    }, [itemStatus, date]);

    // const ConfirmationModal = () => (
    //     <Modal
    //         open={confirmModalOpen}
    //         onClose={() => setConfirmModalOpen(false)}
    //         aria-labelledby="confirmation-modal-title"
    //         aria-describedby="confirmation-modal-description"
    //     >
    //         <Box sx={{
    //             position: 'absolute',
    //             top: '50%',
    //             left: '50%',
    //             transform: 'translate(-50%, -50%)',
    //             width: 400,
    //             bgcolor: 'background.paper',
    //             borderRadius: 2,
    //             boxShadow: 24,
    //             p: 4,
    //         }}>
    //             <Typography id="confirmation-modal-title" variant="h6" component="h2" gutterBottom>
    //                 Confirm Deletion
    //             </Typography>
    //             <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
    //                 {analytics ? (
    //                     <>
    //                         <p>Total rows to be affected: {analytics.totalRows}</p>
    //                         <p>Quotations to be deleted: {analytics.quotationsToDelete}</p>
    //                         <p>Images to be deleted: {analytics.imagesToDelete}</p>
    //                     </>
    //                 ) : (
    //                     <p>Loading analytics...</p>
    //                 )}
    //                 Are you sure you want to proceed with the deletion?
    //             </Typography>
    //             <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
    //                 <Button onClick={() => setConfirmModalOpen(false)} sx={{ mr: 2 }}>Cancel</Button>
    //                 <Button 
    //                     onClick={handleConfirmDelete} 
    //                     variant="contained" 
    //                     color="error"
    //                     disabled={loading}
    //                 >
    //                     {loading ? 'Deleting...' : 'Delete'}
    //                 </Button>
    //             </Box>
    //         </Box>
    //     </Modal>
    // );

    return (
        <Paper sx={{ borderRadius: 2, backgroundColor: "#ffffff", margin: 'auto', maxWidth: 800, padding: 4, boxShadow: 4, marginTop: 5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!formErrors.itemStatus}>
                        <InputLabel id="item-status-select-label">Item Status</InputLabel>
                        <Select
                            labelId="item-status-select-label"
                            id="item-status-select"
                            value={itemStatus}
                            label="Item Status"
                            onChange={handleChangeItemStatus}
                            renderValue={(selected) => {
                                if (selected.length === 0) return "Select an item status";
                                if (selected.includes("") && selected.length > 1) return "All";
                                if (selected.includes("")) return "App";
                                return selected.join(", ");
                            }}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="App">App</MenuItem>
                            <MenuItem value="Instock">Instock</MenuItem>
                            <MenuItem value="Catalogue">Catalogue</MenuItem>
                        </Select>
                        {formErrors.itemStatus && <Typography variant="caption" color="error">{formErrors.itemStatus}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>Hard Delete</Typography>
                        <Switch
                            checked={hardDelete}
                            onChange={handleHardDeleteChange}
                            inputProps={{ 'aria-label': 'Hard Delete' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>Image Delete</Typography>
                        <Switch
                            checked={imageDelete}
                            onChange={handleImageDeleteChange}
                            inputProps={{ 'aria-label': 'Image Delete' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!formErrors.date}>
                        <DatePicker
                            size="middle"
                            className="modal-datepicker"
                            style={{ width: '100%' }}
                            value={date}
                            defaultValue={moment()}
                            onChange={handleDateChange}
                            popupStyle={{ zIndex: 1501 }}
                        />
                        {formErrors.date && <Typography variant="caption" color="error">{formErrors.date}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Button
                        sx={{
                            backgroundColor: "#6FC276",
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ffffff',
                                color: "#6FC276"
                            },
                            marginRight: 2
                        }}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "#6FC276",
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ffffff',
                                color: "#6FC276"
                            }
                        }}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Delete'}
                    </Button>
                </Grid>
            </Grid>
            <AnalyticsModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                analytics={analytics}
                loading={loading}
                actionType="deleteQuotations"
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
        </Paper>
    );
};

export default QuotationCard;