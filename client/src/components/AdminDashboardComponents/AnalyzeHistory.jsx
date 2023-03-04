import { AppBar, Container, FormControl, Grid, Grow, InputLabel, MenuItem, Paper, Select, Tab, Tabs, Typography, useTheme } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { asyncgetParkingLotHistory, asyncgetParkingLots, asyncgetUserHistory, asyncgetUsersName, clearBookedTimeSlots, clearParkingLotDetails } from "../../state"
import dayjs from 'dayjs'
import Alert from "../../Utils/Alert"
import BookedSlotCard from "../ProfilePageComponents/BookedSlotCard"
import { useNavigate } from "react-router-dom"
import LocationOn from "@mui/icons-material/LocationOn"
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const AnalyzeHistory = () => {
    const theme = useTheme()
    const styles = {
        mainCont: {
            marginTop: "5em",
            width: "auto",
            marginBottom: "5em",
            padding: "2em",
        },
        slotsCont:{
            padding:"1em"
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
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const usersName = useSelector(state => state.auth.usersName)
    const bookedTimeSlots = useSelector(state => state.auth.bookedTimeSlots)
    const parkingLotNames = useSelector(state => state.auth.parkingLotNames)
    const parkingLotDetails = useSelector(state => state.auth.parkingLotDetails)
    const user = useSelector(state => state.auth.user)
    const [userName, setUserName] = useState('')
    const [parkingLot, setParkingLot] = useState('')
    const [tabValueInner, setTabValueInner] = useState(0)
    const [tabValueOuter, setTabValueOuter] = useState(0)

    useEffect(() => {
        dispatch(asyncgetUsersName())
    }, [])

    useEffect(() => {
        dispatch(asyncgetParkingLots())
    }, [])
    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "user") {
                navigate("/home")
            }
        }
    }, [user])
    const handleChangeUser = (e) => {
        setUserName(e.target.value)
        dispatch(asyncgetUserHistory({ _id: e.target.value }))
    }
    const handleChangeParkingLot = (e) => {
        setParkingLot(e.target.value)
        dispatch(asyncgetParkingLotHistory({ _id: e.target.value }))
    }

    const handleChangeOuterTabs = (event, newValue) => {
        setTabValueOuter(newValue);
        dispatch(clearBookedTimeSlots())
        dispatch(clearParkingLotDetails())
        setUserName('')
        setParkingLot('')
    };
    const handleChangeInnerTabs = (event, newValue) => {
        setTabValueInner(newValue);
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
                <AppBar position="static" color="default">
                    <Tabs value={tabValueOuter} onChange={handleChangeOuterTabs} indicatorColor="primary" textColor="primary"
                        variant="fullWidth" aria-label="full width tabs">
                        <Tab style={{ overflow: "visible" }} label="Analysis By User" {...a11yProps} />
                        <Tab style={{ overflow: "visible" }} label="Analysis By Parking Lot" {...a11yProps} />
                    </Tabs>
                </AppBar>
                <TabPanel value={tabValueOuter} index={0} dir={theme.direction}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select a User</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={userName}
                            label="Select a User"
                            onChange={handleChangeUser}
                        >
                            {
                                usersName.map((user) => (
                                    <MenuItem value={user._id}>{user.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    {
                        bookedTimeSlots.length > 0 ? (
                            <>
                                <AppBar position="static" color="default">
                                    <Tabs value={tabValueInner} onChange={handleChangeInnerTabs} indicatorColor="primary" textColor="primary"
                                        variant="fullWidth" aria-label="full width tabs">
                                        <Tab style={{ overflow: "visible" }} label="Active Bookings" {...a11yProps} />
                                        <Tab style={{ overflow: "visible" }} label="Past Bookings" {...a11yProps} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={tabValueInner} index={0} dir={theme.direction}>

                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                        {
                                            bookedTimeSlots.length > 0 ? (
                                                bookedTimeSlots.filter(slot => slot.endTime.valueOf() >= Date.now()).map(slot => (
                                                    <Grid item xs={12} sm={4}>
                                                        <BookedSlotCard startTime={dayjs(slot.startTime)} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} bookerName={null} name={slot.parkingLot.name} charges={slot.charges} />
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Grid item>

                                                    <Typography variant="h4" fontWeight="bold">No Active Bookings </Typography>
                                                </Grid>
                                            )

                                        }
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tabValueInner} index={1} dir={theme.direction}>
                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                        {
                                            bookedTimeSlots.length > 0 ? (
                                                bookedTimeSlots.filter(slot => slot.endTime.valueOf() < Date.now()).map(slot => (
                                                    <Grid item xs={12} sm={4}>
                                                        <BookedSlotCard startTime={dayjs(slot.startTime)} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} bookerName={null} name={slot.parkingLot.name} charges={slot.charges} />
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Grid item>
                                                    <Typography variant="h4" fontWeight="bold">No Past Bookings </Typography>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                </TabPanel>
                            </>
                        ) : (
                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                <Grid item>

                                    <Typography variant="h4" fontWeight="bold">No Slots Booked Till Now</Typography>
                                </Grid>
                            </Grid>
                        )
                    }
                </TabPanel>
                <TabPanel value={tabValueOuter} index={1} dir={theme.direction}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select a Parking Lot</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={parkingLot}
                            label="Select a Parking Lot"
                            onChange={handleChangeParkingLot}
                        >
                            {
                                parkingLotNames.map((lot) => (
                                    <MenuItem value={lot._id}>{lot.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    {
                        parkingLotDetails.name ? (
                            <Paper sx={{ backgroundColor: theme.palette.primary.dark, padding: "1em", marginTop: "1em", borderRadius: "10px", color: "white" }}>
                                <Grid container spacing={1} justifyContent="center" alignItems="center">
                                    <Grid item sm={6}>
                                        <LocationOn sx={{ display: "inline", marginX: "5px" }} fontSize="large" />
                                        <Typography sx={{ display: "inline" }} variant="h5" component="p">{parkingLotDetails.address}</Typography>
                                    </Grid>
                                    <Grid item sm={2}>
                                        <DirectionsCarIcon sx={{ display: "inline", marginX: "5px" }} fontSize="large" />
                                        <Typography sx={{ display: "inline", fontWeight: "bold" }} variant="h5" component="p" >Car slots:</Typography>
                                        <Typography sx={{ display: "inline" }} variant="h5" component="p">{parkingLotDetails.noOfCarSlots}</Typography>
                                    </Grid>
                                    <Grid item sm={2}>
                                        <TwoWheelerIcon sx={{ display: "inline", marginX: "10px" }} fontSize="large" />
                                        <Typography sx={{ display: "inline", fontWeight: "bold" }} variant="h5" component="p" >Bike slots:</Typography>
                                        <Typography sx={{ display: "inline" }} variant="h5" component="p">{parkingLotDetails.noOfBikeSlots}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <CurrencyRupeeIcon sx={{ display: "inline", marginX: "10px" }} fontSize="large" />
                                        <Typography sx={{ display: "inline", fontWeight: "bold" }} variant="h5" component="p" >Bike Parking Charges:</Typography>
                                        <Typography sx={{ display: "inline" }} variant="h5" component="p">{parkingLotDetails.parkingChargesBike}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <CurrencyRupeeIcon sx={{ display: "inline", marginX: "10px" }} fontSize="large" />
                                        <Typography sx={{ display: "inline", fontWeight: "bold" }} variant="h5" component="p" >Car Parking Charges:</Typography>
                                        <Typography sx={{ display: "inline" }} variant="h5" component="p">{parkingLotDetails.parkingChargesCar}</Typography>
                                    </Grid>
                                </Grid>

                            </Paper>
                        ) : null
                    }
                    {
                        bookedTimeSlots.length > 0 ? (
                            <>
                                <AppBar position="static" color="default">
                                    <Tabs value={tabValueInner} onChange={handleChangeInnerTabs} indicatorColor="primary" textColor="primary"
                                        variant="fullWidth" aria-label="full width tabs">
                                        <Tab style={{ overflow: "visible" }} label="Active Bookings" {...a11yProps} />
                                        <Tab style={{ overflow: "visible" }} label="Past Bookings" {...a11yProps} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={tabValueInner} index={0} dir={theme.direction}>
                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">

                                        {
                                            bookedTimeSlots.filter(slot => slot.endTime >= Date.now()).length > 0 ? (
                                                bookedTimeSlots.filter(slot => slot.endTime >= Date.now()).map(slot => (
                                                    <Grid item xs={12} sm={4}>
                                                        <BookedSlotCard startTime={dayjs(slot.startTime)} endTime={dayjs(slot.endTime)} vehicleType={slot.vehicleType} name={null} bookerName={slot.booker.name} charges={slot.charges} />
                                                    </Grid>

                                                ))
                                            ) : (

                                                <Grid item>
                                                    <Typography variant="h4" fontWeight="bold">No Active Bookings </Typography>
                                                </Grid>

                                            )
                                        }
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tabValueInner} index={1} dir={theme.direction}>
                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">

                                        {
                                            bookedTimeSlots.filter(slot => slot.endTime < Date.now()).length > 0 ? (
                                                bookedTimeSlots.filter(slot => slot.endTime < Date.now()).map(slot => (
                                                    <Grid item xs={12} sm={4}>
                                                        <BookedSlotCard startTime={dayjs(slot.startTime)} endTime={dayjs(slot.endTime)} vehicleType={slot.vehicleType} name={null} bookerName={slot.booker.name} charges={slot.charges} />
                                                    </Grid>

                                                ))
                                            ) : (
                                                <Grid item>

                                                    <Typography variant="h4" fontWeight="bold">No Past Bookings </Typography>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                </TabPanel>
                            </>
                        ) : (
                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                <Grid item>

                                    <Typography variant="h4" fontWeight="bold">No Slots Booked Till Now</Typography>
                                </Grid>
                            </Grid>
                        )
                    }
                </TabPanel>




            </Container>
        </Grow>
    )
}

export default AnalyzeHistory