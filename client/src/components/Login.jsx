import { useState } from "react";
import axios from "../../../server/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userEmail", formData.email);
            toast.success("Login successful!");
            navigate("/");
        } catch (err) {
            console.error(err.response.data.errors || err.response.data.message);
            toast.error(err.response.data.message || "Login failed");
        }
    };

    return (
        <form className="w-full h-full p-2 mb-2" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-mlsa-sky-blue py-1 rounded-md font-bold uppercase text-black transition ease-in-out duration-100 hover:bg-[#1b5555] hover:text-white"
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default Login;