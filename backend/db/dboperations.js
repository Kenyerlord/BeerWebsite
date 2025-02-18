const config = require('./dbconfig');
const sql = require('mysql2/promise');

const pool = sql.createPool(config);

async function selectTermek() {
    try { 
        const [rows] = await pool.query('select * from beer_database');
        return rows;
    } catch (error) {
        throw error;
    } 
}

async function selectCard() {
    try { 
        const [rows] = await pool.query('select Name, Price FROM beer_database');
        return rows;
    } catch (error) {
        throw error;
    } 
}

async function selectUser (name, password) {
    console.log('Querying user with:', { name, password }); // Log the input values
    const query = 'SELECT * FROM buyer WHERE name = ? AND password = ?';
    const [result] = await pool.query(query, [name, password]); // Use pool.query instead of db.execute

    return result.length > 0 ? result[0] : null;
}

async function insertUser (name, email, password) {
    const query = 'INSERT INTO buyer (name, password, email) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, email, password]);
    return result;
}

async function updateUser (userId, mobile, countryaddress, cityaddress, streetaddress, houseaddress) {
    const query = `
        UPDATE buyer 
        SET mobile = ?, countryaddress = ?, cityaddress = ?, streetaddress = ?, houseaddress = ? 
        WHERE bid = ?;
    `;
    const [result] = await pool.query(query, [mobile, countryaddress, cityaddress, streetaddress, houseaddress, userId]);
    return result;
}

async function selectUserById(userId) {
    const query = 'SELECT mobile, countryaddress, cityaddress, streetaddress, houseaddress FROM buyer WHERE bid = ?';
    const [result] = await pool.query(query, [userId]);

    return result.length > 0 ? result[0] : null; // Return the user data or null if not found
}

async function insertOrder(cart, buyerId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction

        const [maxBidResult] = await connection.query('SELECT MAX(bid) AS maxBid FROM buyerbeer');
        const newBid = (maxBidResult[0].maxBid || 0) + 1; // Increment the max bid or start from 1

        for (const item of cart) {
            const beerId = item.beer.id; // Assuming each beer has an 'id' property
            const quantity = item.quantity;

            const query = 'INSERT INTO buyerbeer (bid, beerid1, buyerid, number) VALUES (?, ?, ?, ?)';
            await connection.query(query, [newBid, beerId, buyerId, quantity]); // Use the new bid
        }

        await connection.commit(); // Commit transaction
        return { success: true, message: 'Order placed successfully', bid: newBid };
    } catch (error) {
        await connection.rollback(); // Rollback transaction on error
        console.error('Error inserting order:', error);
        throw error; // Rethrow the error to be handled in the route
    } finally {
        connection.release(); // Release the connection
    }
}

module.exports = {
    pool,
    selectTermek,
    selectCard,
    selectUser ,
    insertUser ,
    updateUser ,
    selectUserById,
    insertOrder
}