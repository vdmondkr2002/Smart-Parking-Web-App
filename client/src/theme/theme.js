// color design tokens export
export const colorTokens = {
    grey: {
        0: "#FFFFFF",
        10: "#F6F6F6",
        50: "#F0F0F0",
        100: "#E0E0E0",
        200: "#C2C2C2",
        300: "#A3A3A3",
        400: "#858585",
        500: "#666666",
        600: "#4D4D4D",
        700: "#333333",
        800: "#1A1A1A",
        900: "#0A0A0A",
        1000: "#000000",
    },
    primary: {
        50: "#E6FBFF",
        100: "#CCF7FE",
        200: "#99EEFD",
        300: "#66E6FC",
        400: "#33DDFB",
        500: "#00D5FA",
        600: "#00A0BC",
        700: "#006B7D",
        800: "#00353F",
        900: "#001519",
    },
};

// export const theme = createMuiTheme({
//     palette: {
//       primary: {
//         light: '#DA9FF9',
//         main: '#B088F9',
//         dark: '#7952B3',
//         contrastText: '#000',
//       },
//       secondary: {
//         light: '#BEDCFA',
//         main: '#98ACF8',
//         dark: '#94D0CC',
//         contrastText: '#fff',
//       },
//       text:{
//           primary:'#0A1931',
//           secondary:'#777',
//           disabled:'#999'
//       },
//       action:{
//         light:'#82ff64',
//         main:'#40ed2b',
//         dark:'#00b900',
//         contrastText:"#fff"
//       }
//     },
//     typography: {
//         color:'#505050',
//         fontFamily: 'Raleway, Arial' 
//     }
//   });
export const themeSettings = () => {
    return {
        palette: {
            primary: {
                light: '#DA9FF9',
                main: '#B088F9',
                dark: '#7952B3',
                contrastText: '#000',
            },
            secondary: {
                light: '#BEDCFA',
                main: '#98ACF8',
                dark: '#94D0CC',
                contrastText: '#fff',
            },
            text: {
                primary: '#0A1931',
                secondary: '#777',
                disabled: '#999'
            },
            action: {
                light: '#82ff64',
                main: '#40ed2b',
                dark: '#00b900',
                contrastText: "#fff"
            }
        },
        typography: {
            color: '#505050',
            fontFamily: 'Raleway, Arial',
            fontSize: 12,
            h1: {
                fontFamily: 'Raleway, Arial',
                fontSize: 40,
            },
            h2: {
                fontFamily: 'Raleway, Arial',
                fontSize: 32,
            },
            h3: {
                fontFamily: 'Raleway, Arial',
                fontSize: 24,
            },
            h4: {
                fontFamily: 'Raleway, Arial',
                fontSize: 20,
            },
            h5: {
                fontFamily: 'Raleway, Arial',
                fontSize: 16,
            },
            h6: {
                fontFamily: 'Raleway, Arial',
                fontSize: 14,
            },
        }
    }
}