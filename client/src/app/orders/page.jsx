"use client";

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import '@/styles/OrdersPage.css';

const OrdersPage = () => {
    const { user } = useContext(AuthContext); // Get the logged-in user's details
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user.email) return;

            try {
                const response = await fetch(`http://localhost:5000/orders?email=${user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <div className="orders-page">
            <h1>My Orders</h1>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Shipping Address</th>
                        <th>Total Amount</th>

                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            <p>
                                                <strong>{index + 1}. Name:</strong> {item.name}
                                            </p>
                                            <p style={{ marginLeft: "16px" }}>
                                                <strong>Type:</strong> {item.type}
                                            </p>
                                            <p style={{ marginLeft: "16px" }}>
                                                <strong>Qty:</strong> {item.quantity}
                                            </p>
                                            <p style={{ marginLeft: "16px" }}>
                                                <strong>Price:</strong> {item.currency} {item.selectedPrice}
                                            </p>
                                            <p style={{ marginLeft: "16px" }}>
                                                <strong>Total:</strong> {item.currency} {item.quantity * item.selectedPrice}
                                            </p>
                                            {/* {item.name} (Type: {item.type}, Size: {item.selectedSize}, Qty: {item.quantity}, Price: {item.currency} {item.selectedPrice}, Total Price:{item.currency} {item.quantity*item.selectedPrice}) */}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <p><strong>Name:</strong> {order.address.name}</p>
                                <p><strong>Street:</strong> {order.address.street}</p>
                                <p><strong>City:</strong> {order.address.city}</p>
                                <p><strong>State:</strong> {order.address.state}</p>
                                <p><strong>Zip:</strong> {order.address.zip}</p>
                                <p><strong>Phone:</strong> {order.address.phone}</p>
                            </td>
                            <td>{order.currency} {order.totalAmount}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;