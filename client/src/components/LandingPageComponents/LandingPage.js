import {Avatar, Box, Button, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {Link as RouterLink} from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import mainImage from '../../images/landingImg.svg'
import heroImage from '../../images/smart-parking-hero-removebg.png'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import Alert from "../../Utils/Alert";

const style = {
    box1: {
        bgcolor: 'red',
        boxShadow: 1,
        borderRadius: 1,
        p: 2,
        minWidth: 300,
    },
    bgImg: {
        paddingTop: "4em",
        // maxHeight:"100vh",
        backgroundImage: `url(${mainImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1800px',
        backgroundPosition: '90%-25%',
        backgroundColor: "#666",
        backgroundBlendMode: "multiply",
        marginTop: "5em",

    },
    heroLeft: {
        padding: "2em",
        gap: "2em"
    },
    heroImage: {
        maxWidth: "90%"
    },
    featureCont:{
        padding:"2em"
    },
    linkName: {
        color: "black",
        transition: "0.5s",
        paddingTop:"0.3em",
        paddingX:"1em",
        "&:hover": {
            color: "#E2F0F9",
            textShadow: "0 0 5px #E2F0F9",
        },
        textDecoration:'none'
    },
}
const LandingPage = () => {
    const theme = useTheme()
    const user = useSelector(state => state.auth.user)

    const navigate = useNavigate()


    useEffect(() => {
        if (user._id) {
            if(user.role==="admin"){
                navigate("/admindb")
            }else
                navigate("/home")
        }
    }, [user])
    return (
        <Paper sx={style.bgImg}>
            <Alert/>
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <Grid container sx={style.heroLeft}>
                        <Grid item xs={8}>
                            <Typography sx={{ fontWeight: "bold" }} variant='h1' component='h1' >Bring everyone together to build better products</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant='h5' component='h5'>Manage makes it simple for software teams to plan day-to-day tasks while keeping the larger team goals in view.</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Button variant='contained' sx={{ padding: "1em", borderRadius: 8 }}><Link
                                        to="/"
                                        component={RouterLink}
                                        key="Home"
                                        color="inherit"
                                        sx={style.linkName}
                                    >
                                        Get Started
                                    </Link></Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Box component="img" sx={style.heroImage} alt="parking image" src={heroImage} />
                </Grid>
            </Grid>
            <hr style={{borderTop: "10px solid #666",borderRadius: "5px",width:"50%"}}/>
            <Grid container sx={style.featureCont}>
                <Grid item sm={6} xs={12}>
                    <Grid container sx={style.heroLeft}>
                        <Grid item xs={8}>
                            <Typography sx={{ fontWeight: "bold" }} variant='h2' component='h2' >What's different about Manage?</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant='h5' component='h5'>Manage provides all the functionality your team needs, without the complexity. Our software is tailor-made for modern digital product teams.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={6} xs={12} sx={style}>
                    <List  sx={{ width: '100%', maxWidth: "90%", bgcolor: '#777' }}>
                        <ListItem alignItems="flex-start" sx={{marginBottom:"1em"}}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg">
                                    01
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h3" sx={{fontWeight:"bold"}}>
                                        Track company-wide progress
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        See how your day-to-day tasks fit into the wider vision. Go from tracking progress at the milestone level all the way down to the smallest of details. Never lose sight of the bigger picture again.
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start" sx={{marginBottom:"1em"}}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg">
                                    01
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h3" sx={{fontWeight:"bold"}}>
                                       Advanced built-in reports
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        Set internal delivery estimates and track progress toward company goals. Our customisable dashboard helps you build out the reports you need to keep key stakeholders informed.
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider variant="fullWidth" component="li" />
                        
                        <ListItem alignItems="flex-start" sx={{marginBottom:"1em"}}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg">
                                    01
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h3" sx={{fontWeight:"bold"}}>
                                            Everything you need in one place
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        Stop jumping from one service to another to communicate, store files, track tasks and share documents. Manage offers an all-in-one team productivity solution.
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default LandingPage;