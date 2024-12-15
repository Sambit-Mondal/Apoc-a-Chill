import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = ({ setLogin }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!validatePassword(formData.password)) {
            toast.error(
                "Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
            );
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
                formData
            );
            toast.success("Signup successful! Please log in.");
            setLogin(true); // Switch to Login tab
        } catch (err) {
            console.error(err.response.data.errors || err.response.data.message);
            toast.error(err.response.data.message || "Signup failed");
        }
    };

    return (
        <form className="w-full h-full p-2 mb-2" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-mlsa-sky-blue py-1 rounded-md font-bold uppercase text-black transition ease-in-out duration-100 hover:bg-[#1b5555] hover:text-white"
                >
                    Signup
                </button>
            </div>
        </form>
    );
};

// Define required props
Signup.propTypes = {
    setLogin: PropTypes.func.isRequired,
};

export default Signup;