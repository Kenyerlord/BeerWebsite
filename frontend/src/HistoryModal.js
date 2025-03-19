import React from 'react';

const HistoryModal = ({ isOpen, onClose, order, buyer }) => {
    if (!isOpen || !order || !order.items) return null; 

    const totalBeerPriceWithTax = order.items.reduce((total, item) => {
        const beerPrice = order.beerData[item.beerid1]?.price || 0; 
        return total + (beerPrice * item.number); 
    }, 0);


    const deliveryPrice = order.totalPrice - totalBeerPriceWithTax;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2 style={modalStyles.header}>Invoice</h2>
                <div style={modalStyles.detailsContainer}>
                    <div style={modalStyles.sellerDetails}>
                        <p style={modalStyles.text}>Seller: Lager Legends Co</p>
                        <p style={modalStyles.text}>Ireland</p>
                        <p style={modalStyles.text}>Dublin Brewery Road 56</p>
                        <p style={modalStyles.text}>Email: LagerLegends@gmail.com</p>
                        <p style={modalStyles.text}>Phone: +353 218 295</p>
                    </div>
                    <div style={modalStyles.buyerDetails}>
                        <p style={modalStyles.text}>Buyer: {buyer?.name || 'N/A'}</p> 
                        <p style={modalStyles.text}>Email: {buyer?.email || 'N/A'}</p>
                        <p style={modalStyles.text}>Phone: {buyer?.mobile || 'N/A'}</p> 
                    </div>
                </div>

                <p style={modalStyles.text}>Invoice Number: {order.orderId}</p>
                <p style={modalStyles.text}>Date of Issue: {order.purchaseDate}</p>
                <h3 style={modalStyles.subHeader}>Billing Information</h3>
                <p style={modalStyles.text}>Delivery Address:</p>
                <p style={modalStyles.text}>{order.house}, {order.street}, {order.city}, {order.country}</p>
                <h3 style={modalStyles.subHeader}>Items Purchased</h3>
                <div style={modalStyles.scrollableContent}>
                    <table style={modalStyles.table}>
                        <thead>
                            <tr>
                                <th style={modalStyles.tableHeader}>Description</th>
                                <th style={modalStyles.tableHeader}>Quantity</th>
                                <th style={modalStyles.tableHeader}>Price (Pre-Tax)</th>
                                <th style={modalStyles.tableHeader}>Price (After Tax)</th>
                                <th style={modalStyles.tableHeader}>Tax</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => {
                                const beerPrice = order.beerData[item.beerid1]?.price || 0; 
                                const preTaxPrice = (beerPrice / 1.23).toFixed(2); 
                                return (
                                    <tr key={index}>
                                        <td style={modalStyles.tableCell}>Beer Name: {order.beerData[item.beerid1]?.name || 'N/A'}</td>
                                        <td style={modalStyles.tableCell}>{item.number}</td>
                                        <td style={modalStyles.tableCell}>
                                            ${preTaxPrice} 
                                        </td>
                                        <td style={modalStyles.tableCell}>
                                            ${beerPrice.toFixed(2)} 
                                        </td>
                                        <td style={modalStyles.tableCell}>23%</td> 
                                    </tr>
                                );
                            })}
                            <tr>
                                <td style={modalStyles.tableCell}>Delivery Price</td>
                                <td style={modalStyles.tableCell}>{order.deliveryType || 'Standard'}</td> 
                                <td style={modalStyles.tableCell}></td> 
                                <td style={modalStyles.tableCell}>
                                    ${deliveryPrice.toFixed(2)}
                                </td>
                                <td style={modalStyles.tableCell}></td> 
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h3 style={modalStyles.total}>Total Amount Due: ${order.totalPrice.toFixed(2)}</h3> 
                <button onClick={onClose} style={modalStyles.closeButton}>Close</button>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#363636',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%',
        color: 'white',
        maxHeight: '80vh', 
        overflowY: 'auto', 
    },
    header: {
        color: 'white',
        textAlign: 'center',
    },
    detailsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    sellerDetails: {
        flex: 1,
        marginRight: '10px',
        padding: '10px',
        backgroundColor: '#444',
        borderRadius: '5px',
    },
    buyerDetails: {
        flex: 1,
        marginLeft: '10px',
        padding: '10px',
        backgroundColor: '#444',
        borderRadius: '5px',
    },
    subHeader: {
        color: 'white',
        marginTop: '20px',
    },
    text: {
        color: 'white',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    tableHeader: {
        borderBottom: '2px solid white',
        padding: '10px',
        textAlign: 'left',
        color: 'white',
    },
    tableCell: {
        borderBottom: '1px solid #ccc',
        padding: '10px',
        color: 'white',
    },
    total: {
        marginTop: '20px',
        fontSize: '1.5rem',
        color: '#28a745',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'block',
        width: '100%',
    },
    scrollableContent: {
        maxHeight: '300px', 
        overflowY: 'auto', 
    },
};

export default HistoryModal;