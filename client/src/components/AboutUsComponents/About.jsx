import { useTheme } from "@emotion/react";
import { Container, Grid, Grow, Paper, Typography } from "@mui/material"
import { borderRadius } from "@mui/system";
import parkingImg from '../../images/about_parking.svg'
import Alert from "../../Utils/Alert";

const AboutUs = ()=>{
    const theme = useTheme()
    const styles ={
        mainCont:{
            
            marginTop: "5em",
            width: "auto",
            marginBottom:"5em",
            padding:"2em",
        },
        paper:{
            backgroundColor: theme.palette.primary.dark,
            // marginTop:"10em"
            borderRadius:"1em",
            boxShadow:"10px 5px 5px gray",
            maxWidth:"900px",
            margin:"auto",
            paddingY:"2em",
        }
    }
    return (
        <Grow in>
            <Container sx={styles.mainCont}>
                <Alert/>
                <Paper sx={styles.paper}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={7}>
                            <Grid container spacing={2} sx={{padding:"2em"}}>
                                <Grid item xs={12}>
                                    <Typography variant="h1" component="h1" sx={{fontWeight:"bold"}}>
                                        Smart Parker
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h4" component="p" sx={{fontSize:"20px",color:"white"}}>
                                        Our application aims to provide parking facility for Light motor vehicles. Here, the users will be able to book a 
                                        parking slot according to their convenience. Also, the parking space owners will be able to generate revenue from it. 
                                        The user and the parking space owner will get live location using GPS system. Moreover, the software will give UID 
                                        numbers to the parking spaces along with recommendation system using artificial intelligence and machine learning, 
                                        as well as KYC verification and a payment gateway for rental booking.
                                    </Typography>
                                
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <img src={parkingImg} width="100%" alt="About parking"/>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Grow>
    )
}

export default AboutUs;