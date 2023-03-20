import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, ImageList, ImageListItem, Paper, Typography, useTheme } from "@mui/material"
import { useMapEvents, MapContainer, Marker, Popup, TileLayer, Polyline, Polygon } from "react-leaflet"
import { useEffect, useState } from "react"
import L from 'leaflet'
import { useDispatch } from "react-redux";
import { asyncCancelParkingSlot } from "../../state";

const BookedSlotCardAdmin = ({ id, name, charges, startTime, endTime, vehicleType, bookerName, vehicleNo, cancellable, address, carImage }) => {
    const theme = useTheme()
    const styles = {
        dialog: {
            padding: "2em"
        }
    }

    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [position, setPosition] = useState([19.2, 73.2])
    const [zoomLvl, setZoomLvl] = useState(13)
    const dispatch = useDispatch()

    const handleClose = () => {
        console.log("dialog closed")
        setOpen(false)
    }

    const handleShowDetails = () => {
        setOpen(true)
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


    return (
        <>
            <Card sx={{ maxWidth: 320, minHeight: 300 }}>
                <CardContent >
                    <Grid container spacing={2} alignItems="center" justifyContent="end" sx={{ padding: "0.3em" }}>
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


                        <Grid item xs={12}>
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
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleShowDetails} fullWidth>Show Details</Button>
                        </Grid>
                        {
                            cancellable ? (
                                <Grid item xs={12}>
                                    <Button variant="contained" color="warning" onClick={() => setOpen2(true)} fullWidth>Cancel Booking</Button>
                                </Grid>
                            ) : null
                        }

                    </Grid>


                </CardActions>
            </Card>
            <Dialog fullWidth onClose={handleClose} open={open} sx={styles.dialog}>
                <Grid container sx={{ padding: "1em" }} alignItems="center" justifyContent="center">
                    <Grid item sm={12}>
                        <Paper sx={{ backgroundColor: theme.palette.primary.dark, color: "white", borderRadius: "10px", padding: "1em", margin: "auto", boxShadow: "10px 5px 5px gray" }}>
                            <Grid sx={styles.dialog} container spacing={2} alignItems="center" >
                                <Grid item xs={12} sm={carImage?8:12}>
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
                                        <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                                            Booker Name:
                                        </Grid>
                                        <Grid item xs={8}>
                                            {bookerName}
                                        </Grid>
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
                                {
                                    carImage ? (
                                        <Grid item xs={12} sm={4}>
                                            <img src={carImage}
                                                srcSet={carImage}
                                                alt="Image title"
                                                loading="lazy"
                                                width="100%"
                                            />
                                            {/* <ImageList sx={{ width: 500, height:170,margin:"auto" }} cols={1} rowHeight={160}>
                                        <ImageListItem  key={0}>
                                                
                                        </ImageListItem>
                                    </ImageList> */}
                                        </Grid>
                                    ) : null
                                }



                            </Grid>
                        </Paper>

                    </Grid>
                    <Grid item sm={7}>
                    </Grid>
                </Grid>

            </Dialog>
        </>
    )
}

export default BookedSlotCardAdmin