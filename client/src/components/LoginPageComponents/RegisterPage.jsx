import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'

//material ui
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {Grid,Paper,Box,Grow,Container,TextField,CardMedia,FormHelperText,Snackbar, Typography,Button,FormControl,OutlinedInput,InputAdornment,InputLabel,IconButton} from '@mui/material'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTheme } from "@emotion/react";

const initialState = {
    userName:'',email:'',mobileNo:'',confirmPassword:'',password:'',firstName:'',lastName:''
}


const RegisterPage = ()=>{
    const theme = useTheme();
    const styles = {
        formCont:{
            marginTop:"5em",
            width:"auto"
        },
        titlePaper:{
            display:"flex",
            flexDirection:"column",
            textAlign:"center",
            alignItems:"center",
            position:"relative",
            height:"auto",
            backgroundColor:theme.palette.primary.dark,
            padding:"0.5em 0 0.5em 0",
            color:"#ffc",
            fontWeight:600
        },
        title:{
            backgroundColor:theme.palette.primary.light,
            padding:"0.4em 0",
            color:"#334257"
        },
        paper:{
            display:"flex",
            flexDirection:"column",
            textAlign:"center",
            alignItems:"center",
            position:"relative",
            height:"auto",
            paddingBottom:"1em",
           
        },
        form:{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            width:"70%",
            margin:"auto",
            "@media (max-width : 500px)": {
                width:"100%"
            },
        },
        formPaper:{
            padding:"0.3em",
            display:"flex",
            flexDirection:"column",
            gap:"0.7em"
        },
        signUpBtn:{
            "&:hover":{
                color:"white"
            }
        },
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        ipFields:{
            flexGrow:1,
        },
        submitBtn:{
            width:"100%"
        },
        formContainer:{
            marginTop:"1rem"
        }
    }

    const [formData,setFormData] = useState(initialState)
    const [showPassword1,setshowPassword1] = useState(false);
    const [showPassword2,setshowPassword2] = useState(false);
    const [openDialog,setOpenDialog] = useState(false);
    
    const [loginToggle,setLoginToggle] = useState(false);

    const dispatch = useDispatch()
    const history = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(loginToggle){

        }else{
            console.log("Registration form")
        }
        console.log("Submitting form...")
    }

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const toggleLoginButton = ()=>{
        setLoginToggle(prevState=>!prevState);
        setFormData({...formData,password:'',firstName:'',lastName:'',userName:'',bio:'',email:'',confirmPassword:''})
    }

    const handleClickShowPassword1 = ()=>{
        setshowPassword1(prevState=>!prevState)
    }

    const handleClickShowPassword2 = ()=>{
        setshowPassword2(prevState=>!prevState)
    }
    
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleCloseDialog = ()=>{
        setOpenDialog(false);
    }
    
    const handleClickOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleResetEmail = ()=>{
        console.log("Reset email sent..")
    }

    return (
        <Grow in>
            <Container sx={styles.formCont}>
                <Paper sx={styles.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                                <Paper sx={styles.titlePaper}>
                                    <Typography variant="h3" sx={styles.tit}>
                                        Access Your Account Or Create One!
                                    </Typography>
                                </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            {
                                loginToggle?(
                                    <Paper sx={styles.title}>
                                        <Typography variant="h4" align="center">
                                            <LockOpenIcon/> Login To Access Your Account
                                        </Typography> 
                                    </Paper>
                                ):(
                                    <Paper sx={styles.title}>
                                        <Typography variant="h4" align="center">
                                            <i sx="fa fa-user-plus"></i>  Register To Create a new Account
                                        </Typography> 
                                    </Paper>
                                )
                            }
                            <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                                <Grid container sx={styles.formContainer} spacing={2}>
                                    {
                                        !loginToggle?(
                                            <>
                                                <Grid item sm={6} xs={12} sx={styles.ipFields}>
                                                    <TextField
                                                        name="firstName"
                                                        type="text"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        label="Enter Your first name"
                                                        onChange={handleChange}
                                                        value={formData.firstName}
                                                    />
                                                </Grid>
                                                <Grid item sm={6} xs={12} sx={styles.ipFields}>
                                                    <TextField
                                                        name="lastName"
                                                        type="text"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        label="Enter Your last name"
                                                        onChange={handleChange}
                                                        value={formData.lastName}
                                                    />
                                                </Grid>
                                            </>
                                        ):null
                                    }
                                    <Grid item sm={12}  sx={styles.ipFields}>
                                        <TextField
                                            name="email"
                                            type="email"
                                            variant="outlined"
                                            
                                            required
                                            fullWidth
                                            label="Enter Your Email"
                                            onChange={handleChange}
                                            value={formData.email}
                                        /> 
                                    </Grid>
                                    <Grid item sm={12}  sx={styles.ipFields}>
                                        <TextField
                                            name="mobileNo"
                                            type="text"
                                            variant="outlined"
                                            
                                            required
                                            fullWidth
                                            label="Enter Your Mobile No"
                                            onChange={handleChange}
                                            value={formData.mobileNo}
                                        /> 
                                    </Grid>
                                    {
                                        !loginToggle?(
                                            <Grid item sm={12} sx={styles.ipFields}>
                                                    <TextField
                                                    name="userName"
                                                    type="text"
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Enter a username"
                                                    onChange={handleChange}
                                                    value={formData.userName}
                                                    sx={styles.inputField}
                                                    />
                                            </Grid>
                                        ):null
                                    }
                                    <Grid item sm={12} sx={styles.ipFields}>
                                        <FormControl required fullWidth sx={styles.margin} variant="outlined">
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <OutlinedInput
                                                id="password"
                                                name="password"
                                                type={showPassword1 ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleChange}
                                                endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword1}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    >
                                                    {showPassword1 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                                }
                                                labelWidth={80}
                                            />
                                            <FormHelperText required  variant="outlined" children="Password must be atleast 6 characters"/>
                                        </FormControl>
                                    </Grid>

                                    {
                                        !loginToggle?(
                                            <Grid item sm={12} sx={styles.ipFields}>
                                                <FormControl required fullWidth sx={styles.margin} variant="outlined">
                                                <InputLabel htmlFor="confirmPassword">Confirm Your Password</InputLabel>
                                                <OutlinedInput
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={showPassword2 ? 'text' : 'password'}
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword2}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        >
                                                        {showPassword2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                    }
                                                    labelWidth={170}
                                                />
                                                <FormHelperText required  variant="outlined" children="Must be same as password above"/>
                                            </FormControl>
                                            </Grid>
                                        ):null
                                    }   
                                    <Grid item sm={12} sx={styles.submitBtn}>
                                        <Button
                                                variant="contained"
                                                type="submit"
                                                sx={styles.button}
                                                color="primary"
                                        >
                                            <Typography>Submit</Typography>
                                        </Button>
                                    </Grid>  
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Grow>
    )

}


export default RegisterPage;