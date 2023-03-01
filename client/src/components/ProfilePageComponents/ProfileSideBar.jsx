import { Avatar, Grid, Paper, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import CallIcon from '@mui/icons-material/Call';

const ProfileSideBar = () => {
    const styles = {
        sidebarPaper: {
            flexGrow: 1,
            padding: "1em",
            backgroundColor: "#E8F6EF"
        },
        sidebarInnerGrid: {
            height: "30em"
        },
        largeAvatar: {
            margin: "auto",
            width: "100px",
            height: "100px"
        },
        centerImg:{
            margin:"auto"
        },
        fullNameCont: {
            fontWeight: 700,
            fontSize: "1.2em",
            textAlign: "center"
        },
        userNameCont: {
            color: "blue",
            fontWeight: 600,
            textAlign:"center"
        },
    }

    const user = useSelector(state=>state.auth.user)
    return (
        <Paper sx={styles.sidebarPaper}>
            <Grid container sx={styles.sidebarInnerGrid} spacing={1}>
                <Grid item xs={12} sx={styles.centerImg}>
                    <Avatar src={user?.profilePic} sx={styles.largeAvatar} alt={user?.userName}>
                        {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                    </Avatar>
                </Grid>
                <Grid item xs={12} sx={{...styles.fullNameCont,...styles.centerImg}}>
                    <Typography variant="body1" sx={{fontWeight:"bold"}}>
                        {user.firstName} {user.lastName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{...styles.userNameCont,...styles.centerImg}}>

                    <Typography variant="body1">
                        @{user.userName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{...styles.userNameCont,...styles.centerImg}}>

                    <Typography variant="body1">
                        {user.email}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{...styles.userNameCont,...styles.centerImg}}>
                    <Grid container justifyContent="start">
                        <Grid item xs={2}>
                            <CallIcon/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1">
                                9292929292
                            </Typography>
                        </Grid>
                    </Grid>
                    
                    
                </Grid>

            </Grid>
        </Paper>
    )
}

export default ProfileSideBar