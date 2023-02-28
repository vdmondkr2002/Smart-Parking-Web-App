import { Button, FormControl, FormHelperText, Grid, Grow, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { format } from 'date-fns'

import Alert from '../../Utils/Alert'
import { useMapEvents, MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { asyncgetParkingLot } from "../../state"
import ParkingLotCard from "./ParkingLotCard"

const HomePage = () => {
    const styles = {
        formCont: {
            marginTop: "8em",
            width: "auto",
            marginBottom: "2em"
        },
        formContainer: {
            marginTop: "1rem"
        },
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
        slotsCont:{
            marginTop:"2em",
            width:"auto"
        }
    }
    const user = useSelector(state => state.auth.user)
    const freeParkingLots = useSelector(state => state.auth.freeParkingLots)
    const [startTime, setStartTime] = useState(dayjs(format(Date.now() + 1000 * 60 * 60, 'yyyy-MM-dd hh:00 a')))
    const [endTime, setEndTime] = useState(dayjs(format(Date.now() + 1000 * 60 * 60 * 2, 'yyyy-MM-dd hh:00 a')));
    const [vehicleType, setVehicleType] = useState('')
    const [position, setPosition] = useState([19.1485, 73.133]);
    const [foundCurrLoc, setFoundCurrLoc] = useState(false)
    const [zoomLvl, setZoomLvl] = useState(13)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "admin") {
                navigate("/admindb")
            }
        }
    }, [user])

    const MyMapComponent = () => {
        const map = useMapEvents({
            click(e) {
                const loc = []
                loc.push(e.latlng['lat'])
                loc.push(e.latlng['lng'])
                setPosition(loc)
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
                map.locate().on("locationfound", (e) => {
                    console.log("user location found")
                    console.log(e.latlng)
                    setFoundCurrLoc(true)
                })
            }
        }, [map])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(startTime, endTime, position)
        // console.log(startTime.format('YYYY-MM-DD HH:00'))
        const data = { startTime: startTime.format('YYYY-MM-DD HH:00'), endTime: endTime.format('YYYY-MM-DD HH:00'), 
                    lat: position[0], lng: position[1],vehicleType:vehicleType }
        dispatch(asyncgetParkingLot(data))
    }
    const handleChangeStart = (newValue) => {

        setStartTime(newValue)
        setEndTime(newValue.add(1, 'hour'))
    }


    const handleChangeEnd = (newValue) => {
        // const newVal = newValue
        // console.log({...newVal,minute:0})
        newValue.set('minute', 0)
        console.log(newValue)
        setEndTime(newValue)
    }

    const handleChangePos = (e) => {
        if (e.target.name == "lat")
            setPosition(position.map((pos, ind) => ind == 0 ? e.target.value : pos))
        else
            setPosition(position.map((pos, ind) => ind == 1 ? e.target.value : pos))
    }

    const handleChangeVehicleTp = (e)=>{
        setVehicleType(e.target.value)
    }
    return (
        <Grow in>
            <Container sx={styles.formCont}>
                <Alert />
                <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>

                    <Grid container sx={styles.formContainer} spacing={3}>
                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type Of vehicle</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={vehicleType}
                                    defaultValue={"Bike"}
                                    label="Age"
                                    onChange={handleChangeVehicleTp}
                                >
                                    <MenuItem value={"Bike"}>Bike</MenuItem>
                                    <MenuItem value={"Car"}>Car</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button fullWidth sx={{padding:"1em"}} variant="contained"> Choose vehicle Type</Button>
                        </Grid>
                        
                        <Grid item xs={6} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    disablePast
                                    maxDate={dayjs(format(Date.now(), 'yyyy-MM-dd hh:00')).add(1, 'day')}
                                    label="pick a start time"
                                    value={startTime}
                                    views={['year', 'month', 'day', 'hours']}
                                    name="startTime"
                                    onChange={handleChangeStart}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    minDateTime={startTime.add(1, 'hour')}
                                    maxDateTime={startTime.add(3, 'hour')}
                                    views={['year', 'month', 'day', 'hours']}
                                    label="pick a end time"
                                    value={endTime}
                                    name="endTime"
                                    onChange={handleChangeEnd}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button sx={{ padding: "1em" }} variant="contained" fullWidth>Choose a slot</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                                Instructions
                            </Typography>
                            <Paper>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="You are allowed to book a time slot of minimum 1 hour and maximum 3 hours"
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="You can only book a time slot for future 2 days"
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sx={styles.ipFields}>
                            <Grid container spacing={1}>

                                <Grid item xs={12} sm={4}>
                                    <Grid container>
                                        <Grid item sm={5}>
                                            <div>{"Latitude"}</div>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <TextField
                                                name="lat"
                                                type="text"
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                label="Latitude"

                                                onChange={handleChangePos}
                                                value={position[0]}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Grid container>
                                        <Grid item sm={5}>
                                            <div>{"Longitude"}</div>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <TextField
                                                name="lng"
                                                type="text"
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                label="Longitude"

                                                onChange={handleChangePos}
                                                value={position[1]}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4}>

                                    <Button fullWidth sx={{ padding: "1em" }} variant="contained">Pick a location</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <MapContainer style={{ height: "400px" }} center={position} zoom={zoomLvl} >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={position}>
                                            <Popup>
                                                A pretty CSS3 popup. <br /> Easily customizable.
                                            </Popup>
                                        </Marker>

                                        <MyMapComponent />
                                    </MapContainer>
                                </Grid>

                            </Grid>


                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth sx={{ padding: "1em" }} variant="contained" type="submit">Find Parking Lots</Button>
                        </Grid>
                    </Grid>
                </form>
                <Grid container sx={styles.slotsCont} spacing={3}>
                    {
                        freeParkingLots.map((freeLot)=>(
                            <Grid item xs={12} sm={4}>
                                <ParkingLotCard startTime={startTime} endTime={endTime} vehicleType={vehicleType} key={freeLot.id} id={freeLot.id} freeSlots={freeLot.freeSlots} engagedSlots={freeLot.engagedSlots} address={freeLot.address} lat={freeLot.location[0]} lng={freeLot.location[1]}charges={freeLot.charges} name={freeLot.name} noOfFreeSlots={freeLot.freeSlots.length} distance={parseInt(freeLot.distance) }/>
                            </Grid>
                            
                        ))
                    }
                </Grid>
            </Container>
        </Grow>
    )
}

export default HomePage;