import Sidenav from "../Sidenav";
import Navbar from "../Navbar";
import {Box} from '@mui/material'

function Server() {
    return (
      <>
      <Navbar/>
      <Box height={60}/>
      <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>  
          <h1>Server</h1>
        </Box>
      </Box>
      </>
    );
  }
  
  export default Server;
  