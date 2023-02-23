import {useState} from 'react';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";

import {Link,Toolbar,Button,Menu,MenuItem,Avatar,Typography,IconButton,Drawer,Grid} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import logo from '../../images/Parking-logo.jpg'
import { useTheme } from '@emotion/react';

const MobileNav = ({mobileDrawer,setMobileDrawer})=>{
    const dispatch = useDispatch();
    const history = useNavigate();
    const [anchorEl,setAnchorEl] = useState(null);
    const user = useSelector(state=>state.auth.user);
    const theme = useTheme();

    const styles = {
        menuButton:{
            marginRight: theme.spacing(2),
            // color:"white !important",
            "&:hover":{
                color:"white"
            }
        },
        logoCont:{
            marginRight:"auto"
        },
        navCont:{
            flexDirection:"column",
            padding:"0.6em",
        },
        drawerContainer:{
            margin:"0.5em",
            fontWeight:"500",
            borderRadius:"0.7em",
            flexGrow:1
        },
        logo:{
            maxWidth: "4em",
            transition:"500ms",
            "&:hover":{
              transform:"scale(1.1)"
            }
        },
        AvatarButton:{
            position:"static",
            marginLeft:"auto",
        },
        menuitemText:{
            fontWeight:"500",
            fontSize:"1rem"
        },
        navItems:{
            width:"100%"
        }
    }
    const logout = () => {
        
    };

    const handleDrawerOpen = ()=>{
        setMobileDrawer((prevState)=>({...prevState,drawerOpen:true}))
    }

    const handleDrawerClose = ()=>{
        setMobileDrawer((prevState)=>({...prevState,drawerOpen:false}))
    }

    const handleClickAvatar = (e)=>{
        setAnchorEl(e.currentTarget)
    }
    
    const handleAvatarMenuClose = ()=>{
        setAnchorEl(null)
    }

    return (
        <>
            <Toolbar>
                <IconButton aria-label="menu" aria-haspopup={true} onClick={handleDrawerOpen} edge="start" sx={styles.menuButton} color="inherit">
                    <MenuIcon />
                </IconButton>
                <Drawer
                anchor="left"
                open={mobileDrawer.drawerOpen}
                onClose={handleDrawerClose}
                >
                    <Grid container spacing={2} sx={styles.navCont}>
                        <Grid item >
                            <Button component={RouterLink} variant="contained" to="/" color="primary" sx={styles.navItems}>
                                <MenuItem>Home</MenuItem>    
                            </Button>
                        </Grid>
                        <Grid item >
                            <Button component={RouterLink} variant="contained" color="primary" to="/about" sx={styles.navItems}>
                                <MenuItem>About Us</MenuItem> 
                            </Button>
                        </Grid>
                    </Grid>
                </Drawer>
                <Link href="#" color="inherit" sx={styles.logoCont}>
                    <img src={logo} width="100rem" sx={styles.logo} alt="Logo"/>
                </Link>
                {
                    user._id?(
                        <>
                            <Button 
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClickAvatar}
                        
                            >
                                <Avatar src={user.profilePic} alt={user.firstName}>
                                {user.firstName.charAt(0)} {user.lastName.charAt(0)}
                                </Avatar>
                            </Button>
                            <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleAvatarMenuClose}
                            >
                                <MenuItem onClick={handleAvatarMenuClose}>
                                <Button component={RouterLink} color="inherit" to="/profile" sx={styles.menuButton}>
                                    <Typography variant="h6" sx={styles.menuitemText}>
                                        Profile
                                    </Typography>
                                    
                                </Button>
                                </MenuItem>
                                <MenuItem onClick={handleAvatarMenuClose}>
                                <Button color="inherit" sx={styles.menuButton} onClick={logout}>
                                    <Typography variant="h6" sx={styles.menuitemText}>
                                        Logout
                                    </Typography>
                                </Button>
                                </MenuItem>
                            </Menu>
                        </>
                    ):(
                        <>
                            <Button component={RouterLink} to="/login" color="inherit" sx={styles.menuButton}>
                                Sign Up/Login
                            </Button>
                        </>
                    )
                }
            </Toolbar>
        </>
    )
}


export default MobileNav;