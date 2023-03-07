import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom'

//material ui
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Grid, Paper, Box, Grow, Container, TextField, CardMedia, FormHelperText, Snackbar, Typography, Button, FormControl, OutlinedInput, InputAdornment, InputLabel, IconButton } from '@mui/material'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTheme } from "@emotion/react";
import * as faceapi from 'face-api.js'
import canvas from 'canvas'
import { asyncsendOTP, asyncsignUp, asyncverifyEmail, setAlert } from '../../state/index'
import signUpImg from '../../images/secure_signup.svg'
import enterOtpImg from '../../images/enter_otp.svg'
import Alert from "../../Utils/Alert";
import Compress from 'compress.js'
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const initialState = {
    userName: '', email: '', mobileNo: '', confirmPassword: '', password: '', firstName: '', lastName: '', otp: '',selectedImg:''
}


const RegisterPage = () => {
    const theme = useTheme();
    const styles = {
        formCont: {
            marginTop: "5em",
            width: "auto",
            marginBottom: "5em"
        },
        titlePaper: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            position: "relative",
            height: "auto",
            backgroundColor: theme.palette.primary.dark,
            padding: "0.5em 0 0.5em 0",
            color: "#ffc",
            fontWeight: 600
        },
        title: {
            backgroundColor: theme.palette.primary.light,
            padding: "0.4em 0",
            color: "#334257"
        },
        paper: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            position: "relative",
            height: "auto",
            paddingBottom: "1em",
            padding: "1em"
        },
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "70%",
            margin: "auto",
            "@media (max-width : 500px)": {
                width: "100%"
            },
        },
        formPaper: {
            padding: "0.3em",
            display: "flex",
            flexDirection: "column",
            gap: "0.7em"
        },
        signUpBtn: {
            "&:hover": {
                color: "white"
            }
        },
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        ipFields: {
            flexGrow: 1,
        },
        submitBtn: {
            width: "100%"
        },
        formContainer: {
            marginTop: "1rem"
        },
        otpField: {
            flexGrow: 0.5,
            maxWidth: "30em"
        }

    }




    const [formData, setFormData] = useState(initialState)
    const [showPassword1, setshowPassword1] = useState(false);
    const [showPassword2, setshowPassword2] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [alreadyotp, setAlreadyOTP] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [detected,setDetected] = useState(false)
    const [imgFIleName, setImgFIlename] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const compress = new Compress()
    const alert = useSelector(state => state.auth.alert)
    const user = useSelector(state => state.auth.user)


    useEffect(() => {
        if (user._id) {
            if (user.role === "admin") {
                navigate("/admindb")
            } else
                navigate("/home")
        }
    }, [user])

    useEffect(() => {
        if (alert.msg == "OTP Sent to your email id") {
            setOtpSent(true);
        } else if (alert.msg == "You're Registered Successfully, Login Now") {
            navigate("/login")
        }
    }, [alert])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otpSent) {
            if(formData.selectedImg==''){
                dispatch(asyncsendOTP({userName: formData.userName, email: formData.email, mobileNo: formData.mobileNo, confirmPassword: formData.confirmPassword, 
                    password:formData.password, firstName:formData.firstName, lastName: formData.lastName, otp: formData.otp}))
            }else{
                dispatch(asyncsendOTP(formData))
            }
            
        } else {
            dispatch(asyncverifyEmail(formData))
        }
        console.log("Submitting form...")
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const handleClickShowPassword1 = () => {
        setshowPassword1(prevState => !prevState)
    }

    const handleClickShowPassword2 = () => {
        setshowPassword2(prevState => !prevState)
    }

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleResetEmail = () => {
        console.log("Reset email sent..")
    }

    const handleClickSignIn = () => {
        navigate("/login")
    }

    const handleAlreadyOTP = () => {
        setOtpSent(true)
        setAlreadyOTP(true)
    }

    const handleUploadClick = async(e)=>{
        console.log(e)
        const imgFile = e.target.files[0]
        console.log(imgFile)

        if (!["image/png", "image/jpeg"].includes(imgFile.type)) {
            dispatch(setAlert({ msg: "Only jpg/jpeg/png file allowed to upload", type: "error" }))
            return
        }
        
        const imageData = await compress.compress([imgFile],{size:0.2,quality:0.5})
        const compressedImg = imageData[0].prefix + imageData[0].data;
        const testImg = await canvas.loadImage(compressedImg)
        const myCanvas = canvas.createCanvas(200,200)
        const ctx = myCanvas.getContext('2d')
        ctx.drawImage(testImg, 0, 0, 200, 200)
        console.log(testImg)
        // console.log(myCanvas instanceof HTMLCanvasElement)
        console.log(myCanvas instanceof HTMLCanvasElement)
        const detections = await faceapi.detectSingleFace(myCanvas).withFaceLandmarks()
        console.log(detections)
        if(detections===undefined){
            dispatch(setAlert({ msg: "Please select a photo with face clearly visible", type: "error" }))
            return
        }
        setImgFIlename(imgFile.name)
        // console.log(compressedImg)
        setFormData({...formData,selectedImg:compressedImg})
        
    }
    return (
        <Grow in>
            <Container sx={styles.formCont}>
                <Alert />
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
                            <Grid container>
                                <Grid item xs={12} sm={5}>
                                    {
                                        alreadyotp ? (
                                            <img src={enterOtpImg} alt="Sign Up" width="70%" />
                                        ) : (
                                            <img src={signUpImg} alt="sign Up" width="100%" />
                                        )
                                    }

                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <Paper sx={styles.title}>
                                        <Typography variant="h4" align="center">
                                            <i sx="fa fa-user-plus"></i>
                                            {
                                                alreadyotp ? ("Enter otp received on your email") : ("Register To Create a new Account")
                                            }
                                        </Typography>
                                    </Paper>
                                    <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                                        <Grid container sx={styles.formContainer} spacing={2}>
                                            {
                                                !alreadyotp ? (
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
                                                ) : null
                                            }

                                            <Grid item sm={12} sx={styles.ipFields}>
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
                                            {
                                                !alreadyotp ? (
                                                    <>
                                                        <Grid item xs={12} sm={6} sx={styles.ipFields}>
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
                                                        <Grid item xs={12} sm={6} sx={styles.ipFields}>
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
                                                        <Grid item sm={12} sx={styles.ipFields}>
                                                            <FormControl required fullWidth sx={styles.margin} variant="outlined">
                                                                <InputLabel htmlFor="password">Password</InputLabel>
                                                                <OutlinedInput
                                                                    id="password"
                                                                    name="password"
                                                                    label="Password"
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
                                                                    labelwidth={80}
                                                                />
                                                                <FormHelperText required variant="outlined" children="Password must be atleast 6 characters" />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item sm={12} sx={styles.ipFields}>
                                                            <FormControl required fullWidth sx={styles.margin} variant="outlined">
                                                                <InputLabel htmlFor="confirmPassword">Confirm Your Password</InputLabel>
                                                                <OutlinedInput
                                                                    id="confirmPassword"
                                                                    name="confirmPassword"
                                                                    label="Confirm Your Password"
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
                                                                    labelwidth={170}
                                                                />
                                                                <FormHelperText required variant="outlined" children="Must be same as password above" />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                ) : null
                                            }
                                            <Grid item sm={12} xs={12} sx={styles.ipFields}>
                                                <Typography variant="h5" display="inline">Add a Photo of Yourself:</Typography>
                                                <Button variant="contained" sx={{ marginLeft: "1em" }} component="label">
                                                    Upload
                                                    <input hidden accept="image/*" type="file" onChange={handleUploadClick} />
                                                </Button>
                                                <IconButton color="primary" aria-label="Upload picture" component="label">
                                                    <input hidden accept="image/*" type="file" onChange={handleUploadClick} />
                                                    <PhotoCamera />
                                                </IconButton>
                                                {
                                                    imgFIleName !== '' ? (
                                                        <>
                                                            <Box border="1px solid black">
                                                                <Typography>
                                                                    {imgFIleName}
                                                                </Typography>
                                                            </Box>
                                                            <img src={formData.selectedImg} width="50%" />
                                                        </>
                                                    ) : null
                                                }


                                                <FormHelperText required children="*Only jpg/jpeg/png file allowed to upload" />
                                            </Grid>
                                            {
                                                otpSent ? (
                                                    <Grid item sm={12} sx={styles.otpField}>
                                                        <TextField
                                                            name="otp"
                                                            type="text"
                                                            variant="outlined"
                                                            required
                                                            fullWidth
                                                            label="Enter OTP"
                                                            size="small"
                                                            onChange={handleChange}
                                                            value={formData.otp}
                                                            sx={styles.otpField}
                                                        />
                                                    </Grid>
                                                ) : null
                                            }
                                            {
                                                otpSent ? (
                                                    <Grid item sm={12} sx={styles.submitBtn}>
                                                        <Button
                                                            variant="contained"
                                                            type="submit"
                                                            sx={styles.button}
                                                            color="primary"
                                                        >
                                                            <Typography>Verify OTP & Register</Typography>
                                                        </Button>
                                                    </Grid>
                                                ) : (
                                                    <Grid item sm={12} sx={styles.submitBtn}>
                                                        <Button
                                                            variant="contained"
                                                            type="submit"
                                                            sx={styles.button}
                                                            color="primary"
                                                        >
                                                            <Typography>Send OTP</Typography>
                                                        </Button>
                                                    </Grid>
                                                )
                                            }
                                            {
                                                !otpSent ? (
                                                    <Grid item sm={12} sx={styles.submitBtn}>
                                                        <Button
                                                            variant="contained"
                                                            type="submit"
                                                            sx={styles.button}
                                                            onClick={handleAlreadyOTP}
                                                            color="primary"
                                                        >
                                                            <Typography>Already have a OTP?</Typography>
                                                        </Button>
                                                    </Grid>
                                                ) : null
                                            }

                                        </Grid>
                                    </form>
                                    <Box fontWeight="fontWeightMedium" m={2}>
                                        <Typography variant="h6" >
                                            Already have an Account? <Button color="primary" variant="contained" sx={styles.signUpBtn}
                                                onClick={handleClickSignIn}>Sign In</Button>
                                        </Typography>
                                    </Box>

                                </Grid>
                            </Grid>


                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Grow>
    )

}


export default RegisterPage;