import { Button, Grid, Grow, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {styled} from '@mui/material/styles'
import Alert from '../../Utils/Alert'
import { useTheme } from "@emotion/react"
import { MapContainer, TileLayer, useMap,Marker,Popup,useMapEvents,MapConsumer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { asyncpostParkingLot } from "../../state"

const initialState = {
    parkName:'',noOfCarSlots:0,noOfBikeSlots:0,address:'',parkingChargesCar:0,parkingChargesBike:0,lat:'19.1485',lng:'73.133'
}

const AdminDashboard = () => {
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
            marginBottom:"2em"
        },
        ipFields: {
            flexGrow: 1,
        },
    }

    const LocationMarker = ()=>{
        
        const map = useMapEvents({
          click(e) {
            const loc = []
            loc.push(e.latlng['lat'])
            loc.push(e.latlng['lng'])
            setPosition(loc)
          },
          load: ()=> {
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
      
        useEffect(()=>{
            if(!foundCurrLoc){
                map.locate().on("locationfound",(e)=>{
                    console.log("Helo->>>>>>>>",e.latlng['lat'],e.latlng['lng'])
                    console.log("rinning")
                    const loc = []
                    loc.push(e.latlng['lat'])
                    loc.push(e.latlng['lng'])
                    setPosition(loc)
                    map.flyTo(e.latlng, zoomLvl);
                    setFoundCurrLoc(true)
    
                })
                
            }
            
        },[map])
        return null;
    }
    const theme = useTheme()
    const Div = styled('div')(( ) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));
    

    const [formData, setFormData] = useState(initialState)
    const user = useSelector(state => state.auth.user)
    const [foundCurrLoc,setFoundCurrLoc] = useState(false)
    const dispatch = useDispatch()
    const [zoomLvl,setZoomLvl] = useState(13);
    const [position,setPosition]= useState([19.1485, 73.133])
    
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "user") {
                navigate("/admindb")
            }
        }
    }, [user])
    

    useEffect(()=>{
        if(position!==undefined){
            console.log(position)
            setFormData({...formData,lat:position[0].toString(),lng:position[1].toString()})
        }
        
    },[position])
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(asyncpostParkingLot(formData))
        
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    
      
    return (
        <Grow in>
            <Container sx={styles.formCont}>
                <Alert />
                <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                    <Grid container sx={styles.formContainer} spacing={3}>
                        <Grid item sm={12} xs={12} sx={styles.ipFields}>
                            <TextField
                                name="parkName"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="Enter The name of Parking"
                                onChange={handleChange}
                                value={formData.parkName}
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
                        <Grid item xs={12} sx={styles.ipFields}>
                            <TextField
                                name="address"
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                label="Enter The address"
                                onChange={handleChange}
                                value={formData.address}
                            />
                        </Grid>
                        <Grid item xs={12} sx={styles.ipFields}>
                            <Grid container>
                                <Grid item xs={12} sm={4}>
                                    
                                    <Button variant="contained">Pick a location</Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Grid container>
                                        <Grid item sm={5}>
                                            <Div>{"Latitude"}</Div>
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
                                                
                                                onChange={handleChange}
                                                value={formData.lat}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                <Grid container>
                                        <Grid item sm={5}>
                                            <Div>{"Longitude"}</Div>
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
                                                
                                                onChange={handleChange}
                                                value={formData.lng}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <MapContainer  style={{ height: "400px" }} center={position} zoom={zoomLvl} >
                                        <TileLayer 
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={position}>
                                            <Popup>
                                            A pretty CSS3 popup. <br /> Easily customizable.
                                            </Popup>
                                        </Marker>
                                        
                                        <LocationMarker/>
                                    </MapContainer>
                                </Grid>
                            </Grid>
                            
                            
                        </Grid>
                        <Grid item xs={12}>
                            <Button sx={{width:"100%",padding:"1em"}} variant="contained" type="submit">Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>

        </Grow>
    )
}
export default AdminDashboard;