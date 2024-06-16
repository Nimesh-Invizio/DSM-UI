import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const NestedObjectRenderer = ({ value, renderField, handleRemoveField, masterObj, setMasterObj }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(value).map(([nestedKey, nestedValue]) => (
        <React.Fragment key={nestedKey}>
          {typeof nestedValue === 'object' && nestedValue !== null ? (
            <NestedObjectField
              key={nestedKey}
              value={nestedValue}
              renderField={renderField}
              handleRemoveField={handleRemoveField}
              masterObj={masterObj}
              setMasterObj={setMasterObj}
              nestedKey={nestedKey}
            />
          ) : (
            renderField(`${nestedKey}`, nestedValue, handleRemoveField)
          )}
        </React.Fragment>
      ))}
    </Grid>
  );
};

const NestedObjectField = ({ nestedKey, value, renderField, handleRemoveField, masterObj, setMasterObj }) => {
  const fieldKey = nestedKey.replace(/\./g, ' ');

  const handleNestedFieldChange = (nestedKey, nestedValue) => {
    const newMasterObj = { ...masterObj };
    const nestedKeys = nestedKey.split('.');
    let currentObj = newMasterObj;

    for (let i = 0; i < nestedKeys.length - 1; i++) {
      const k = nestedKeys[i];
      if (!currentObj[k]) {
        currentObj[k] = {};
      }
      currentObj = currentObj[k];
    }

    const lastKey = nestedKeys[nestedKeys.length - 1];
    currentObj[lastKey] = nestedValue;

    setMasterObj(newMasterObj);
  };

  return (
    <Grid item xs={12} key={nestedKey}>
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {fieldKey}
        </Typography>
        <NestedObjectRenderer
          value={value}
          renderField={(key, value, handleRemove) =>
            renderField(`${nestedKey}.${key}`, value, handleRemove.bind(null, `${nestedKey}.${key}`))
          }
          handleRemoveField={handleNestedFieldChange}
          masterObj={masterObj}
          setMasterObj={setMasterObj}
        />
      </Card>
    </Grid>
  );
};

const FeaturesCard = ({ shopData }) => {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [masterObj, setMasterObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
  const [newFieldType, setNewFieldType] = useState('');

  useEffect(() => {
    if (shopData && shopData.length > 0) {
      setSelectedShopId(shopData[0].id);
    }
  }, [shopData]);

  useEffect(() => {
    if (selectedShopId) {
      const selectedShop = shopData.find((shop) => shop.id === selectedShopId);
      if (selectedShop) {
        setMasterObj(JSON.parse(selectedShop.features));
      } else {
        setError('Selected shop not found');
      }
    }
  }, [selectedShopId, shopData]);

  const handleShopChange = (event) => {
    setSelectedShopId(event.target.value);
    setError(null);
  };

  const handleInputChange = (key, value) => {
    const newMasterObj = { ...masterObj };
    const keys = key.split('.');
    let currentObj = newMasterObj;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!currentObj[k]) {
        currentObj[k] = {};
      }
      currentObj = currentObj[k];
    }

    const lastKey = keys[keys.length - 1];
    currentObj[lastKey] = value;

    setMasterObj(newMasterObj);
  };

  const handleAddField = () => {
    setOpenAddFieldDialog(true);
  };

  const handleAddFieldConfirm = () => {
    const newFieldPath = `newField${Object.keys(masterObj).length}`;
    const newMasterObj = { ...masterObj };
    const keys = newFieldPath.split('.');
    let currentObj = newMasterObj;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!currentObj[k]) {
        currentObj[k] = {};
      }
      currentObj = currentObj[k];
    }

    const lastKey = keys[keys.length - 1];
    currentObj[lastKey] = newFieldType === 'boolean' ? false : '';

    setMasterObj(newMasterObj);
    setOpenAddFieldDialog(false);
    setNewFieldType('');
  };

  const handleAddFieldCancel = () => {
    setOpenAddFieldDialog(false);
    setNewFieldType('');
  };

  const handleRemoveField = (key) => {
    const newMasterObj = { ...masterObj };
    const keys = key.split('.');
    let currentObj = newMasterObj;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!currentObj[k]) {
        return;
      }
      currentObj = currentObj[k];
    }

    const lastKey = keys[keys.length - 1];
    delete currentObj[lastKey];

    setMasterObj(newMasterObj);
  };

  const handleSaveChanges = () => {
    setLoading(true);
    axios
      .put(`/api/shops/${selectedShopId}`, { features: masterObj })
      .then((response) => console.log(response.data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  const renderField = (key, value, handleRemove) => {
    const fieldKey = key.replace(/\./g, ' ');

    if (typeof value === 'boolean') {
      return (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" mr={1}>
              {fieldKey}
            </Typography>
            <Switch checked={value} onChange={(e) => handleInputChange(key, e.target.checked)} name={key} />
            <Tooltip title="Remove Field">
              <IconButton size="small" onClick={() => handleRemove(key)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      );
    } else
      if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
        return (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <TextField
              label={fieldKey}
              type={typeof value === 'number' ? 'number' : 'text'}
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <Tooltip title="Remove Field">
                    <IconButton size="small" onClick={() => handleRemove(key)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </Grid>
        );
      } else if (Array.isArray(value)) {
        return (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <FormControl fullWidth>
              <InputLabel>{fieldKey}</InputLabel>
              <Select value={value[0] || ''} onChange={(e) => handleInputChange(key, e.target.value)}>
                {value.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      }

    return null;
  };

  const renderToggleFields = () => {
    const toggleFields = Object.entries(masterObj).filter(([key, value]) => typeof value === 'boolean');

    return (
      <>
        <SectionHeading variant="h5">Toggle Switches</SectionHeading>
        <SectionDivider />
        <Grid container spacing={2}>
          {toggleFields.map(([key, value]) => renderField(key, value, handleRemoveField))}
        </Grid>
      </>
    );
  };

  const renderTextFields = () => {
    const textFields = Object.entries(masterObj).filter(
      ([key, value]) => typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean'
    );

    return (
      <>
        <SectionHeading variant="h5">Text & Number Fields</SectionHeading>
        <SectionDivider />
        <Grid container spacing={2}>
          {textFields.map(([key, value]) => renderField(key, value, handleRemoveField))}
        </Grid>
      </>
    );
  };

  const renderDropdownFields = () => {
    const dropdownFields = Object.entries(masterObj).filter(([key, value]) => Array.isArray(value));

    return (
      <>
        <SectionHeading variant="h5">Dropdown Fields</SectionHeading>
        <SectionDivider />
        <Grid container spacing={2}>
          {dropdownFields.map(([key, value]) => renderField(key, value, handleRemoveField))}
        </Grid>
      </>
    );
  };

  return (
    <Paper elevation={4} sx={{ p: 4, mt: 5 }}>
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel id="shop-select-label" sx={{ fontWeight: 'bold' }}>
            Select Shop
          </InputLabel>
          <Select
            labelId="shop-select-label"
            value={selectedShopId || ''}
            onChange={handleShopChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiSelect-root': {
                fontWeight: 'bold',
              },
            }}
          >
            <MenuItem value="">Select a shop</MenuItem>
            {shopData.map((shop) => (
              <MenuItem key={shop.id} value={shop.id}>
                {shop.shopName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" my={4}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      ) : selectedShopId ? (
        <>
          {renderToggleFields()}
          {renderTextFields()}
          {renderDropdownFields()}
          <NestedObjectRenderer
            value={masterObj}
            renderField={(key, value, handleRemove) => renderField(key, value, handleRemove.bind(this))}
            handleRemoveField={handleRemoveField}
            masterObj={masterObj}
            setMasterObj={setMasterObj}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Tooltip title="Add New Field">
              <IconButton
                onClick={handleAddField}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              disabled={loading}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" my={4}>
          <Typography variant="h6">Please select shop</Typography>
        </Box>
      )}
      <Dialog open={openAddFieldDialog} onClose={handleAddFieldCancel}>
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="field-type-label" sx={{ fontWeight: 'bold' }}>
              Field Type
            </InputLabel>
            <Select
              labelId="field-type-label"
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiSelect-root': {
                  fontWeight: 'bold',
                },
              }}
            >
              <MenuItem value="string">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="boolean">Boolean</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddFieldCancel}>Cancel</Button>
          <Button
            onClick={handleAddFieldConfirm}
            disabled={!newFieldType}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FeaturesCard;