import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate(); // ✅ Corrected usage inside the function

    const [formData, setFormData] = useState({
        First_Name: "",
        Last_Name: "",
        Phone: "",
        Email: "",
        Password: "",
        Role: "ordinary_user", // Default role
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseURL = import.meta.env.VITE_API_URL;
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const response = await axios.post(`${baseURL}/signup`, formData);

            setSuccess(response.data.message);
            setFormData({
                First_Name: "",
                Last_Name: "",
                Phone: "",
                Email: "",
                Password: "",
                Role: "ordinary_user",
            });

            // ✅ Redirect to login after success
            setTimeout(() => {
                navigate("/auth/login");
            }, 2000); // 2-second delay to show success message

        } catch (err) {
            setError(err.response?.data?.errorMessage || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Sign Up</h2>
            {error && <p className="alert alert-danger">{error}</p>}
            {success && <p className="alert alert-success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" name="First_Name" className="form-control" value={formData.First_Name} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="Last_Name" className="form-control" value={formData.Last_Name} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" name="Phone" className="form-control" value={formData.Phone} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="Email" className="form-control" value={formData.Email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="Password" className="form-control" value={formData.Password} onChange={handleChange} required />
                    <small className="text-muted">
                        Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.
                    </small>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Signup;
