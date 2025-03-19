import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import HistoryModal from './HistoryModal';

const History = () => {
    const [groupedHistory, setGroupedHistory] = useState([]);
    const [beerData, setBeerData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [buyerData, setBuyerData] = useState(null); 

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User  is not logged in.');
                setLoading(false);
                return;
            }

            const decoded = jwtDecode(token);
            const userId = decoded.id; 

            try {
                const response = await axios.get(`http://localhost:8080/termek/purchase-history/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const groupedData = response.data.reduce((acc, item) => {
                    const key = `${item.bid}-${item.totalprice}-${item.deliverytype}`;
                    if (!acc[key]) {
                        acc[key] = {
                            orderId: item.bid,
                            totalPrice: item.totalprice,
                            purchaseDate: item.date || 'N/A', 
                            deliveryType: item.deliverytype || 'N/A', 
                            country: item.country || 'N/A', 
                            city: item.city || 'N/A',
                            street: item.street || 'N/A', 
                            house: item.house || 'N/A', 
                            buyerId: item.buyerid, 
                            items: []
                        };
                    }
                    
                    acc[key].items.push({
                        beerid1: item.beerid1, 
                        number: item.number 
                    });
                    return acc;
                }, {});

                setGroupedHistory(Object.values(groupedData));
            } catch (err) {
                setError('Error fetching purchase history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchBeerData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/termek');
                const beerMapping = {};
                response.data.forEach(beer => {
                    beerMapping[beer.ID] = {
                        name: beer.Name,
                        price: beer.Price
                    };
                });
                setBeerData(beerMapping); 
            } catch (err) {
                console.error('Error fetching beer data:', err);
            }
        };

        fetchPurchaseHistory();
        fetchBeerData();
    }, []);

    const openModal = async (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const userId = decoded.id; 

        try {
            const response = await axios.get(`http://localhost:8080/termek/user/${userId}`); 
            console.log('Buyer data fetched:', response.data);
            setBuyerData(response.data);
        } catch (err) {
            console.error('Error fetching buyer data:', err);
            setBuyerData(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setBuyerData(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Purchase History</h2>
            {groupedHistory.length === 0 ? (
                <p style={styles.emptyCart}>No purchase history found.</p>
            ) : (
                <ul style={styles.itemList}>
                    {groupedHistory.map((group) => (
                        <li key={group.orderId} style={styles.item}>
                            <h3 style={styles.orderId}>Order ID: {group.orderId || 'N/A'}</h3>
                            <p style={styles.totalPrice}>Total Price: ${group.totalPrice !== null ? group.totalPrice.toFixed(2) : 'N/A'}</p>
                            <p style={styles.purchaseDate}>Purchase Date: {group.purchaseDate || 'N/A'}</p>
                            <p style={styles.deliveryType}>Delivery Type: {group.deliveryType || 'N/A'}</p>
                            <p style={styles.deliveryAddress}>
                                Delivery Address: {group.house}, {group.street}, {group.city}, {group.country}
                            </p>
                            <button onClick={() => openModal(group)} style={styles.detailsButton}>View Details</button>
                            <ul style={styles.subItemList}>
                                {group.items.map((item, index) => (
                                    <li key={`${group.orderId}-${item.beerid1}-${index}`} style={styles.subItem}>
                                        <p>Beer Name: {beerData[item.beerid1]?.name || 'N/A'}</p>
                                        <p>Quantity: {item.number !== null ? item.number : 'N/A'}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
            <HistoryModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                order={{ ...selectedOrder, beerData }} 
                buyer={buyerData}
            />
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#363636',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '20px auto',
    },
    header: {
        fontSize: '2rem',
        color: 'white',
        marginBottom: '20px',
    },
    emptyCart: {
        fontSize: '1.2rem',
        color: 'white',
    },
    itemList: {
        listStyleType: 'none',
        padding: 0,
    },
    item: {
        margin: '10px 0',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        color: 'black',
    },
    orderId: {
        fontSize: '1.5rem',
        color: 'black',
    },
    totalPrice: {
        fontSize: '1.2rem',
        color: '#28a745',
    },
    purchaseDate: {
        fontSize: '1rem',
        color: 'black',
    },
    deliveryType: {
        fontSize: '1rem',
        color: 'black',
    },
    deliveryAddress: {
        fontSize: '1rem',
        color: 'black',
    },
    subItemList: {
        listStyleType: 'none',
        padding: 0,
    },
    subItem: {
        margin: '5px 0',
        padding: '5px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
    },
    detailsButton: {
        margin: '10px 0',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default History;