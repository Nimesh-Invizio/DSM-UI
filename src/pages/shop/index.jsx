import React from 'react'
import FeaturesCard from './components/FeaturesCard'
import Header from './components/Header'
import   './style.css'
import { Box } from '@mui/material'
const Shop = () => {
  return (
    <React.Fragment>
    <Box sx={{ 
      backgroundColor:"#ffffff",
      boxShadow:"1rem",
      borderRadius:"2px solid red",
      margin:"5rem"
    }}>
      <Header/>
      <FeaturesCard/>
      </Box>
    </React.Fragment>
  )
}

export default Shop;