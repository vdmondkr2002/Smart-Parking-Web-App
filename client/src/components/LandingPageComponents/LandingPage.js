import {Box, Button, Grid } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import mainImage from '../../images/landingImg.svg'
import { useNavigate } from 'react-router-dom'
const style = {
    box1:{
        bgcolor: 'red',
        boxShadow: 1,
        borderRadius: 1,
        p: 2,
        minWidth: 300,
    },
    bgImg:{
        paddingTop:"4em",
        textAlign:"center",
        // maxHeight:"100vh",
        backgroundImage: `url(${mainImage})`,
        backgroundSize: "cover",
        backgroundColor: "#777",
        backgroundBlendMode: "multiply",
        
    },
}
const LandingPage = ()=>{
  const user = useSelector(state=>state.auth.user)

    const navigate = useNavigate()


    useEffect(()=>{
        if(!user._id){
            navigate("/login")
        }
    },[user])
    return (
        <div sx={style.bgImg}>
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <h2>Bring everyone together to build better products</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <p>Manage makes it simple for software teams to plan day-to-day tasks while keeping the larger team goals in view.</p>
                        </Grid>
                        <Grid item xs={12}>
                            <Button>Get Started</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default LandingPage;