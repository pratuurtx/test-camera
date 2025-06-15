import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import CameraIcon from "@mui/icons-material/Camera";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const isMobileDevice = () => {
    const ua = navigator.userAgent || navigator.vendor;
    return /android|iphone|ipad|mobile/i.test(ua);
};

const isTabletDevice = () => {
    const ua = navigator.userAgent || navigator.vendor;
    return /ipad|tablet|(android(?!.*mobile))|kindle|silk/i.test(ua);
};

interface ICustomWebcamProps {
    handleTakePhoto: (dataUri: string) => Promise<void>;
    handleCloseCamera: () => void;
}

export function CustomWebcam({ handleTakePhoto, handleCloseCamera }: ICustomWebcamProps) {
    const webcamRef = useRef<Webcam | null>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [deviceId, setDeviceId] = useState<string | undefined>();
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const theme = useTheme();
    const isLandscape = useMediaQuery('(orientation: landscape)');
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const getDimensions = () => {
        if (isMobile || isTablet) {
            return {
                width: '100vw',
                height: '100vh',
                maxWidth: 'none',
                maxHeight: 'none'
            };
        }
        return {
            width: isLandscape ? '90vw' : '80vw',
            height: isLandscape ? '80vh' : '90vh',
            maxWidth: '1200px',
            maxHeight: '1200px'
        };
    };

    const getAspectRatio = () => {
        if (isMobile) return isLandscape ? 16 / 9 : 9 / 16;
        if (isTablet) return isLandscape ? 4 / 3 : 3 / 4;
        return 4 / 3;
    };

    useEffect(() => {
        setIsMobile(isMobileDevice());
        setIsTablet(isTabletDevice());
        navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
            const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
            setDevices(videoDevices);
            if (videoDevices.length > 0 && !deviceId) {
                setDeviceId(videoDevices[0].deviceId);
            }
        });
    }, []);

    const videoConstraints: MediaTrackConstraints = {
        facingMode,
        deviceId: deviceId ? { exact: deviceId } : undefined,
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) setImgSrc(imageSrc);
        }
    }, []);

    const switchCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    const handleConfirm = async () => {
        if (imgSrc) await handleTakePhoto(imgSrc);
    };

    const shouldShowDeviceSelector = isDesktop && devices.length > 0 && !imgSrc;

    return (
        <Box sx={{
            ...getDimensions(),
            backgroundColor: 'black',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: "100%",
            height: "100%"
        }}>
            {/* Camera/Preview Area */}
            <Box sx={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}>
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt="Captured"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            marginTop: "32px"
                        }}
                    />
                ) : (
                    <>
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                aspectRatio: getAspectRatio(),
                            }}
                        />

                        {/* Device Selector (Top Right) */}
                        {shouldShowDeviceSelector && (
                            <Select
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    '& .MuiSelect-icon': {
                                        color: 'white'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.9)'
                                    }
                                }}
                            >
                                {devices.map((device) => (
                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}

                        {/* Capture Button (Bottom Center) */}
                        <IconButton
                            onClick={capture}
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                            }}
                            size="large">
                            <CameraIcon fontSize="large" />
                        </IconButton>
                    </>
                )}

                {/* Switch Camera (Mobile only - Top Right) */}
                {isMobile && !imgSrc && !shouldShowDeviceSelector && (
                    <IconButton
                        onClick={switchCamera}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                        }}
                    >
                        <FlipCameraAndroidIcon />
                    </IconButton>
                )}

                {/* Close Button (Top Left) */}
                <IconButton
                    onClick={handleCloseCamera}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Bottom Action Buttons (Retake/Confirm) */}
            {imgSrc && (
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ReplayIcon />}
                        onClick={() => setImgSrc(null)}
                        size="large">
                        {"Retake"}
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={handleConfirm}
                        size="large">
                        {"Confirm"}
                    </Button>
                </Box>
            )}
        </Box>
    );
};