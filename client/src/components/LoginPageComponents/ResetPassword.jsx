import Visibility from "@mui/icons-material/Visibility"
import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { Button, Container, FormControl, FormHelperText, Grid, Grow, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Typography, useTheme } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import ResetPasswordImg from '../../images/forgot_password.svg'
import Alert from "../../Utils/Alert"
import { asyncresetPassword } from "../../state"
import { useDispatch, useSelector } from "react-redux"

const initialState = {
    password: "", confirmPassword: ""
}
const ResetPassword = (match) => {
    const theme = useTheme()
    const styles = {
        formCont: {
            marginTop: "5em",
            maxWidth: "500px",
            marginBottom: "5em"
        },
        contPaper: {
            // backgroundColor: theme.palette.primary.light,
            padding: "1.5em",
        },
        titlePaper: {

            textAlign: "center",
            alignItems: "center",
            backgroundColor: theme.palette.primary.dark,
            padding: "0.5em 0 0.5em 0",
            color: "#ffc",
            fontWeight: 600
        }
    }
    const [showPassword1, setshowPassword1] = useState(false);
    const [showPassword2, setshowPassword2] = useState(false);
    const [formData, setFormData] = useState(initialState)
    const alert = useSelector(state=>state.auth.alert)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const location = useLocation()
    const params = useParams()
    
    useEffect(()=>{
        if(alert.msg){
            if(alert.msg==="Password reset successfully, you can close this page and login now with new password!"){
                navigate("/login")
            }
        }
    },[alert])
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Password reset",params.code)
        dispatch(asyncresetPassword({code:params.code,...formData}))
    }

    const handleClickShowPassword1 = () => {
        setshowPassword1(prevState => !prevState)
    }

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleClickShowPassword2 = () => {
        setshowPassword2(prevState => !prevState)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    

    return (
        <Grow in>
            <Container sx={styles.formCont}>
                <Alert />
                <Box>
                    <Paper sx={styles.contPaper}>
                        <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                            <Grid container sx={styles.formContainer} spacing={3} justifyContent="center">
                                <Grid item xs={12} sm={12}>
                                    <Paper sx={styles.titlePaper}>
                                        <Typography variant="h3" >
                                            Reset Password
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={5} sx={{ textAlign: "center" }}>
                                    <img src={ResetPasswordImg} alt="Reset Password" width="70%" />
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <Grid container spacing={2} sx={{padding:"1em"}}>
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
                                                                {showPassword1 ? <Visibility /> : <VisibilityOff />}
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
                                                                {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    labelwidth={170}
                                                />
                                                <FormHelperText required variant="outlined" children="Must be same as password above" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12} sx={{ textAlign: "center" }}>
                                            <Button type="submit" variant="contained" color="primary">
                                                Reset Password
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>



                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </Grow >
    )
}

export default ResetPassword