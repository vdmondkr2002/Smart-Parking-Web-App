import { Avatar, CircularProgress, Grid, IconButton, Paper, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import * as faceapi from 'face-api.js'
import canvas from 'canvas'
import CallIcon from '@mui/icons-material/Call';
import Compress from 'compress.js'
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useEffect, useRef, useState } from "react";
import { asyncsetProfilePic, setAlert, setInProgress2, setUserProfilePic } from "../../state";

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
        centerImg: {
            margin: "auto"
        },
        fullNameCont: {
            fontWeight: 700,
            fontSize: "1.2em",
            textAlign: "center"
        },
        userNameCont: {
            color: "blue",
            fontWeight: 600,
            textAlign: "center"
        },
        label: {
            display: "flex",
            justifyContent: "center",
        },
        camIcon: {
            padding: "8px"
        },
    }
    const imgInput = useRef(null);
    const compress = new Compress()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const inProgress2 = useSelector(state => state.auth.inProgress2)
    const alert = useSelector(state => state.auth.alert)
    const [selectedImg, setSelectedImg] = useState('')

    useEffect(() => {
        if (alert.msg === "Profile image updated succesfully") {
            dispatch(setUserProfilePic(selectedImg))
        }
    }, [alert])
    const handleUploadClick = async (e) => {
        console.log(e)
        const imgFile = e.target.files[0]
        console.log(imgFile)

        if (!["image/png", "image/jpeg"].includes(imgFile.type)) {
            dispatch(setAlert({ msg: "Only jpg/jpeg/png file allowed to upload", type: "error" }))
            return
        }
        dispatch(setInProgress2(true))
        const imageData = await compress.compress([imgFile], { size: 0.2, quality: 0.5 })
        const compressedImg = imageData[0].prefix + imageData[0].data;
        const testImg = await canvas.loadImage(compressedImg)
        const myCanvas = canvas.createCanvas(200, 200)
        const ctx = myCanvas.getContext('2d')
        ctx.drawImage(testImg, 0, 0, 200, 200)
        console.log(testImg)
        // console.log(myCanvas instanceof HTMLCanvasElement)
        console.log(myCanvas instanceof HTMLCanvasElement)
        const detections = await faceapi.detectSingleFace(myCanvas).withFaceLandmarks()
        console.log(detections)
        
        if (detections === undefined) {
            dispatch(setAlert({ msg: "Please select a photo with face clearly visible", type: "error" }))
            dispatch(setInProgress2(false))
            return
        }
        // console.log(compressedImg)
        setSelectedImg(compressedImg)
        dispatch(asyncsetProfilePic({ selectedImg: compressedImg }))
        
    }
    return (
        <Paper sx={styles.sidebarPaper}>
            <Grid container sx={styles.sidebarInnerGrid} spacing={1} justifyContent="center">


                {
                    inProgress2 ? (
                        <>
                        <Grid item xs={12} sx={styles.centerImg}>
                            <Avatar sx={styles.largeAvatar} alt={user?.userName}>
                                <CircularProgress/>
                            </Avatar>
                        </Grid>
                        <Grid item sx={{ margin: "auto", position: "relative", top: "-50px" }}>
                        <IconButton color="primary" sx={styles.camIcon} aria-label="Upload picture" component="label">
                            {/* <input hidden accept="image/*" type="file" id="image-element" onChange={handleUploadClick} ref={imgInput} /> */}
                            <PhotoCamera fontSize="large" />
                        </IconButton>
                    </Grid>
                    </>
                    ) : (
                        <>
                            <Grid item xs={12} sx={styles.centerImg}>
                                <Avatar src={user?.profilePic} sx={styles.largeAvatar} alt={user?.userName}>
                                    {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                                </Avatar>

                            </Grid>
                            <Grid item sx={{ margin: "auto", position: "relative", top: "-50px" }}>
                                <IconButton color="primary" sx={styles.camIcon} aria-label="Upload picture" component="label">
                                    <input hidden accept="image/*" type="file" id="image-element" onChange={handleUploadClick} ref={imgInput} />
                                    <PhotoCamera fontSize="large" />
                                </IconButton>
                            </Grid>
                        </>
                        
                    )}

                <Grid item xs={12} sx={{ ...styles.fullNameCont, ...styles.centerImg }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {user.firstName} {user.lastName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ ...styles.userNameCont, ...styles.centerImg }}>

                    <Typography variant="body1">
                        @{user.userName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ ...styles.userNameCont, ...styles.centerImg }}>

                    <Typography variant="body1">
                        {user.email}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ ...styles.userNameCont, ...styles.centerImg }}>
                    <Grid container justifyContent="start">
                        <Grid item xs={2}>
                            <CallIcon />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1">
                                {user.mobileNo}
                            </Typography>
                        </Grid>
                    </Grid>


                </Grid>

            </Grid>
        </Paper>
    )
}

export default ProfileSideBar