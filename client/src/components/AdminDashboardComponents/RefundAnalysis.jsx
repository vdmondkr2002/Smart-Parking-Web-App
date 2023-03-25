import { AppBar, Container, Grid, Grow, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
import { Box } from "@mui/system";
import { useEffect, useReducer, useState } from "react";
import { asyncgetCancelledSlots } from "../../state";
import dayjs from 'dayjs'
import Alert from "../../Utils/Alert"
import BookedSlotCardAdmin from "./BookedSlotCardAdmin";
import CustomCircularProgress from "../../Utils/CustomCircularProgress";

const RefundAnalysis = () => {
    const theme = useTheme()
    const styles = {
        mainCont: {
            marginTop: "5em",
            width: "auto",
            marginBottom: "5em",
            padding: "2em",
        },
        slotsCont: {
            padding: "1em"
        }
    }
    const dispatch = useDispatch()
    const bookedTimeSlots = useSelector(state => state.auth.bookedTimeSlots)
    const inProgress1 = useSelector(state => state.auth.inProgress1)
    const [tabValue, setTabValue] = useState(0)
    const [tabValueInner, setTabValueInner] = useState(0)
    const handleChangeTabValue = (e, newValue) => {
        setTabValue(newValue)
    }
    const handleChangeTabValueInner = (e, newValue) => {
        setTabValueInner(newValue)
    }
    useEffect(() => {
        console.log("getting cancelled slots")
        dispatch(asyncgetCancelledSlots())
    }, [])
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
                    <Tabs value={tabValue} onChange={handleChangeTabValue} indicatorColor="primary" textColor="primary"
                        variant="fullWidth" aria-label="full width tabs">
                        <Tab style={{ overflow: "visible" }} label="Refund Pending" {...a11yProps} />
                        <Tab style={{ overflow: "visible" }} label="Refund Paid" {...a11yProps} />
                    </Tabs>

                </AppBar>
                <TabPanel value={tabValue} index={0} dir={theme.direction}>
                {
                    inProgress1 ? (
                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                            <Grid item>

                                <CustomCircularProgress inProgress={inProgress1}/>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            {/* <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center"> */}
                            <AppBar position="static" color="default">
                                <Tabs value={tabValueInner} onChange={handleChangeTabValueInner} indicatorColor="primary" textColor="primary"
                                    variant="fullWidth" aria-label="full width tabs">
                                    <Tab style={{ overflow: "visible" }} label="Admin Cancelled" {...a11yProps} />
                                    <Tab style={{ overflow: "visible" }} label="User Cancelled" {...a11yProps} />
                                </Tabs>

                            </AppBar>

                            {
                                bookedTimeSlots.filter(slot => !slot.refunded).length > 0 ? (
                                    <>
                                        <TabPanel value={tabValueInner} index={0} dir={theme.direction}>
                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                {

                                                    bookedTimeSlots.filter(slot => !slot.refunded && slot.adminCancelled).map(slot => (
                                                        <Grid item xs={12} sm={4}>
                                                            <BookedSlotCardAdmin id={slot._id} bookerName={slot.booker.name} name={slot.parkingLot.name} charges={slot.charges} refundAmount={slot.adminCancelled ? slot.charges : slot.charges * 0.7} refunded={false} startTime={dayjs(slot.startTime)} endTime={dayjs(slot.endTime)} vehicleNo={slot.vehicleNo} vehicleType={slot.vehicleType} address={slot.address} />
                                                        </Grid>
                                                    ))

                                                }
                                            </Grid>
                                        </TabPanel>
                                        <TabPanel value={tabValueInner} index={1} dir={theme.direction}>
                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                {

                                                    bookedTimeSlots.filter(slot => !slot.refunded && !slot.adminCancelled).map(slot => (
                                                        <Grid item xs={12} sm={4}>
                                                            <BookedSlotCardAdmin id={slot._id} bookerName={slot.booker.name} name={slot.parkingLot.name} charges={slot.charges} refundAmount={slot.adminCancelled ? slot.charges : slot.charges * 0.7} refunded={false} startTime={dayjs(slot.startTime)} endTime={dayjs(slot.endTime)} vehicleNo={slot.vehicleNo} vehicleType={slot.vehicleType} address={slot.address} />
                                                        </Grid>
                                                    ))

                                                }
                                            </Grid>
                                        </TabPanel>
                                    </>
                                ) : (
                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                        <Grid item>
                                            <Typography variant="h4" fontWeight="bold">No Pending Refunds</Typography>
                                        </Grid>
                                    </Grid>
                                )
                            }
                            </>
                    )
                }
                </TabPanel>
                <TabPanel value={tabValue} index={1} dir={theme.direction}>
                {
                    inProgress1 ? (
                        
                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                            <Grid item>

                                <CustomCircularProgress inProgress={inProgress1}/>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <AppBar position="static" color="default">
                                <Tabs value={tabValueInner} onChange={handleChangeTabValueInner} indicatorColor="primary" textColor="primary"
                                    variant="fullWidth" aria-label="full width tabs">
                                    <Tab style={{ overflow: "visible" }} label="Admin Cancelled" {...a11yProps} />
                                    <Tab style={{ overflow: "visible" }} label="User Cancelled" {...a11yProps} />
                                </Tabs>

                            </AppBar>
                            {
                                bookedTimeSlots.filter(slot => slot.refunded).length > 0 ? (
                                    <>
                                        <TabPanel value={tabValueInner} index={0} dir={theme.direction}>
                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                {

                                                    bookedTimeSlots.filter(slot => slot.refunded && slot.adminCancelled).map(slot => (
                                                        <Grid item xs={12} sm={4}>
                                                            <BookedSlotCardAdmin id={slot._id} bookerName={slot.booker.name} name={slot.parkingLot.name} charges={slot.charges} refundAmount={slot.adminCancelled ? slot.charges : slot.charges * 0.7} refunded={true} startTime={dayjs(slot.startTime)} endTime={dayjs(slot.endTime)} vehicleNo={slot.vehicleNo} vehicleType={slot.vehicleType} address={slot.address} />
                                                        </Grid>
                                                    ))

                                                }
                                            </Grid>
                                        </TabPanel>
                                        <TabPanel value={tabValueInner} index={1} dir={theme.direction}>
                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                {

                                                    bookedTimeSlots.filter(slot => slot.refunded && !slot.adminCancelled).map(slot => (
                                                        <Grid item xs={12} sm={4}>
                                                            <BookedSlotCardAdmin id={slot._id} bookerName={slot.booker.name} name={slot.parkingLot.name} charges={slot.charges} refundAmount={slot.adminCancelled ? slot.charges : slot.charges * 0.7} refunded={true} startTime={dayjs(slot.startTime)} endTime={dayjs(slot.endTime)} vehicleNo={slot.vehicleNo} vehicleType={slot.vehicleType} address={slot.address} />
                                                        </Grid>
                                                    ))

                                                }
                                            </Grid>
                                        </TabPanel>
                                    </>
                                ) : (
                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                        <Grid item>
                                            <Typography variant="h4" fontWeight="bold">No Refunds Paid Till Now</Typography>
                                        </Grid>
                                    </Grid>
                                )
                            }
                            </>
                        
                    )
                }
                </TabPanel>
            </Container>
        </Grow>
    )
}

export default RefundAnalysis;