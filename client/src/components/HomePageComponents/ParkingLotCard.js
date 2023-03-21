import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogTitle, FormHelperText, Grid, IconButton, ImageList, ImageListItem, Stack, TextField, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useState } from "react";
import ParkingSlot from "./ParkingSlot";
import { asyncBookSlot, setAlert } from "../../state";
import { useDispatch } from "react-redux";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useMapEvents, MapContainer, Marker, Popup, TileLayer, Polyline, Polygon } from "react-leaflet"
import L from 'leaflet'
import ForwardIcon from '@mui/icons-material/Forward';
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import Compress from 'compress.js'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const initialState = {
    selectedImg:'',vehicleNo:''
}
const ParkingLotCard = ({ vehicleType, startTime, endTime, name, noOfFreeSlots, charges, distance, id, freeSlots, engagedSlots, address, lat, lng, currLoc,lotImages }) => {
    const styles = {
        dialog: {
            padding: "2em"
        },
        ipFields: {
            flexGrow: 1,
            padding: "1em"
        },
    }
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const [open4, setOpen4] = useState(false)
    const [parkingSlots, setParkingSlots] = useState([...freeSlots, ...engagedSlots])
    const [formData,setFormData] = useState(initialState)
    const [engagedSllots, setEngagedSllots] = useState(engagedSlots)
    const [changed, setChanged] = useState('')
    const [imgFIleName, setImgFIlename] = useState('')
    const [prevChanged, setPrevChanged] = useState('')
    const [cancellable,setCancellable] = useState(false)
    const [isDone,setIsDone] = useState(false)
    const [position, setPosition] = useState([(currLoc[0] + lat) / 2, (currLoc[1] + lng) / 2])
    const [map, setMap] = useState()
    const [vehicleNumber, setVehicleNumber] = useState('')
    const [zoomLvl, setZoomLvl] = useState(13)
    const compress = new Compress()

    const dispatch = useDispatch()
    useEffect(() => {
        setParkingSlots([...freeSlots, ...engagedSlots])
        setParkingSlots(parkingSlots.sort())
        console.log(freeSlots)
    }, [open])




    const MyMapComponent = () => {
        const map = useMapEvents({

        })

        useEffect(() => {
            if(!isDone){
                L.Routing.control({
                    waypoints: [
                        L.latLng(currLoc[0], currLoc[1]),
                        L.latLng(lat, lng)
                    ], createMarker: () => null
    
                }).addTo(map)
                setIsDone(true)
            }
            

        }, [])
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

    const handleOpenDialog2 = () => {
        setOpen2(true)
    }

    const handleCloseDialog2 = () => {
        setOpen2(false)
    }

    

    

    const handleClickOpenDialog3 = ()=>{
        setOpen3(true)
    }

    const handleClickCloseDialog3 = ()=>{
        setOpen3(false)
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

    const handleBookSlot = () => {
        console.log(changed, id, startTime, endTime, vehicleType)
        const data = { startTime: startTime.format('YYYY-MM-DD HH:00'), endTime: endTime.format('YYYY-MM-DD HH:00'), lotId: id, slotId: changed, vehicleType: vehicleType }
        console.log(data)
        dispatch(asyncBookSlot(data))
    }
    const handleChangeForm = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleUploadClick = async(e) => {
        console.log(e)
        const imgFile = e.target.files[0]
        console.log(imgFile)

        if (!["image/png", "image/jpeg"].includes(imgFile.type)) {
            dispatch(setAlert({ msg: "Only jpg/jpeg/png file allowed to upload", type: "error" }))
            return
        }
        setImgFIlename(imgFile.name)
        const imageData = await compress.compress([imgFile],{size:0.2,quality:0.5})
        const compressedImg = imageData[0].prefix + imageData[0].data;
        console.log(compressedImg)
        setFormData({...formData,selectedImg:compressedImg})
    }

    const handleConfirmSlot = (e)=>{
        e.preventDefault()
        console.log("slot confirming...")
        console.log(formData)
        console.log(changed,id,startTime,endTime,vehicleType)
        const data = { startTime: startTime.format('YYYY-MM-DD HH:00'), endTime: endTime.format('YYYY-MM-DD HH:00'), 
                        lotId: id, slotId: changed, vehicleType: vehicleType,
                       vehicleNo:formData.vehicleNo,carImg: formData.selectedImg,cancellable}
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
                                        <AccessTimeIcon fontSize="large" />
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
                                lotImages && lotImages.length>0?(
                                    <Grid item xs={12}>
                                        <Button fullWidth onClick={handleClickOpenDialog3} variant="contained">Check out photos</Button>
                                    </Grid>
                                ):null
                                
                            }
                            
                            {
                                [...freeSlots, ...engagedSlots].sort().map((slot) => (
                                    <Grid item xs={2}>

                                        {engagedSllots.includes(slot) ? <ParkingSlot prevChanged={prevChanged} setPrevChanged={setPrevChanged} setChanged={setChanged} changed={changed} id={slot} booked={true} /> : <ParkingSlot prevChanged={prevChanged} setPrevChanged={setPrevChanged} setChanged={setChanged} changed={changed} id={slot} booked={false} />}

                                    </Grid>
                                ))
                            }
                            <Grid item xs={12}>
                                <Button fullWidth onClick={handleOpenDialog2} variant="contained">Book Slot</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body">
                                    * You can take a screenshot of the map on right for reference
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
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
                </Grid>

            </Dialog>

            <Dialog fullWidth onClose={handleCloseDialog2} open={open2}>
                <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleConfirmSlot}>
                    <Grid container sx={styles.dialog} justifyContent="center">
                        <Grid item xs={12} textAlign="center">
                            <Typography variant="h4" fontWeight="bold">
                                Just one more step before you confirm your slot
                            </Typography>
                        </Grid>

                        <Grid item sm={12} xs={12} sx={styles.ipFields}>
                            <TextField
                                name="vehicleNo"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label={`Enter The Number on ${vehicleType}`}
                                onChange={handleChangeForm}
                                value={formData.vehicleNo}
                            />
                            <FormHelperText required variant="outlined" children="Check the number plate on your vehicle and then enter" />
                        </Grid>

                        <Grid item sm={12} xs={12} sx={styles.ipFields}>
                            <Typography variant="h5" display="inline">Add a Photo of your Car:</Typography>
                            <Button variant="contained" sx={{ marginLeft: "1em" }} component="label">
                                Upload
                                <input hidden accept="image/*" type="file" onChange={handleUploadClick} />
                            </Button>
                            <IconButton color="primary" aria-label="Upload picture" component="label">
                                <input hidden accept="image/*" type="file" onChange={handleUploadClick} />
                                <PhotoCamera />
                            </IconButton>
                            {
                                imgFIleName !== '' ? (
                                    <>
                                    <Box border="1px solid black">
                                        <Typography>
                                            {imgFIleName}
                                        </Typography>
                                    </Box>
                                    <img src={formData.selectedImg} width="50%"/>
                                    </>
                                ) : null
                            }


                            <FormHelperText required children="*Only jpg/jpeg/png file allowed to upload" />
                        </Grid>
                        <Grid item sm={8} xs={12} sx={styles.ipFields}>
                            <Typography variant="h5" display="inline">Do you want the Slot to be cancellable:</Typography>
                            
                            <FormHelperText sx={{color:"red"}} required children="*Cancelling a slot will refund 70% of your parking charge on cancellation"/>
                        </Grid>
                        <Grid item sm={4} xs={12} sx={styles.ipFields}>
                            <Button variant={cancellable?"contained":"outlined"} color={cancellable?"success":"inherit"} startIcon={<DoneIcon/>} onClick={()=>setCancellable(true)}>Yes</Button>
                            <Button variant={!cancellable?"contained":"outlined"} color={!cancellable?"warning":"inherit"} startIcon={<CloseIcon/>} onClick={()=>setCancellable(false)}>No</Button>
                        </Grid>
                        <Grid item xs={12} sx={styles.ipFields}>
                            <Button fullWidth type="submit" variant="contained">Confirm Slot</Button>
                        </Grid>
                    </Grid>
                </form>

            </Dialog>
            <Dialog fullWidth onClose={handleClickCloseDialog3} open={open3}>
                <Grid container sx={styles.dialog} justifyContent="center">
                    <Grid item xs={12}>
                        {
                            lotImages && lotImages.length>0?(
                                <ImageList sx={{ width: 500, height:170,margin:"auto" }} cols={lotImages.length} rowHeight={160}>
                                {lotImages.map((img,index)=>(
                                    <ImageListItem  key={index}>
                                        <img src={img}
                                        srcSet={img}
                                        alt="Image title"
                                        loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                                 </ImageList>
                            ):null
                            
                       
                        }
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}

export default ParkingLotCard;