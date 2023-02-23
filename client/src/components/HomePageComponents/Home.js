import {Box } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
const style = {
    box1:{
        bgcolor: 'red',
        boxShadow: 1,
        borderRadius: 1,
        p: 2,
        minWidth: 300,
    }
}
const Home = ()=>{
    return (
        <Box
  sx={style.box1}
>
  <Box sx={{ color: 'text.secondary' }}>Sessions</Box>
  <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
    98.3 K
  </Box>
  <Box
    component={TrendingUpIcon}
    sx={{ color: 'success.dark', fontSize: 16, verticalAlign: 'sub' }}
  />
  <Box
    sx={{
      color: 'success.dark',
      display: 'inline',
      fontWeight: 'medium',
      mx: 0.5,
    }}
  >
    18.77%
  </Box>
  <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 12 }}>
    vs. last week
  </Box>
</Box>
    )
}

export default Home;