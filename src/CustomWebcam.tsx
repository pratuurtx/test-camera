import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, MenuItem, Select, FormControl, Modal } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
    handleTakePhoto: (dataUri: string) => Promise<void>;
    handleCloseCamera: () => void;
}

export function CustomWebcam({ handleTakePhoto, handleCloseCamera }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>("");

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };
    const startCamera = async () => {
        stopStream()

        try {
            let constraints: MediaStreamConstraints = {
                video: { facingMode: "environment" }
            };

            if (selectedDevice) {
                constraints = { video: { deviceId: { exact: selectedDevice } } };
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play().catch(err => console.error("Error playing video:", err));
            }

            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = mediaDevices.filter(device => device.kind === "videoinput");
            setDevices(videoDevices);

            if (!selectedDevice && videoDevices.length > 0) {
                const backCamera = videoDevices.find(device =>
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear") ||
                    device.label.toLowerCase().includes("environtment")
                );

                if (!backCamera) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const tracks = stream.getVideoTracks();
                    const settings = tracks[0]?.getSettings();
                    tracks.forEach(track => track.stop());

                    if (settings?.facingMode === "environment") {
                        const environmentCamera = videoDevices.find(
                            device => device.deviceId === settings.deviceId
                        );
                        if (environmentCamera) {
                            setSelectedDevice(environmentCamera.deviceId);
                            return;
                        }
                    }
                }

                setSelectedDevice(backCamera?.deviceId || videoDevices[0].deviceId);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    await videoRef.current.play();
                }
            } catch (fallbackErr) {
                console.error("Fallback camera access failed:", fallbackErr);
            }
        }
    };

    useEffect(() => {
        startCamera();
        return () => stopStream();
    }, [selectedDevice]);

    const capturePhoto = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth || !video.videoHeight) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const uri = canvas.toDataURL("image/jpeg");
            setImgSrc(uri);
            stopStream();
        }
    };

    const confirmPhoto = async () => {
        if (imgSrc) {
            await handleTakePhoto(imgSrc);
            setImgSrc(null);
            startCamera();
        }
    };

    const retake = () => {
        setImgSrc(null);
        startCamera();
    };

    const handleDeviceChange = (event: any) => {
        setSelectedDevice(event.target.value);
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor: "black",
                overflow: "hidden",
            }}>
            {!imgSrc ? (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }} />
            ) : (
                <Modal
                    open={!!imgSrc}
                    onClose={retake}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.9)"
                    }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100dvw",
                            height: "100dvh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <img
                            src={imgSrc}
                            alt="Captured"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                cursor: "pointer"
                            }} />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 24,
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                gap: 2
                            }}>
                            <Button
                                variant="contained"
                                color="warning"
                                startIcon={<ReplayIcon />}
                                onClick={retake}>
                                Retake
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={confirmPhoto}>
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}

            <IconButton
                onClick={handleCloseCamera}
                sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                <CloseIcon />
            </IconButton>

            {!imgSrc && devices.length > 1 && (
                <FormControl
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        minWidth: 120,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        borderRadius: 1,
                    }}
                    size="small">
                    <Select
                        value={selectedDevice}
                        onChange={handleDeviceChange}
                        sx={{
                            color: "white",
                            "& .MuiSelect-icon": {
                                color: "white"
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    bgcolor: "#424242",
                                    color: "white"
                                }
                            }
                        }}>
                        {devices.map(device => (
                            <MenuItem
                                key={device.deviceId}
                                value={device.deviceId}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.1)"
                                    }
                                }}>
                                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {!imgSrc && (
                <IconButton
                    onClick={capturePhoto}
                    sx={{
                        position: "absolute",
                        bottom: 32,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}>
                    <CameraAltIcon sx={{ fontSize: 40 }} />
                </IconButton>
            )}
        </Box>
    );
}
