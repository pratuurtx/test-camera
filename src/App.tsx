import { useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { CustomWebcam } from './CustomWebcam';

function App() {
  const [open, setOpen] = useState(false);

  const handleTakePhoto = async (dataUri: string) => {
    console.log('Photo taken:', dataUri);
    setOpen(false);
  };

  const handleCloseCamera = () => {
    console.log('Camera closed');
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: "100%",
          height: "100vh",
        }}
      >
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Camera
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="camera-modal-title"
        aria-describedby="camera-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
          }
        }}
      >
        <>
          {open && (
            <CustomWebcam
              handleTakePhoto={handleTakePhoto}
              handleCloseCamera={handleCloseCamera}
            />
          )}
        </>
      </Modal>
    </>
  );
}

export default App;
