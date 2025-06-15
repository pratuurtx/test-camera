import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Select,
    Typography,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ReplayIcon from "@mui/icons-material/Replay";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";

const isMobileDevice = () => {
    const ua = navigator.userAgent || navigator.vendor;
    return /android|iphone|ipad|mobile/i.test(ua);
};

const CustomWebcam: React.FC = () => {
    const webcamRef = useRef<Webcam | null>(null);
    const shutterRef = useRef<HTMLAudioElement | null>(null);

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [deviceId, setDeviceId] = useState<string | undefined>();
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setIsMobile(isMobileDevice());

        navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
            const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
            setDevices(videoDevices);

            if (videoDevices.length > 0 && !deviceId) {
                setDeviceId(videoDevices[0].deviceId);
            }

            setLoading(false);
        });
    }, []);

    const videoConstraints: MediaTrackConstraints = {
        facingMode,
        deviceId: deviceId ? { exact: deviceId } : undefined,
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            shutterRef.current?.play();
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) setImgSrc(imageSrc);
        }
    }, []);

    const switchCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    const handleStartCamera = () => {
        setIsCameraActive(true);
        setImgSrc(null);
    };

    const handleCloseCamera = () => {
        setIsCameraActive(false);
        setImgSrc(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 640, mx: "auto", p: 2 }}>
            {!isCameraActive ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Typography variant="h6">Ready to take a photo?</Typography>
                    <Button
                        variant="contained"
                        startIcon={<VideocamIcon />}
                        onClick={handleStartCamera}
                    >
                        Start Camera
                    </Button>
                </Box>
            ) : imgSrc ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img
                        src={imgSrc}
                        alt="Captured"
                        style={{ width: "100%", borderRadius: 8 }}
                    />
                    <Grid container spacing={2} mt={2}>
                        <Grid size={{ xs: 6 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ReplayIcon />}
                                onClick={() => setImgSrc(null)}
                                fullWidth
                            >
                                Retake
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<CloseIcon />}
                                onClick={handleCloseCamera}
                                fullWidth
                            >
                                Close Camera
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box>
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        style={{
                            width: "100%",
                            borderRadius: 8,
                            aspectRatio: "4/3",
                            objectFit: "cover",
                        }}
                    />

                    <Grid container spacing={2} mt={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: "auto" }}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CameraAltIcon />}
                                onClick={capture}
                                fullWidth={isSmDown}
                            >
                                Capture
                            </Button>
                        </Grid>

                        {isMobile ? (
                            <Grid size={{ xs: 12, sm: "auto" }}>
                                <Button
                                    variant="outlined"
                                    onClick={switchCamera}
                                    startIcon={<FlipCameraAndroidIcon />}
                                    fullWidth={isSmDown}
                                >
                                    Switch Camera
                                </Button>
                            </Grid>
                        ) : (
                            devices.length > 1 && (
                                <Grid size={{ xs: 12 }}>
                                    <Select
                                        value={deviceId}
                                        fullWidth
                                        onChange={(e) => setDeviceId(e.target.value)}
                                        displayEmpty
                                        sx={{ minWidth: 200 }}
                                    >
                                        {devices.map((device) => (
                                            <MenuItem key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Camera ${device.deviceId}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            )
                        )}

                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<CloseIcon />}
                                onClick={handleCloseCamera}
                                fullWidth
                            >
                                Close Camera
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default CustomWebcam;
