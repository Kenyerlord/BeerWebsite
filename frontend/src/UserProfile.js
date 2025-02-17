import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const UserProfile = ({ user }) => {
    const [profile, setProfile] = useState({
        mobile: '',
        countryaddress: '',
        cityaddress: '',
        streetaddress: '',
        houseaddress: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Decode the token to get the user ID
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        const decoded = jwtDecode(token);
        console.log('User  ID from token:', decoded.id);
        return decoded.id; // Ensure the token contains the user ID
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = getUserIdFromToken();
                if (!userId) return;

                const response = await axios.get(`http://localhost:8080/termek/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch user profile');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        try {
            const userId = getUserIdFromToken();
            if (!userId) return;

            const payload = {
                bid: userId,
                mobile: profile.mobile,
                countryaddress: profile.countryaddress,
                cityaddress: profile.cityaddress,
                streetaddress: profile.streetaddress,
                houseaddress: profile.houseaddress
            };

            console.log('Sending payload:', payload); // Log the payload

            const response = await axios.put(
                'http://localhost:8080/termek/update',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Profile updated successfully');
                setError('');
            } else {
                console.log('Update response:', response.data);
                setError('Failed to update profile');
                setSuccess('');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('An error occurred while updating the profile');
            setSuccess('');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>User Profile</h2>
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="mobile">Mobile:</label>
                    <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="countryaddress">Country Address:</label>
                    <input
                        type="text"
                        id="countryaddress"
                        name="countryaddress"
                        value={profile.countryaddress}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="cityaddress">City Address:</label>
                    <input
                        type="text"
                        id="cityaddress"
                        name="cityaddress"
                        value={profile.cityaddress}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="streetaddress">Street Address:</label>
                    <input
                        type="text"
                        id="streetaddress"
                        name="streetaddress"
                        value={profile.streetaddress}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="houseaddress">House Address:</label>
                    <input
                        type="text"
                        id="houseaddress"
                        name="houseaddress"
                        value={profile.houseaddress}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }}>
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default UserProfile;