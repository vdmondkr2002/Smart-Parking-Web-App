import { Button, Grid, Grow, TextField, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {styled} from '@mui/material/styles'
import Alert from '../../Utils/Alert'
import { useTheme } from "@emotion/react"
import { MapContainer, TileLayer, useMap,Marker,Popup,useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const initialState = {
    parkName:'',noOfCarSlots:0,noOfBikeSlots:0,address:'',parkingChargesCar:0,parkingChargesBike:0
}
function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
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
            width: "auto"
        },
        ipFields: {
            flexGrow: 1,
        },
    }
    const theme = useTheme()
    const Div = styled('div')(( ) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));
    

    const [formData, setFormData] = useState(initialState)
    const user = useSelector(state => state.auth.user)
    const position = [51.505, -0.09]
    const navigate = useNavigate()
    const mapRef = useRef()
    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "user") {
                navigate("/admindb")
            }
        }
    }, [user])

    const handleSubmit = () => {

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
                                        name="noOfBikeSlots"
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
                                        name="noOfCarSlots"
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
                            <Button variant="contained">Pick a location</Button>
                            <MapContainer style={{ height: "400px" }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[51.505, -0.09]}>
                                    <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                    </Popup>
                                </Marker>
                                <LocationMarker/>
                            </MapContainer>
                        </Grid>
                    </Grid>
                </form>
            </Container>

        </Grow>
    )
}
export default AdminDashboard;