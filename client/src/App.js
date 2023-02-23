import React, { useMemo } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

import {Container,AppBar,} from '@mui/material'
import Navbar from './components/Navbar/Navbar';
import Home from './components/HomePageComponents/Home';
import AboutUs from './components/AboutUsComponents/About';
import {CssBaseline,ThemeProvider} from "@mui/material";
import {createTheme} from '@mui/material/styles';
import { themeSettings } from './theme/theme';
import RegisterPage from './components/LoginPageComponents/RegisterPage';
import LoginPage from './components/LoginPageComponents/LoginPage';


const App = ()=>{
    const theme = useMemo(()=>createTheme(themeSettings()));
    const styles ={
        root:{
          padding:0,
          maxWidth:"100vw",
          position:"relative"
        }
    }
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container className={styles.root}>
                    <Navbar/>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/register" element={<RegisterPage/>}/>
                        <Route exact path="/login" element={<LoginPage/>}/>
                        <Route exact path="/aboutus" element={<AboutUs/>}/>
                    </Routes>
                </Container>
            </ThemeProvider>
        </Router>
       
    )
}

export default App;  