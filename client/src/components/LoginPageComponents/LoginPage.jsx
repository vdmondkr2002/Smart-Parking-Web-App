import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'

//material ui
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Grid, Paper, Box, Grow, Container, TextField, CardMedia, FormHelperText, Snackbar, Typography, Button, FormControl, OutlinedInput, InputAdornment, InputLabel, IconButton, CircularProgress } from '@mui/material'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTheme } from "@emotion/react";
import { asyncSendResetEmail, asyncsignIn, asyncsignUp } from '../../state/index'
import loginImg from '../../images/secure_login.svg'
import Alert from "../../Utils/Alert";

const initialState = {
    userName: '', email: '', mobileNo: '', confirmPassword: '', password: '', firstName: '', lastName: ''
}


const LoginPage = () => {
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
        }
    }

    const [formData, setFormData] = useState(initialState)
    const [showPassword1, setshowPassword1] = useState(false);
    const [showPassword2, setshowPassword2] = useState(false);
    const inProgress2 = useSelector(state => state.auth.inProgress2)
    const inProgress1 = useSelector(state => state.auth.inProgress1)
    const [resetEmail, setResetEmail] = useState('')
    const [openDialog, setOpenDialog] = useState(false);
    const alert = useSelector(state => state.auth.alert)
    const user = useSelector(state => state.auth.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {
        if (user._id) {
            if (user.role === "admin") {
                navigate("/admindb")
            } else
                navigate("/profile")
        }
    }, [user])

    useEffect(() => {
        if (alert.msg) {
            if (alert.msg == "Mail sent with link to reset Your password") {
                setOpenDialog(false)
            }
        }
    }, [alert])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(asyncsignIn(formData))
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

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setResetEmail("")
    }


    const handleResetEmail = () => {
        console.log("Reset email sent..")
        console.log(resetEmail)
        dispatch(asyncSendResetEmail({ email: resetEmail }))
    }

    const handleClickSignUp = () => {
        navigate("/register")
    }

    const handleClickOpenDialog = () => {
        setOpenDialog(true)
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={5} sx={{ padding: "1em" }}>
                                    <img src={loginImg} alt="login" width="100%" />
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <Paper sx={styles.title}>
                                        <Typography variant="h4" align="center">
                                            <LockOpenIcon /> Login To Access Your Account
                                        </Typography>
                                    </Paper>

                                    <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                                        <Grid container sx={styles.formContainer} spacing={2}>
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
                                            <Grid item sm={12} sx={styles.ipFields}>
                                                <FormControl required fullWidth sx={styles.margin} variant="outlined">
                                                    <InputLabel htmlFor="password">Password</InputLabel>
                                                    <OutlinedInput
                                                        id="password"
                                                        name="password"
                                                        label="password"
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
                                                    <FormHelperText required variant="outlined" children="Password must be atleast 6 characters" />
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={12} sx={styles.submitBtn}>
                                                {
                                                    inProgress1 ? (
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<CircularProgress size={20} sx={{ color: "yellow" }} />}
                                                            sx={styles.button}
                                                            color="info"
                                                        >
                                                            <Typography>Logging In</Typography>
                                                        </Button>
                                                        
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            type="submit"
                                                            sx={styles.button}
                                                            color="primary"
                                                        >
                                                            <Typography>Login</Typography>
                                                        </Button>
                                                    )
                                                }

                                            </Grid>
                                            <Grid item sm={12}>
                                                <Button variant="outlined" onClick={handleClickOpenDialog}>Forgot Password?</Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    <Box fontWeight="fontWeightMedium" m={2}>
                                        <Typography variant="h6" >
                                            Don't have an Account? <Button color="primary" variant="contained" sx={styles.signUpBtn} onClick={handleClickSignUp}><Typography>Create One</Typography></Button>
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Paper>
                <Dialog fullWidth open={openDialog} onClose={handleCloseDialog} aria-labelledby="dialog-title">
                    <DialogTitle fontWeight="bold" id="dialog-title">Reset Your Account Password</DialogTitle>
                    <DialogContent>
                        <Grid container sx={{ paddingTop: "1em" }} spacing={2}>
                            <Grid item sm={12}>
                                <TextField
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    label="Enter Your email to reset password link"
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    value={resetEmail}
                                    sx={styles.ipFields}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="warning" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        {
                            inProgress2 ? (
                                <Button variant="contained" color="success" startIcon={<CircularProgress size={20} sx={{ color: "yellow" }} />} >
                                    Sending
                                </Button>

                            ) : (
                                <Button variant="contained" color="success" onClick={handleResetEmail}>
                                    Send
                                </Button>
                            )
                        }

                    </DialogActions>
                </Dialog>
            </Container>
        </Grow>
    )

}


export default LoginPage;