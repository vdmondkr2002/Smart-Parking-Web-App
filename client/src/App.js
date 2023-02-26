import React, { useMemo,useEffect } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

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


const App = ()=>{
    const theme = useMemo(()=>createTheme(themeSettings()));
    const styles ={
        root:{
          padding:0,
          position:"relative"
        }
    }

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(asyncloadUser())
    })
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
                        <Route exact path="/home" element={<HomePage/>}/>
                    </Routes>
                    <Footer/>
                </Container>
            </ThemeProvider>
        </Router>
       
    )
}

export default App;  