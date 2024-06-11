import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import '../../style.css'
const Header = () => {

  const [actionType,setActionType] = useState("Shop Features")
  const handleChange = (event) => {
    setActionType(event.target.value);
  }

  return (
    <React.Fragment >
      <div className="shop-header">
        <FormControl >
          <InputLabel id="demo-simple-select-label">Action Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={actionType}
            defaultValue="Shop Features"
            label="Action Type"
            onChange={handleChange}
            sx={{
              width:200
            }}
          >
            <MenuItem value={10}>Shop Features</MenuItem>
            <MenuItem value={20}>Quotation Delete</MenuItem>
            <MenuItem value={30}>Products Delete</MenuItem>
            <MenuItem value={40}>All Images Delete</MenuItem>
            <MenuItem value={50}>Stale Images Delete</MenuItem>
          </Select>
        </FormControl>
      </div>

    </React.Fragment>
  )
}

export default Header