import React, { useState } from 'react'
import {AppBar, Box, Button, Tab,Tabs,Toolbar, Typography} from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../store'
const Header = () => {
  const dispatch=useDispatch
  const [value,setvalue]=useState()
  const isLoggedIn=useSelector(state=>state.isLoggedIn)
    return (
    <AppBar sx={{background:'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,9,117,1) 35%, rgba(0,212,255,1) 100%)'} } position='sticky'>
      <Toolbar>
        <Typography variant='h4'>BlogsApp</Typography>
        { isLoggedIn &&<Box display={'flex'} marginLeft={'auto'}>
          <Tabs textColor='inherit' value={value} onChange={(e,val)=>setvalue(val)}>
          <Tab LinkComponent={Link} to='/blogs' label="All Blogs" />
          <Tab LinkComponent={Link} to='/myblogs' label="My Blogs"/>
          <Tab LinkComponent={Link} to='/addblog' label="ADD BLOG"/>
          </Tabs>
          
        </Box>}
        <Box display={'flex'} gap={2} marginLeft={'auto'}>
          {!isLoggedIn && <><Link to={'/auth'}>
          <Button variant='contained'  sx={{margin:'1',borderRadius:10}} color='warning'>Login</Button>
          </Link>
          <Link to={'/auth'}>
          <Button variant='contained'  sx={{margin:'1',borderRadius:10}}color='warning'>Signup</Button>
          </Link></>}
          {isLoggedIn&&<Button onClick={()=>dispatch(authActions.logout())
          } LinkComponent={Link} to='/auth' variant='contained'  sx={{margin:'1',borderRadius:10}}color='warning'>Log Out</Button>}
          
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
