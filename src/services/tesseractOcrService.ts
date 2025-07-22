export async function ExtractDataFromThaiIdCard(base64ImageStr: string) {
    try {
        console.log(`Sending ${base64ImageStr} image to backend`);
        const response = await fetch("https://tesseract-ocr-tan.vercel.app/api/ocr/thai-id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": import.meta.env.VITE_X_API_KEY,
            },
            body: JSON.stringify({ base64ImageStr: base64ImageStr }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error sending image to backend:", error);
        throw error;
    }
};