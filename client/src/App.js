import React, { useMemo,useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import * as faceapi from 'face-api.js'
import * as canvas from 'canvas'
import {Container,AppBar,} from '@mui/material'
import Navbar from './components/Navbar/Navbar';
import AboutUs from './components/AboutUsComponents/About';
import {CssBaseline,ThemeProvider} from "@mui/material";
import {createTheme} from '@mui/material/styles';
import { themeSettings } from './theme/theme';
import RegisterPage from './components/LoginPageComponents/RegisterPage';
import LoginPage from './components/LoginPageComponents/LoginPage';
import { useDispatch } from 'react-redux';
import { asyncloadUser } from './state';
import LandingPage from './components/LandingPageComponents/LandingPage';
import Footer from './components/Footer/Footer';
import AdminDashboard from './components/AdminDashboardComponents/AdminDashboard';
import HomePage from './components/HomePageComponents/HomePage';
import ProfilePage from './components/ProfilePageComponents/ProfilePage';
import AddParkingLot from './components/AdminDashboardComponents/AddParkingLot';
import ContactUs from './components/ContactUsComponents/ContactUs';
import News from './components/NewsComponents/News';
import AnalyzeHistory from './components/AdminDashboardComponents/AnalyzeHistory';
import Footer1 from './components/Footer/Footer1';
import RefundAnalysis from './components/AdminDashboardComponents/RefundAnalysis';
import ResetPassword from './components/LoginPageComponents/ResetPassword';



const App = ()=>{
    const theme = useMemo(()=>createTheme(themeSettings()));
    const [modelsIsLoaded,setModelisLoaded] = useState(false)
    const styles ={
        root:{
          padding:0,
          position:"relative"
        }
    }

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(asyncloadUser())
        loadModels()
    })

    const loadModels = async()=>{
        const MODEL_URL = process.env.PUBLIC_URL+ '/models'
        Promise.all([
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
        ]).then(()=>{
            setModelisLoaded(true)
            const { Canvas, Image, ImageData } = canvas;
            faceapi.env.monkeyPatch({
                fetch: fetch,
                Canvas: window.HTMLCanvasElement,
                Image: window.HTMLImageElement,
                ImageData: ImageData,
                createCanvasElement: () => document.createElement('canvas'),
                createImageElement: () => document.createElement('img')
            });
        }
            
        )
    }
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container className={styles.root} maxWidth="1300px">
                    <Navbar/>
                    <Routes>
                        <Route exact path="/" element={<LandingPage/>}/>
                        <Route exact path="/register" element={<RegisterPage/>}/>
                        <Route exact path="/login" element={<LoginPage/>}/>
                        <Route exact path="/aboutus" element={<AboutUs/>}/>
                        <Route exact path="/admindb" element={<AdminDashboard/>} />
                        <Route exact path="/profile" element={<ProfilePage/>}/>
                        <Route exact path="/home" element={<HomePage/>}/>
                        <Route exact path="/addparkingLot" element={<AddParkingLot/>}/>
                        <Route exact path="/contactus" element={<ContactUs/>}/>
                        <Route exact path="/news" element={<News/>}/>
                        <Route exact path="/analysis" element={<AnalyzeHistory/>} />
                        <Route exact path="/refunds" element={<RefundAnalysis/>}/>
                        <Route exact path="/resetPassword/:code" element={<ResetPassword/>}/>
                    </Routes>
                    
                </Container>
                <Footer1/>
            </ThemeProvider>
        </Router>
       
    )
}

export default App;  