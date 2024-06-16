import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackAlert = ({message, type, onClose, status}) => {
    return (
        <>
          <Snackbar open={status} autoHideDuration={3000} onClose={onClose}
            anchorOrigin={{ vertical : 'bottom', horizontal : 'center' }}
          >
            <Alert onClose={onClose} severity= {type}>
              {message}
            </Alert>
          </Snackbar>
        </>
    )
};

export default SnackAlert;