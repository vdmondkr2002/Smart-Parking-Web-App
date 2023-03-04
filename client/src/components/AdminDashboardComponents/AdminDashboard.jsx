import { Button, Grid, Grow, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import AddBoxIcon from '@mui/icons-material/AddBox';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import Alert from "../../Utils/Alert";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import newParkingImg from '../../images/add_new_parking.svg'
import analyzeParkingImg from '../../images/analyze_parkings_1.svg'

const AdminDashboard = ()=>{
    const styles = {
        buttonsCont:{
            width:"auto",
            marginTop:"5em"
        },
        image: {
            height: "300px",
            width: "200px",
            background: "rgb(234,231,220)",
            "@media (max-width : 700px)": {
              height: "250px",
              width: "250px",
            },
          },
    }
    const user = useSelector(state=>state.auth.user)
    const navigate = useNavigate()
    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "user") {
                navigate("/home")
            }
        }
    }, [user])
    
    return (
        <Grow in>
            <Container sx={styles.buttonsCont}>
                    <Alert/>
                    <Grid container spacing={2} alignItems="center" justifyItems="center" sx={{padding:"1em"}}>
                        <Grid item xs={6}>
                            <Button fullWidth component={RouterLink} sx={{padding:"1em",width:"80%"}} startIcon={<AddBoxIcon/>} variant="contained"  to="/addParkingLot">
                                
                                <Typography variant="h6">
                                    Add Parking Lot
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <img src={newParkingImg} alt="add parking" width="100%" sx={styles.image} loading="lazy"/>
                        </Grid>
                        <Grid item xs={6}>
                            <img src={analyzeParkingImg} alt="view history" width="100%" sx={styles.image} loading="lazy"/>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth component={RouterLink} sx={{padding:"1em"}} startIcon={<EqualizerIcon/>} variant="contained"  to="/analysis">
                                
                                <Typography variant="h6">
                                    Analyze History
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                    
            </Container>
        </Grow>
    )
}
export default AdminDashboard