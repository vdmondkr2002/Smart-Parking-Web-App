import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

const CustomCircularProgress = ({inProgress}) => {
  return (
    <>
      {
        inProgress ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : null
      }
    </>
  );
}

export default CustomCircularProgress
