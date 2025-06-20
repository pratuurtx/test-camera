import { useState } from "react";
import { Box, Button, Modal, IconButton, ThemeProvider, Typography } from "@mui/material";
import { CustomWebcam } from "./CustomWebcam";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import theme from "./theme";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
  const [openCamera, setOpenCamera] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [firstImage, setFirstImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<"first" | "second" | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallDevice = useMediaQuery(theme.breakpoints.down(400));

  const handleTakePhoto = async (dataUri: string) => {
    if (captureMode === "first") {
      setFirstImage(dataUri);
    } else if (captureMode === "second") {
      setSecondImage(dataUri);
    }
    setOpenCamera(false);
    setCaptureMode(null);
  };

  const handleCloseCamera = () => {
    setOpenCamera(false);
    setCaptureMode(null);
  };

  const handleOpenFirst = () => {
    setCaptureMode("first");
    setOpenCamera(true);
  };

  const handleOpenSecond = () => {
    setCaptureMode("second");
    setOpenCamera(true);
  };

  const handleViewImage = (image: string) => {
    setPreviewImage(image);
    setOpenPreview(true);
  };

  const clearFirstImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFirstImage(null);
  };

  const clearSecondImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSecondImage(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          width: "100%",
          height: "100dvh",
          p: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
          maxWidth: "800px",
          minHeight: "140px"
        }}>
          <Box sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            border: firstImage ? `2px solid ${theme.palette.primary.main}` : "2px dashed",
            borderColor: firstImage ? "primary.main" : "divider",
            minWidth: 0,
            position: "relative",
            overflow: "hidden"
          }}>
            {firstImage ? (
              <Box sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                flexWrap: isSmallDevice ? "wrap" : "nowrap"
              }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewImage(firstImage)}
                  sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flexShrink: 1
                  }}>
                  <Typography noWrap>
                    {isSmallDevice ? "View" : "View First Image"}
                  </Typography>
                </Button>
                <IconButton
                  onClick={clearFirstImage}
                  sx={{
                    bgcolor: "error.main",
                    color: "white",
                    flexShrink: 0
                  }}>
                  <CloseIcon fontSize={isSmallDevice ? "small" : "medium"} />
                </IconButton>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<PhotoCameraIcon />}
                onClick={handleOpenFirst}
                sx={{
                  height: "100%",
                  py: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                <Typography noWrap>
                  {isSmallDevice ? "First" : "Take First Image"}
                </Typography>
              </Button>
            )}
          </Box>

          <Box sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            border: secondImage ? `2px solid ${theme.palette.secondary.main}` : "2px dashed",
            borderColor: secondImage ? "secondary.main" : "divider",
            minWidth: 0,
            position: "relative",
            overflow: "hidden"
          }}>
            {secondImage ? (
              <Box sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                flexWrap: isSmallDevice ? "wrap" : "nowrap"
              }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewImage(secondImage)}
                  sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flexShrink: 1
                  }}>
                  <Typography noWrap>
                    {isSmallDevice ? "View" : "View Second Image"}
                  </Typography>
                </Button>
                <IconButton
                  onClick={clearSecondImage}
                  sx={{
                    bgcolor: "error.main",
                    color: "white",
                    flexShrink: 0
                  }}
                >
                  <CloseIcon fontSize={isSmallDevice ? "small" : "medium"} />
                </IconButton>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<PhotoCameraIcon />}
                onClick={handleOpenSecond}
                sx={{
                  height: "100%",
                  py: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <Typography noWrap>
                  {isSmallDevice ? "Second" : "Take Second Image"}
                </Typography>
              </Button>
            )}
          </Box>
        </Box>

        <Modal
          open={openCamera}
          onClose={handleCloseCamera}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100dvw",
            height: "100dvh",
            bgcolor: "rgba(0,0,0,0.9)",
            p: 0,
            m: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Box sx={{
            width: "100dvw",
            height: "100dvh",
            position: "relative",
            overflow: "hidden"
          }}>
            <CustomWebcam
              handleTakePhoto={handleTakePhoto}
              handleCloseCamera={handleCloseCamera}
            />
          </Box>
        </Modal>

        <Modal
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100dvw",
            height: "100dvh",
            bgcolor: "rgba(0,0,0,0.9)",
            p: 0,
            m: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Box sx={{
            position: "relative",
            width: "90vw",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}>
            <IconButton
              onClick={() => setOpenPreview(false)}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1
              }}>
              <CloseIcon />
            </IconButton>
            <Box sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden"
            }}>
              <img
                src={previewImage || ""}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px"
                }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                mt: 2,
                textAlign: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                px: 2
              }}>
              {captureMode === "first" ? "First Image Preview" : "Second Image Preview"}
            </Typography>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default App;