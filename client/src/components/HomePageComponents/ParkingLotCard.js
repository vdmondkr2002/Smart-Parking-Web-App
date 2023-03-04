import { Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useState } from "react";
import ParkingSlot from "./ParkingSlot";
import { asyncBookSlot } from "../../state";
import { useDispatch } from "react-redux";
import { useMapEvents, MapContainer, Marker, Popup, TileLayer,Polyline,Polygon } from "react-leaflet"
import L from 'leaflet'
import ForwardIcon from '@mui/icons-material/Forward';
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ParkingLotCard = ({ vehicleType,startTime,endTime,name, noOfFreeSlots, charges, distance, id, freeSlots, engagedSlots, address, lat, lng ,currLoc}) => {
    const styles = {
        dialog:{
            padding:"2em"
        }
    }
    const [open, setOpen] = useState(false)
    const [parkingSlots,setParkingSlots] = useState([...freeSlots,...engagedSlots])
    const [engagedSllots,setEngagedSllots] = useState(engagedSlots)
    const [changed,setChanged] = useState('')
    const [prevChanged,setPrevChanged] = useState('')
    const [position,setPosition] = useState([(currLoc[0]+lat)/2,(currLoc[1]+lng)/2])
    const [map,setMap] = useState()
    const [zoomLvl,setZoomLvl] = useState(13)


    const dispatch = useDispatch()
    useEffect(()=>{
        setParkingSlots([...freeSlots,...engagedSlots])
        setParkingSlots(parkingSlots.sort())
        console.log(freeSlots)
    },[open])

    


    const MyMapComponent = ()=>{
        const map = useMapEvents({

        })

        useEffect(()=>{
            L.Routing.control({
                waypoints:[
                    L.latLng(currLoc[0],currLoc[1]),
                    L.latLng(lat,lng)
                ],createMarker:()=>null
                
            }).addTo(map)
            
        },[map])
    }

    const handleShowDetails = () => {
        console.log("clicked")
        console.log(id, freeSlots, engagedSlots, address, lat, lng)

        console.log(parkingSlots)
        setOpen(true)
    }

    const handleClose = () => {
        console.log("dialog closed")
        setChanged('')
        setOpen(false)
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

    const handleBookSlot = ()=>{
        console.log(changed,id,startTime,endTime,vehicleType)
        const data = {startTime:startTime.format('YYYY-MM-DD HH:00'), endTime: endTime.format('YYYY-MM-DD HH:00'), lotId:id,slotId:changed,vehicleType:vehicleType}
        console.log(data)
        dispatch(asyncBookSlot(data))
    }

    return (
        <>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
                <CardContent >
                    <Grid container spacing={2} alignItems="center" justifyContent="end">
                        <Grid item xs={2}>
                            <LocationOnIcon fontSize="large" />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                                {name}
                            </Typography>
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Total Charges:
                        </Grid>
                        <Grid item xs={4}>
                            {charges}
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Free Slots:
                        </Grid>
                        <Grid item xs={4}>
                            {noOfFreeSlots}
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Expected Distance:
                        </Grid>
                        <Grid item xs={4}>
                            {distance} m
                        </Grid>
                    </Grid>

                    {/* <Typography variant="h5">
                    <PaidIcon />
                     {charges}
                </Typography>

                <Typography variant="h5">
                    : {noOfFreeBikeSlots}
                </Typography>
                <Typography variant="h5">
                    Distance: {distance}
                </Typography> */}
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={handleShowDetails} fullWidth>Show Details</Button>
                </CardActions>
            </Card>
            <Dialog maxWidth='lg' fullWidth onClose={handleClose} open={open} sx={styles.dialog}>

                <Grid container>
                    <Grid item sm={5}>
                    <Grid sx={styles.dialog} container spacing={2} alignItems="center" >
                    <Grid item xs={2}>
                        <LocationOnIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                        Time Slot For Booking:
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container>
                            <Grid item xs={2}>
                                <AccessTimeIcon fontSize="large"/> 
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h6">
                                    {startTime.format('DD MMM hh:00 A')} - {endTime.format('DD MMM hh:00 A')}
                                </Typography>
                                
                            </Grid>
                        </Grid>
                        
                    </Grid>
                    <Grid item xs={8} sm={4} sx={{ fontWeight: "bold" }}>
                        Total Charges:
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        {charges}
                    </Grid>
                    <Grid item xs={8} sm={4} sx={{ fontWeight: "bold" }}>
                        Free Slots:
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        {noOfFreeSlots}
                    </Grid>
                    <Grid item xs={8} sm={4} sx={{ fontWeight: "bold" }}>
                        Expected Distance:
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        {distance} m
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    {
                        [...freeSlots,...engagedSlots].sort().map((slot)=>(
                            <Grid item xs={2}>
                                
                                    {engagedSllots.includes(slot)?<ParkingSlot prevChanged={prevChanged} setPrevChanged={setPrevChanged} setChanged={setChanged}  changed={changed} id={slot} booked={true}/>:<ParkingSlot prevChanged={prevChanged} setPrevChanged={setPrevChanged}  setChanged={setChanged}  changed={changed} id={slot} booked={false}/>}
                                
                            </Grid>
                        ))
                    }
                    <Grid item xs={12}>
                        <Button fullWidth onClick={handleBookSlot} variant="contained">Book Slot</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body">
                            * You can take a screenshot of the map on right for reference 
                        </Typography>
                    </Grid>
                </Grid>
                    </Grid>
                    <Grid item sm={7}>
                        <MapContainer style={{ height: "400px",width:"100%" }} center={position} zoom={zoomLvl} >
                            
                            <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                            <Marker icon={redIcon} position={currLoc}>
                                            <Popup>
                                                You selected location
                                            </Popup>
                                        </Marker>
                                        <Marker icon={greenIcon} position={[lat,lng]}>
                                            <Popup>
                                                {name}
                                            </Popup>
                                        </Marker>
                            <MyMapComponent/>
                        </MapContainer>
                    </Grid>
                </Grid>
                
            </Dialog>
        </>
    )
}

export default ParkingLotCard;