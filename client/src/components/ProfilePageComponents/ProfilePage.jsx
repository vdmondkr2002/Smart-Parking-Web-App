import { Grow, Conta, Paper, Grid, Typography, AppBar, Tabs, Tab } from "@mui/material";
import Alert from "../../Utils/Alert";
import { Box, Container } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import ProfileSideBar from "./ProfileSideBar";
import { useEffect, useState } from "react";
import { asyncgetBookedSlots, clearFreeParkingLots } from "../../state";
import BookedSlotCard from "./BookedSlotCard";
import dayjs from 'dayjs'
import { MapContainer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const theme = useTheme()
    const styles = {
        mainCont: {
            marginTop: "5em",
            width: "auto"
        },
        paper: {
            padding: "1em",
            height: "auto"
        },
        parent: {
            height: "100%",
        },
        title: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            height: "auto",
            backgroundColor: theme.palette.primary.dark,
            padding: "0.5em 0 0.5em 0",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase"
        },
        boxPadding: {
            "@media (max-width : 500px)": {
                padding: "0.2em",
            }
        }
    }

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3} sx={styles.boxPadding} >
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()
    const bookedTimeSlots = useSelector(state => state.auth.bookedTimeSlots)
    const dispatch = useDispatch()
    const [position, setPosition] = useState([19.2,73.2])
    const [tabValue, setTabValue] = useState(0)
    const [foundCurrLoc, setFoundCurrLoc] = useState(false)

    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "admin") {
                navigate("/admindb")
            }
        }
    }, [user])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords.accuracy)
                 setPosition([position.coords.latitude,position.coords.longitude])
            }, () => {
                console.log("Not able to locate")
            });
        }
        dispatch(asyncgetBookedSlots())
        dispatch(clearFreeParkingLots())
    }, [])

    const handleChangeTabs = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setTabValue(index);
    };

    const a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }


    return (
        <Grow in>
            <Container sx={styles.mainCont}>
                <Alert />
                <Paper sx={styles.paper}>
                    <Grid sx={styles.parent} container spacing={2}>
                        <Grid item xs={12}>
                            <Paper sx={styles.title}>
                                <Typography variant="h6">
                                    Hello, {user.userName}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item sm={3} xs={12} sx={styles.mainProfile}>
                            <ProfileSideBar />
                        </Grid>
                        <Grid item sm={9} xs={12} sx={styles.mainProfile}>
                            <AppBar position="static" color="default">
                                <Tabs value={tabValue} onChange={handleChangeTabs} indicatorColor="primary" textColor="primary"
                                    variant="fullWidth" aria-label="full width tabs">
                                    <Tab style={{ overflow: "visible" }} label="Active Bookings" {...a11yProps} />
                                    <Tab style={{ overflow: "visible" }} label="Past Bookings" {...a11yProps} />
                                </Tabs>
                            </AppBar>
                            <TabPanel value={tabValue} index={0} dir={theme.direction}>
                                <Grid container sx={styles.slotsCont} spacing={3}>
                                        {
                                            bookedTimeSlots.filter(slot => slot.endTime.valueOf() >= Date.now()).map(slot => (
                                                <Grid item xs={12} sm={4}>
                                                    <BookedSlotCard startTime={dayjs(slot.startTime)} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} address={slot.parkingLot.address} currLoc={position} vehicleNo={slot.vehicleNo}/>
                                                </Grid>

                                            ))
                                        }
                                    </Grid>
                                
                            </TabPanel>
                            <TabPanel value={tabValue} index={1} dir={theme.direction} >
                                
                                <Grid container sx={styles.slotsCont} spacing={3}>
                                    {
                                        bookedTimeSlots.filter(slot => slot.endTime.valueOf() < Date.now()).map(slot => (
                                            <Grid item xs={12} sm={4}>
                                                <BookedSlotCard startTime={dayjs(slot.startTime)} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo}/>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

        </Grow>
    )
}

export default ProfilePage;