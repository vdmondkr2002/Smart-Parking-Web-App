import {useState,useEffect} from 'react';

/*react-modules */
import {Link as RouterLink,useNavigate,useLocation} from 'react-router-dom'
import { useDispatch ,useSelector} from "react-redux";

/*Material UI */
import {Link,Toolbar,Button,Menu,MenuItem,Avatar,Typography} from '@mui/material'


/*components and constants */
import logo from '../../images/Parking-logo.jpg'
import { useTheme } from '@emotion/react';
import { setLogout } from '../../state';



const DeskTopNav = ()=>{
    
    
    const theme = useTheme();


    const styles = {
        logo:{
            maxWidth: "2em",
            transition:"500ms",
            "&:hover":{
                transform:"scale(1.1)"
            }
        },
        root:{
            flexGrow:1,
            justifyContent:"space-between",
            background:
            "linear-gradient(90deg, rgba(218, 159, 249,1) 10%, rgb(121, 82, 179) 55%)", 
        },
        menuButton:{
            marginRight: theme.spacing(2),
            "&:hover":{
                color:"white"
            }
            //  color:"white !important"
        },
        home:{
            marginLeft:"auto"
        },
        about:{
            marginRight:"auto"
        },
        middle:{
            marginLeft:"auto"
        },
        menuitemText:{
            fontWeight:"500",
            fontSize:"1.1rem"
        },
        name:{
            marginLeft:"auto",
            textTransform:"uppercase",
            fontWeight:600,
            color:"#fff",
            padding:"0.5em"
        }
        
    }
    const dispatch = useDispatch();
    const [anchorEl,setAnchorEl] = useState(null);
    const user = useSelector(state=>state.auth.user);
    const navigate = useNavigate()

    const logout = ()=>{
        console.log("logging out")
        dispatch(setLogout())
        navigate("/login")
    }

    const handleClickAvatar = (e)=>{
        setAnchorEl(e.currentTarget)
    }

    const handleAvatarMenuClose = ()=>{
        setAnchorEl(null)
    }

    return (
        <>
             <Toolbar sx={styles.root}>
                <Link href="#" color="inherit">
                    <img src={logo} width="150rem" alt="Logo"/>
                </Link>
                <div sx={styles.middle}>
                    <Button component={RouterLink} to={user._id?"/home":"/"} color="inherit" sx={styles.home}>
                        <Typography variant="h6" sx={styles.name}>
                            Home
                        </Typography>
                    </Button>
                    <Button component={RouterLink} color="inherit" to="/news" sx={styles.about}>
                        <Typography variant="h6" sx={styles.name}>
                            News
                        </Typography>
                    </Button>
                    <Button component={RouterLink} color="inherit" to="/contactus" sx={styles.about}>
                        <Typography variant="h6" sx={styles.name}>
                            Contact
                        </Typography>
                    </Button>
                    <Button component={RouterLink} color="inherit" to="/aboutus" sx={styles.about}>
                        <Typography variant="h6" sx={styles.name}>
                            About
                        </Typography>
                    </Button>
                </div>
                {
                    user._id?(
                        <>
                            <Typography variant="h6" sx={styles.name}>
                                {user.userName}
                            </Typography>
                            <Button 
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleClickAvatar}
                            >
                                <Avatar src={user?.profilePic} alt={user?.userName}>
                                    {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                                </Avatar>
                            </Button>
                            <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleAvatarMenuClose}
                            >
                                {
                                    user.role=="user"?(
                                        <MenuItem onClick={handleAvatarMenuClose}>
                                            <Button component={RouterLink} color="inherit" to="/profile" sx={styles.menuButton}>
                                                <Typography variant="h6" sx={styles.menuitemText}>
                                                    Profile
                                                </Typography>
                                                
                                            </Button>
                                        </MenuItem>
                                    ):null
                                }
                                
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
                        <Button component={RouterLink} to="/login" color="inherit" sx={styles.name}>
                            <Typography variant="h6" sx={styles.name}>
                                Sign Up/Login
                            </Typography>
                        </Button>
                        </>
                    )
                }
             </Toolbar>
        </>
    )
}

export default DeskTopNav;