"use client";

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { CartContext } from '@/context/CartContext';
import { OrdersContext } from '@/context/OrdersContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/CartPage.css';

const countries = [
    { name: 'United States', code: '+1' },
    { name: 'India', code: '+91' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Australia', code: '+61' },
    { name: 'Canada', code: '+1' },
    // Add more countries as needed
];


const CartPage = () => {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [address, setAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone:'',
    });
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to the first country
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('')

    const handleCountryChange = (e) => {
        const country = countries.find((c) => c.name === e.target.value);
        setSelectedCountry(country);
        setAddress((prevAddress) => ({
            ...prevAddress,
            phone: `${country.code} ${phoneNumber}`, // Concatenate the new country code with the current phone number
        }));
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;

        // Allow only numeric input
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Restrict to 10 digits
        if (value.length > 10) {
            return;
        }
        setPhoneNumber(value);
        setAddress((prevAddress) => ({
            ...prevAddress,
            phone: `${selectedCountry.code}${value}`, 
        }));
        if (value.length < 10) {
            setErrorMessage('Enter a valid phone number');
        } else {
            setErrorMessage('');
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity === 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, quantity);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleSaveAddress = () => {
        if (!address.name || !address.street || !address.city || !address.state || !address.zip) {
            toast.error("Please fill in all address fields.");
            return;
        }
        console.log("Address before saving:", address); // Debugging: Log the address before saving
        setIsAddressSaved(true);
        setIsAddressModalOpen(false);
        toast.success("Address saved successfully.");
        console.log("Address saved successfully. isAddressSaved:", isAddressSaved); // Debugging: Log the state
    };

    const handleBuyNow = async () => {
        if (!isAddressSaved) {
            toast.error("Please select and save an address before placing the order.");
            return;
        }
        if (!user || !user.email) {
            toast.error("User email is not available. Please log in.");
            return;
        }
        const formattedItems = cart.map((item) => ({
            name: item.name,
            type: item.type,
            selectedSize: item.selectedSize,
            selectedPrice: item.selectedPrice,
            quantity: item.quantity,
        }));

        const order = {
            userEmail: user.email,
            id: Date.now(),
            date: new Date(),
            items: formattedItems,
            address:{
                ...address,
                phone:`${selectedCountry.code} ${phoneNumber}`,
            },
            totalAmount: cart.reduce((total, item) => total + item.selectedPrice * item.quantity, 0),
            currency: cart[0].currency,
        };
        console.log("Order before sending:", order); // Debugging: Log the order before sending
        try {
            const response = await fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            })
            if (response.ok) {
                toast.success("Order placed successfully");
                clearCart();
                router.push('/');
            } else {
                const errorData = await response.json();
                console.error("Error response from backend:", errorData);
                toast.error("Failed to place order. Please try again.");
            }
        } catch (error) {
            toast.error("Error placing order. Please try again later.");
        }
    };

    const totalAmount = cart.reduce((total, item) => total + item.selectedPrice * item.quantity, 0);

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cart.length > 0 ? (
                <div>
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${item.selectedSize}-${index}`} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h2>{item.name}</h2>
                                <p>Type: {item.type}</p>
                                <p>Size: {item.selectedSize}</p>
                                <p>Price: {item.currency} {item.selectedPrice}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h2>Total Amount: {cart[0].currency} {totalAmount}</h2>
                    </div>
                    {isAddressSaved && (
                        <div className="saved-address">
                            <h3>Shipping Address</h3>
                            <p><strong>Name:</strong> {address.name}</p>
                            <p><strong>Phone:</strong> {address.phone}</p>
                            <p><strong>Street:</strong> {address.street}</p>
                            <p><strong>City:</strong> {address.city}</p>
                            <p><strong>State:</strong> {address.state}</p>
                            <p><strong>Zip Code:</strong> {address.zip}</p>
                        </div>
                    )}
                    <div className="cart-actions">
                        <button onClick={() => setIsAddressModalOpen(true)} className="select-address-button">
                            Select Address
                        </button>
                        <button onClick={handleBuyNow} className="buy-now-button">
                            Buy Now
                        </button>
                    </div>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}

            {isAddressModalOpen && (
                <div className="address-modal">
                    <div className="address-modal-content">
                        <h3>Enter Shipping Address</h3>
                        <form>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={address.name}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            {/* <div>
                                <label htmlFor="country">Country:</label>
                                <select
                                    id="country"
                                    value={selectedCountry.name}
                                    onChange={handleCountryChange}
                                >
                                    {countries.map((country) => (
                                        <option key={`${country.code}-${country.name}`} value={country.name}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
                            <div>
                                <label htmlFor="phone">Phone Number:</label>
                                <div className='phone-input-container'>
                                    <select
                                        id="country"
                                        value={selectedCountry.name}
                                        onChange={handleCountryChange}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            backgroundColor: '#fff',
                                            appearance: 'auto',
                                            flex:'1',
                                        }}
                                    >
                                        {countries.map((country) => (
                                            <option key={`${country.code}-${country.name}`} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <span>{selectedCountry.code}</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        placeholder="Enter phone number"
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                        maxLength="10"
                                    />
                                </div>
                                {errorMessage && (
                                    <p style={{ color: 'red', marginTop: '4px' }}>
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="street">Street:</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={address.street}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="city">City:</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="state">State:</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="zip">Zip Code:</label>
                                <input
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    value={address.zip}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                        </form>
                        <div className="modal-actions">
                            <button onClick={() => setIsAddressModalOpen(false)} className="close-modal-button">
                                Close
                            </button>
                            <button onClick={handleSaveAddress} className="save-address-button">
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
};

export default CartPage;