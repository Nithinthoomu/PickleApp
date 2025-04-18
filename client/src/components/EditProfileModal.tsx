"use client";

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/EditProfileModal.css';

interface EditProfileModalProps {
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const { user, login } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/update-profile', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: user._id, // Include user ID
                    username,
                    email
                })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.user);
                toast.success("Profile updated successfully", {
                    onClose: () => {
                        setTimeout(() => {
                            onClose()
                        }, 500)
                    }
                })
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <h2>Edit Profile</h2>
                <form onSubmit={handleUpdate}>
                    <div className='form-group'>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-buttons'>
                        <button type="submit" className='update-button'>Update</button>
                        <button type="button" className='cancel-button' onClick={onClose}>Cancel</button>
                    </div>
                </form>
                <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} />
            </div>
        </div>
    );
}

export default EditProfileModal;
