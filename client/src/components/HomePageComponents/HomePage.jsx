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
import { useMapEvents, MapContainer, Marker, Popup, TileLayer,Polyline,Polygon } from "react-leaflet"
import { asyncgetParkingLot, clearFreeParkingLots } from "../../state"
import ParkingLotCard from "./ParkingLotCard"
import L from 'leaflet'

const HomePage = () => {
    const styles = {
        formCont: {
            marginTop: "5em",
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
        slotsCont: {
            marginTop: "2em",
            width: "auto"
        }
    }
    const user = useSelector(state => state.auth.user)
    const alert = useSelector(state => state.auth.alert)
    const freeParkingLots = useSelector(state => state.auth.freeParkingLots)
    const [startTime, setStartTime] = useState(dayjs(format(Date.now() + 1000 * 60 * 60, 'yyyy-MM-dd hh:00 a')))
    const [endTime, setEndTime] = useState(dayjs(format(Date.now() + 1000 * 60 * 60 * 2, 'yyyy-MM-dd hh:00 a')));
    const [vehicleType, setVehicleType] = useState('')
    const [position, setPosition] = useState([19.1485, 73.133]);
    const [polyline,setPolyline] = useState([ [19.2309672, 73.140302], [19.2309672, 73.1405278],[19.2314513,73.1405278],[19.2314513,73.140302],[19.2309672, 73.140302] ])
    const [foundCurrLoc, setFoundCurrLoc] = useState(false)
    const [sortBy, setSortBy] = useState('distance')
    const [zoomLvl, setZoomLvl] = useState(13)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    useEffect(() => {
        if (alert.msg == "Slot Booked") {
            navigate("/profile")
        }
    }, [alert])
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
        const data = {
            startTime: startTime.format('YYYY-MM-DD HH:00'), endTime: endTime.format('YYYY-MM-DD HH:00'),
            lat: position[0], lng: position[1], vehicleType: vehicleType
        }
        dispatch(asyncgetParkingLot(data))
    }


    const handleChangeStart = (newValue) => {
        dispatch(clearFreeParkingLots())
        setStartTime(newValue)
        setEndTime(newValue.add(1, 'hour'))
    }


    const handleChangeEnd = (newValue) => {
        // const newVal = newValue
        // console.log({...newVal,minute:0})
        dispatch(clearFreeParkingLots())
        newValue.set('minute', 0)
        console.log(newValue)
        setEndTime(newValue)
    }

    const handleChangePos = (e) => {
        if (e.target.name == "lat")
            setPosition(position.map((pos, ind) => ind == 0 ? e.target.value : pos))
        else
            setPosition(position.map((pos, ind) => ind == 1 ? e.target.value : pos))
        dispatch(clearFreeParkingLots())
    }

    const handleChangeVehicleTp = (e) => {
        setVehicleType(e.target.value)
        dispatch(clearFreeParkingLots())
    }

    const handleChangeSortBy = (e) => {
        setSortBy(e.target.value)
    }

    const compByCharges = (a, b) => {
        if (a.charges < b.charges) {
            return -1;
        }
        if (a.charges > b.charges) {
            return 1;
        }
        return 0;
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
                                    label="Type Of Vehicle"
                                    onChange={handleChangeVehicleTp}
                                >
                                    <MenuItem value={"Bike"}>Bike</MenuItem>
                                    <MenuItem value={"Car"}>Car</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button fullWidth sx={{ padding: "1em" }} variant="contained"> Choose vehicle Type</Button>
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
                                        {
                                            freeParkingLots.length > 0 ? (
                                                freeParkingLots.map(freeLot => (
                                                    <Marker icon={greenIcon} position={[freeLot.location[0], freeLot.location[1]]}>
                                                        <Popup>
                                                            {freeLot.name}
                                                        </Popup>
                                                    </Marker>
                                                ))

                                            ) : null
                                        }
                                        <Marker position={position}>
                                            <Popup>
                                                You selected location
                                            </Popup>
                                        </Marker>
                                        <Polygon positions={polyline}/>
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



                {
                    freeParkingLots.length > 0 ? (
                        <>
                            <Grid container sx={styles.slotsCont} spacing={3}>
                                <Grid item xs={8}>

                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={sortBy}
                                            defaultValue={"distance"}
                                            label="Sort By"
                                            onChange={handleChangeSortBy}
                                        >
                                            <MenuItem value={"distance"}>Distance</MenuItem>
                                            <MenuItem value={"charges"}>Charges</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container sx={styles.slotsCont} spacing={3}>
                                {
                                    (sortBy == "distance") ? (
                                        freeParkingLots.map((freeLot) => (
                                            <Grid item xs={12} sm={4}>
                                                <ParkingLotCard startTime={startTime} endTime={endTime} vehicleType={vehicleType} key={freeLot.id} id={freeLot.id} freeSlots={freeLot.freeSlots} engagedSlots={freeLot.engagedSlots} address={freeLot.address} lat={freeLot.location[0]} lng={freeLot.location[1]} charges={freeLot.charges} name={freeLot.name} noOfFreeSlots={freeLot.freeSlots.length} distance={parseInt(freeLot.distance)} />
                                            </Grid>

                                        ))
                                    ) : (
                                        [...freeParkingLots].sort((a, b) => a.charges - b.charges).map((freeLot) => (
                                            <Grid item xs={12} sm={4}>
                                                <ParkingLotCard startTime={startTime} endTime={endTime} vehicleType={vehicleType} key={freeLot.id} id={freeLot.id} freeSlots={freeLot.freeSlots} engagedSlots={freeLot.engagedSlots} address={freeLot.address} lat={freeLot.location[0]} lng={freeLot.location[1]} charges={freeLot.charges} name={freeLot.name} noOfFreeSlots={freeLot.freeSlots.length} distance={parseInt(freeLot.distance)} />
                                            </Grid>

                                        ))
                                    )
                                }
                            </Grid>
                        </>
                    ) : null
                }
            </Container>
        </Grow>
    )
}

export default HomePage;