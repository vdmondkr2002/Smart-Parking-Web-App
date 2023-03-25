import { Button, CircularProgress, Grid, Grow, IconButton, ImageList, ImageListItem, Paper, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import { format } from 'date-fns'
import Alert from '../../Utils/Alert'
import { useTheme } from "@emotion/react"
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, MapConsumer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import Compress from 'compress.js'
import { asyncpostParkingLot, setAlert } from "../../state"
import AddBox from "@mui/icons-material/AddBox"
import CancelIcon from '@mui/icons-material/Cancel';
import { DateTimePicker, LocalizationProvider, StaticTimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import PhotoCamera from "@mui/icons-material/PhotoCamera"
import LocationOn from "@mui/icons-material/LocationOn"
import Search from "@mui/icons-material/Search"
import { getLocByAddress } from "../../api"

const initialState = {
    noOfCarSlots: 0, noOfBikeSlots: 0, parkingChargesCar: 0, parkingChargesBike: 0, lat: '19.1485', lng: '73.133'
}



const addressInState = {
    city:'',state:'',country:'',postalCode:''
}

const AddParkingLot = () => {
    const theme = useTheme()
    const styles = {
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "70%",
            margin: "auto",
            "@media (max-width : 500px)": {
                width: "100%"
            },
        },
        formContainer: {
            marginTop: "1rem"
        },

        formCont: {
            marginTop: "5em",
            width: "auto",
            marginBottom: "2em"
        },
        ipFields: {
            flexGrow: 1,
        },
        titlePaper: {
            // display: "flex",
            // flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            position: "relative",
            // height: "auto",
            backgroundColor: theme.palette.primary.dark,
            padding: "0.5em 0 0.5em 0",
            color: "#ffc",
            fontWeight: 600
        },
    }

    const LocationMarker = () => {

        const map = useMapEvents({
            click(e) {
                const loc = []
                loc.push(e.latlng['lat'])
                loc.push(e.latlng['lng'])
                setPosition(loc)
            },
            load: () => {
                console.log("Loaded map")
            },
            zoomend: () => {
                if (!map) return;
                const position = map.getCenter();
                const loc = []
                loc.push(position.lat)
                loc.push(position.lng)
                setPosition(loc);
                setZoomLvl(map.getZoom());
            },
            dragend: () => {
                if (!map) return;
                const position = map.getCenter();
                const loc = []
                loc.push(position.lat)
                loc.push(position.lng)
                setPosition(loc);
                setZoomLvl(map.getZoom());
            },
        })

        useEffect(() => {
            if (!foundCurrLoc) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const loc = [position.coords.latitude, position.coords.longitude]
                        setPosition(loc)
                        map.flyTo({ 'lat': loc[0], 'lng': loc[1] }, zoomLvl)
                    }, () => {
                        console.log("Not able to locate")
                    });
                }
                setFoundCurrLoc(true)
            }

        }, [map])

        useEffect(()=>{
            map.flyTo({ 'lat': position[0], 'lng': position[1] },zoomLvl)
        },[position])
        // useEffect(()=>{
        //     if(!foundCurrLoc){
        //         map.locate().on("locationfound",(e)=>{
        //             console.log("Helo->>>>>>>>",e.latlng['lat'],e.latlng['lng'])
        //             console.log("rinning")
        //             const loc = []
        //             loc.push(e.latlng['lat'])
        //             loc.push(e.latlng['lng'])
        //             setPosition(loc)
        //             map.flyTo(e.latlng, zoomLvl);
        //             setFoundCurrLoc(true)

        //         })

        //     }

        // },[map])
        return null;
    }



    const Div = styled('div')(() => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));

    const [openTime,setOpenTime] = useState(dayjs('2022-04-17T15:30'))
    const [closeTime,setCloseTime] = useState(dayjs('2022-04-17T15:30'))
    const [imgFiles,setImgFiles] = useState([])
    const [formData, setFormData] = useState(initialState)
    const [parkName,setParkName] = useState('')
    const [address,setAddress] = useState('')
    const [addressData, setAddressData] = useState(addressInState)
    const user = useSelector(state => state.auth.user)
    const alert = useSelector(state => state.auth.alert)
    const [foundCurrLoc, setFoundCurrLoc] = useState(false)
    const inProgress1 = useSelector(state=>state.auth.inProgress1)
    // const [openTime, setOpenTime] = useState()
    // const [closeTime, setCloseTime] = useState();
    const compress = new Compress()
    const dispatch = useDispatch()
    const [zoomLvl, setZoomLvl] = useState(13);
    const [position, setPosition] = useState([19.1485, 73.133])

    const navigate = useNavigate()

    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "user") {
                navigate("/home")
            }
        }
    }, [user])

    useEffect(() => {
        if (alert.msg == "Parking Lot Added") {
            navigate("/admindb")
        }
    }, [alert])
    useEffect(() => {
        if (position !== undefined) {
            // console.log(position)
            setFormData({ ...formData, lat: position[0].toString(), lng: position[1].toString() })
        }

    }, [position])
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        const data = { ...formData, openTime: openTime.format('HH').toString(), closeTime: closeTime.format('HH').toString() }
        console.log(data)
        dispatch(asyncpostParkingLot(data))
    }

    const handleChange = (e) => {
        console.log(e.target.name, e.target.value)
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleChangeOpen = (newValue) => {
        console.log(newValue)
        setOpenTime(newValue)
    }

    const handleChangeClose = (newValue) => {
        console.log(newValue)
        setCloseTime(newValue)
    }


    const handleUploadClick = async (e) => {
        console.log(e)
        console.log(e.target.value)
        console.log(e.target.files)
        const imgFile = e.target.files[0]
        console.log(imgFile)
        if (imgFiles.length == 3) {
            dispatch(setAlert({ msg: "Maximum 3 photos allowed to upload", type: "error" }))
            return
        }
        if (!["image/png", "image/jpeg"].includes(imgFile.type)) {
            dispatch(setAlert({ msg: "Only jpg/jpeg/png file allowed to upload", type: "error" }))
            return
        }

        const imageData = await compress.compress([imgFile], { size: 0.2, quality: 0.5 })
        const compressedImg = imageData[0].prefix + imageData[0].data;
        setImgFiles([...imgFiles, compressedImg])

    }

    const handleRemove = (ind) => {
        setImgFiles(imgFiles.filter((img, id) => id !== ind))
    }

    const handleChangeAddress = (e) => {
        setAddressData({ ...addressData, [e.target.name]: e.target.value })
    }

    const handleSearchLoc = async()=>{
        const loc = await getLocByAddress(addressData)
        console.log(loc)
        if(loc.msg){
            dispatch(setAlert({msg:loc.msg,type:'info'}))
            return;
        }
        setPosition([parseFloat(loc['lat']),parseFloat(loc['lng'])])
        
    }

    return (
        <Grow in>
            <Container sx={styles.formCont}>
                <Alert />
                <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                    <Grid container sx={styles.formContainer} spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={12}>
                            <Button sx={{ padding: "1em" }} fullWidth variant="contained" startIcon={<AddBox fontSize="large" />}>
                                <Typography variant="h3">
                                    Add a New Parking Lot
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={styles.ipFields}>
                            <TextField
                                name="parkName"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="Enter The name of Parking"
                                onChange={(e)=>setParkName(e.target.value)}
                                value={parkName}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} sx={styles.ipFields}>
                            <Grid container>
                                <Grid item sm={5}>
                                    <Div>{"Number of Slots for Bike"}</Div>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        name="noOfBikeSlots"
                                        type="number"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Bike"

                                        onChange={handleChange}
                                        value={formData.noOfBikeSlots}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item sm={6} xs={12} sx={styles.ipFields}>
                            <Grid container>
                                <Grid item sm={5}>
                                    <Div>{"Number of Slots for Car"}</Div>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        name="noOfCarSlots"
                                        type="number"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Car"

                                        onChange={handleChange}
                                        value={formData.noOfCarSlots}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item sm={6} xs={12} sx={styles.ipFields}>
                            <Grid container>
                                <Grid item sm={5}>
                                    <Div>{"Parking Charges for Bike / HR"}</Div>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        name="parkingChargesBike"
                                        type="number"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Bike"

                                        onChange={handleChange}
                                        value={formData.parkingChargesBike}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item sm={6} xs={12} sx={styles.ipFields}>
                            <Grid container>
                                <Grid item sm={5}>
                                    <Div>{"Parking Charges for Car / HR"}</Div>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        name="parkingChargesCar"
                                        type="number"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Car"

                                        onChange={handleChange}
                                        value={formData.parkingChargesCar}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Paper sx={styles.titlePaper}>
                                <Typography variant="h3" sx={styles.tit}>
                                    Set Open and Close Time
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={0} sm={2}></Grid>
                        <Grid item xs={6} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticTimePicker label="Select Open Time" value={openTime} renderInput={(params) => <TextField {...params} />} views={['hours']} onChange={handleChangeOpen} defaultValue={dayjs('2022-04-17T15:30')} />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticTimePicker label="Select Close Time" value={closeTime} renderInput={(params) => <TextField {...params} />} views={['hours']} onChange={handleChangeClose} defaultValue={dayjs('2022-04-17T15:30')} />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={0} sm={2}></Grid>
                        <Grid item xs={12} sx={styles.ipFields}>
                            <TextField
                                name="address"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="Enter The address"
                                onChange={e=>setAddress(e.target.value)}
                                value={address}

                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Paper sx={styles.titlePaper}>
                                <Typography sx={{ display: 'inline' }} variant="h3">
                                    Pick a location
                                </Typography>
                                <LocationOn fontSize="large" />
                            </Paper>
                        </Grid>
                        <Grid item xs={0} sm={2}></Grid>
                        <Grid item xs={8} sm={8} sx={styles.ipFields}>
                            <Grid container spacing={1} justifyContent="center">
                                <Grid item xs={12} sm={6}>
                                    <Grid container justifyContent="center">
                                        <Grid item sm={6}>
                                            <TextField
                                                name="lat"
                                                type="text"
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                label="Latitude"

                                                onChange={handleChange}
                                                value={formData.lat}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Grid container justifyContent="center">
                                        <Grid item sm={6}>
                                            <TextField
                                                name="lng"
                                                type="text"
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                label="Longitude"

                                                onChange={handleChange}
                                                value={formData.lng}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={0} sm={2}></Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant="h2" component="h2">OR</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={styles.titlePaper}>
                                <Typography sx={{ display: 'inline' }} variant="h3">
                                    Search By Address
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                name="city"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="City"
                                onChange={handleChangeAddress}
                                value={addressData.city}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                name="state"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="State"
                                onChange={handleChangeAddress}
                                value={addressData.state}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                name="country"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="Country"
                                onChange={handleChangeAddress}
                                value={addressData.country}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                name="postalCode"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="Postal Code"
                                onChange={handleChangeAddress}
                                value={addressData.postalCode}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Button fullWidth color="secondary" sx={{ margin: "auto", paddingX: "2em", paddingY: "1em" }} variant="contained" endIcon={<Search />} onClick={handleSearchLoc}>Search</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <MapContainer style={{ height: "400px" }} center={position} zoom={zoomLvl} >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={position}>
                                    <Popup>
                                        You selected location
                                    </Popup>
                                </Marker>

                                <LocationMarker />
                            </MapContainer>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Paper sx={styles.titlePaper}>
                                <Typography variant="h3" sx={styles.tit}>
                                    Add some photos of parking lot (Add upto 3 photos)
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3} alignContent="center">
                            <Button variant="contained" sx={{ marginLeft: "1em" }} component="label">
                                Upload
                                <input hidden accept="image/*" type="file" multiple onChange={handleUploadClick} />
                            </Button>
                            <IconButton color="primary" aria-label="Upload picture" component="label">
                                <input hidden accept="image/*" type="file" multiple onChange={handleUploadClick} />
                                <PhotoCamera />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            {
                                imgFiles.length > 0 ? (
                                    <ImageList sx={{ width: 500, height: 170, margin: "auto" }} cols={3} rowHeight={160}>
                                        {imgFiles.map((img, index) => (
                                            <ImageListItem key={index}>
                                                <CancelIcon onClick={() => handleRemove(index)} />
                                                <img src={img}
                                                    srcSet={img}
                                                    alt="Image title"
                                                    loading="lazy"
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                ) : null
                            }

                        </Grid>
                        <Grid item xs={12}>
                            {
                                inProgress1?(
                                    <Button sx={{ width: "100%", padding: "1em",fontWeight:"bold",fontSize:14  }} color="info" variant="contained" startIcon={<CircularProgress size={20} sx={{color:"yellow"}}/>}>Submitting</Button>
                                ):(
                                    <Button sx={{ width: "100%", padding: "1em",fontWeight:"bold",fontSize:14 }} color="primary" variant="contained" type="submit">Submit</Button>
                                )
                            }
                            
                        </Grid>
                    </Grid>
                </form>
            </Container>

        </Grow>
    )
}
export default AddParkingLot;