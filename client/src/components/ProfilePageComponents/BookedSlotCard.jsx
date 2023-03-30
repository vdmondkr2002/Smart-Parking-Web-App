import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Card, CardActions, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Typography, useTheme } from "@mui/material"
import { useMapEvents, MapContainer, Marker, Popup, TileLayer, Polyline, Polygon } from "react-leaflet"
import { useEffect, useState } from "react"
import dayjs from 'dayjs'
import L from 'leaflet'
import { useDispatch, useSelector } from "react-redux";
import { asyncCancelParkingSlot } from "../../state";

const BookedSlotCard = ({ active,id, name, charges, type, startTime, endTime, vehicleType, bookerName, lat, lng, currLoc, address, vehicleNo, cancellable }) => {
    const theme = useTheme()
    const styles = {
        dialog: {
            padding: "2em"
        }
    }

    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const inProgress2 = useSelector(state => state.auth.inProgress2)
    const [position, setPosition] = useState([19.2, 73.2])
    const [zoomLvl, setZoomLvl] = useState(13)
    const dispatch = useDispatch()
    const handleClose = () => {
        console.log("dialog  closed")
        setOpen(false)
    }

    const handleShowDetails = () => {
        setOpen(true)
    }
    const handleYesCancelDialog = () => {
        setOpen2(false)
        console.log("Slot  cancelled", id)
        dispatch(asyncCancelParkingSlot({ id: id }))
    }
    const handleNoCancelDialog = () => {
        setOpen2(false)
    }

    const handleClickCancelBtn = ()=>{
        setOpen2(true)
    }
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const MyMapComponent = () => {
        const map = useMapEvents({

        })

        useEffect(() => {
            console.log("routing")
            L.Routing.control({
                waypoints: [
                    L.latLng(currLoc[0], currLoc[1]),
                    L.latLng(lat, lng)
                ], createMarker: () => null

            }).addTo(map)

        }, [map])
    }

    return (
        <>
            <Card sx={{ maxWidth: 320, minHeight: 300, margin: "auto" }}>
                <CardContent >
                    <Grid container spacing={2} alignItems="center" justifyContent="end" sx={{ padding: "0.3em" }}>
                        <Grid item textAlign="end" xs={12}>
                            <Chip label={`${type}`} />
                        </Grid>
                        {name ? (
                            <>
                                <Grid item xs={2}>
                                    <LocationOnIcon fontSize="large" />
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                                        {name}
                                    </Typography>
                                </Grid>
                            </>
                        ) : null}

                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Total Charges:
                        </Grid>
                        <Grid item xs={4}>
                            {charges}
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Vehicle Type:
                        </Grid>
                        <Grid item xs={4}>
                            {vehicleType}
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Vehicle Number:
                        </Grid>
                        {
                            vehicleNo ? (
                                <>

                                    <Grid item xs={4}>
                                        {vehicleNo}
                                    </Grid>
                                </>
                            ) : (
                                <>

                                    <Grid item xs={4}>

                                    </Grid>
                                </>
                            )
                        }

                        {
                            bookerName ? (
                                <>
                                    <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                                        Booker Name:
                                    </Grid>
                                    <Grid item xs={4}>
                                        {bookerName}
                                    </Grid>
                                </>
                            ) : null
                        }

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={2}>
                                    <AccessTimeIcon fontSize="large" />
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6">
                                        {startTime.format('D MMM hh:00 A')} - {endTime.format('D MMM hh:00 A')}
                                    </Typography>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleShowDetails} fullWidth>Show Details</Button>
                        </Grid>
                        {
                            cancellable && startTime.unix() * 1000 > Date.now() ? (
                                inProgress2 ? (
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="warning" startIcon={<CircularProgress size={20} sx={{ color: "yellow" }} />} fullWidth>Cancel Booking</Button>
                                    </Grid>

                                ) : (
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="warning" onClick={handleClickCancelBtn} fullWidth>Cancel Booking</Button>
                                    </Grid>
                                )

                            ) : null
                        }

                    </Grid>


                </CardActions>
            </Card>
            {active?(
            <Dialog maxWidth='lg' fullWidth onClose={handleClose} open={open} sx={styles.dialog}>
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item sm={active?5:12}>
                        <Paper sx={{ backgroundColor: theme.palette.primary.dark, color: "white", borderRadius: "10px", width: "80%", margin: "auto", boxShadow: "10px 5px 5px gray" }}>
                            <Grid sx={styles.dialog} container spacing={2} alignItems="center" >
                                <Grid item textAlign="end" xs={12}>
                                    <Chip color="secondary" label={`${type}`} />
                                </Grid>
                                <Grid item xs={2}>
                                    <LocationOnIcon fontSize="large" />
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                                        {name}
                                    </Typography>
                                </Grid>
                                <Grid item >
                                    {address}
                                </Grid>
                                <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                                    Time Slot For Booking:
                                </Grid>
                                <Grid item xs={8}>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <AccessTimeIcon fontSize="large" />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography variant="h6">
                                                {startTime.format('D MMM hh:00 A')}- {endTime.format('D MMM hh:00 A')}
                                            </Typography>

                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                                    Total Charges:
                                </Grid>
                                <Grid item xs={2} >
                                    {charges}
                                </Grid>
                                {/* <Grid item xs={6}></Grid> */}
                                <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                                    Vehicle Type:
                                </Grid>
                                <Grid item xs={2}>
                                    {vehicleType}
                                </Grid>
                                {/* <Grid item xs={6}></Grid> */}
                                <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                                    Vehicle Number:
                                </Grid>
                                {
                                    vehicleNo ? (
                                        <>

                                            <Grid item xs={4}>
                                                {vehicleNo}
                                            </Grid>
                                        </>
                                    ) : (
                                        <>

                                            <Grid item xs={4}>

                                            </Grid>
                                        </>
                                    )
                                }
                            </Grid>

                        </Paper>

                    </Grid>
                    {
                        active?(
                            <Grid item sm={7}>
                        <MapContainer style={{ height: "400px", width: "100%" }} center={position} zoom={zoomLvl} >

                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker icon={redIcon} position={currLoc}>
                                <Popup>
                                    You selected location
                                </Popup>
                            </Marker>
                            <Marker icon={greenIcon} position={[lat, lng]}>
                                <Popup>
                                    {name}
                                </Popup>
                            </Marker>
                            <MyMapComponent />
                        </MapContainer>
                    </Grid>
                        ):null
                    }
                    
                </Grid>

            </Dialog>):(
                <Dialog fullWidth onClose={handleClose} open={open} sx={styles.dialog}>
                <Grid container sx={{ padding: "1em" }} alignItems="center" justifyContent="center">
                    <Grid item sm={12}>
                        <Paper sx={{ backgroundColor: theme.palette.primary.dark, color: "white", borderRadius: "10px", padding: "1em", margin: "auto", boxShadow: "10px 5px 5px gray" }}>
                            <Grid sx={styles.dialog} container spacing={2} alignItems="center" >
                                <Grid item xs={12} sm={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        {name ? (
                                            <Grid item xs={10}>
                                                <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                                                    {name}
                                                </Typography>
                                            </Grid>
                                        ) : null}
                                        {
                                            name ? (
                                                <Grid item xs={10}>
                                                    <Typography component="div" fontWeight="bold" gutterBottom>
                                                        {address}
                                                    </Typography>
                                                </Grid>
                                            ) : null
                                        }
                                        <Grid item xs={3} sx={{ fontWeight: "bold" }}>
                                            Time Slot For Booking:
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container>
                                                <Grid item xs={2}>
                                                    <AccessTimeIcon fontSize="large" />
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant="h6">
                                                        {startTime.format('DD MMM hh:00 A')} - {endTime.format('DD MMM hh:00 A')}
                                                    </Typography>

                                                </Grid>
                                            </Grid>

                                        </Grid>
                                        <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                                            Total Charges:
                                        </Grid>
                                        <Grid item xs={2} >
                                            {charges}
                                        </Grid>
                                        {/* <Grid item xs={6}></Grid> */}
                                        <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                                            Vehicle Type:
                                        </Grid>
                                        <Grid item xs={2}>
                                            {vehicleType}
                                        </Grid>
                                        {/* <Grid item xs={6}></Grid> */}
                                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                                            Vehicle Number:
                                        </Grid>
                                        {
                                            vehicleNo ? (
                                                <>

                                                    <Grid item xs={4}>
                                                        {vehicleNo}
                                                    </Grid>
                                                </>
                                            ) : (
                                                <>

                                                    <Grid item xs={4}>

                                                    </Grid>
                                                </>
                                            )
                                        }
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Paper>

                    </Grid>
                    <Grid item sm={7}>
                    </Grid>
                </Grid>

            </Dialog>
            )}
            <Dialog maxWidth='lg' onClose={handleNoCancelDialog} open={open2} sx={styles.dialog}>
                <DialogTitle color="black" fontWeight="bold">Cancel Booking</DialogTitle>
                <DialogContent>
                    <DialogContentText fontWeight="bold" color="Highlight">
                        {type=="private"?
                        "Cancelling a slot will deduct 30% of your parking charge, Confirm Cancellation?":
                        "Confirm Cancellation of Slot?"
                            }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={handleNoCancelDialog}>No</Button>
                    <Button color="warning" variant="contained" onClick={handleYesCancelDialog}>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BookedSlotCard