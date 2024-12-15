import { useState } from "react";
import axios from "axios";

const EdibilityChecker = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setResult(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select an image to upload.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        // Convert the image to base64
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
            const base64Image = reader.result;

            try {
                // Send the image to the Flask server
                const response = await axios.post("http://localhost:5000/analyze-image", {
                    image: base64Image,
                });

                setResult(response.data);
            } catch {
                setError("An error occurred while analyzing the image.");
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            setError("Failed to read the file. Please try again.");
            setLoading(false);
        };
    };

    return (
        <div className="w-[70%] h-[80%] border-2 border-mlsa-sky-blue rounded-md px-3 py-2 text-white">
            <div className="flex items-center justify-between flex-col mb-2">
                <h1 className="text-xl font-bold mb-4 text-white w-full">Food Edibility Checker</h1>
                <hr className="border-none bg-mlsa-sky-blue w-full h-1" />
            </div>
            <div className="w-full flex items-center justify-between">
                <input type="file" accept="image/*" onChange={handleFileChange} className="border-2 border-mlsa-sky-blue px-3 py-2 rounded-md w-[70%]" />
                <button
                    className="border-2 border-mlsa-sky-blue text-white font-bold text-[1rem] px-6 py-3 rounded-md transition duration-100 ease-in-out hover:bg-[#2b8484] hover:text-white"
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Check Edibility"}
                </button>
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {result && (
                <div className="mt-4 flex gap-3 justify-between w-full flex-col text-left">
                    <h2 className="font-bold text-3xl">Results:</h2>
                    <p className="text-2xl">
                        Edible:{" "}
                        <span className={result.is_edible ? "text-green-500 font-bold italic" : "text-red-500 font-bold italic"}>
                            {result.is_edible ? "Yes" : "No"}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default EdibilityChecker;