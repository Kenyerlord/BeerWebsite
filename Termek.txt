var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations');
var jwt = require('jsonwebtoken');

router.get('/', async function(req, res, next) {
    try {
        const termek = await Db.selectTermek();
        res.json(termek);
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

router.get('/card', async (req, res) => {
    try {
        const card = await Db.selectCard();
        res.json(card);
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

router.get('/account', async function(req, res, next) {
    const { name, password } = req.query;
    console.log('Received:', { name, password });
    try {
        const user = await Db.selectUser (name, password);
        if (user) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await Db.insertUser (name, password, email); 
        res.status(201).json({ success: true, message: 'User  created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ success: false, message: 'Error creating user' });
    }
});

router.put('/update', async (req, res) => {
    console.log('Received update request:', req.body); 
    const { bid, mobile, countryaddress, cityaddress, streetaddress, houseaddress } = req.body;

    try {
        const result = await Db.updateUser (bid, mobile, countryaddress, cityaddress, streetaddress, houseaddress);
        console.log('Update result:', result); 
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'User  updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User  not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        console.error('Error details:', error.message); 
        res.status(400).json({ success: false, message: 'Error updating user', error: error.message });
    }
});

const JWT_SECRET = 'banana';

router.post('/login', async function(req, res, next) {
    const { name, password } = req.body;
    try {
        const user = await Db.selectUser (name, password);
        if (user) {
            const token = jwt.sign({ id: user.bid, name: user.name }, JWT_SECRET, { expiresIn: '1800s' });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

router.get('/user/:id', async (req, res) => {
    const userId = req.params.id; 

    try {
        const user = await Db.selectUserById(userId); 
        if (user) {
            res.json(user); 
        } else {
            res.status(404).json({ success: false, message: 'User  not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/order', async (req, res) => {
    const { cart, buyerId } = req.body; 
    const connection = await Db.pool.getConnection(); 

    try {
        await connection.beginTransaction(); 
        const [maxBidResult] = await connection.query('SELECT MAX(bid) AS maxBid FROM buyerbeer');
        const newBid = (maxBidResult[0].maxBid || 0) + 1;
        for (const item of cart) {
            const beerId = item.beer.ID; 
            const quantity = item.quantity;

            const query = 'INSERT INTO buyerbeer (bid, beerid1, buyerid, number) VALUES (?, ?, ?, ?)';
            await connection.query(query, [newBid, beerId, buyerId, quantity]);
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Order placed successfully', bid: newBid });
    } catch (error) {
        await connection.rollback(); 
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Error placing order' });
    } finally {
        connection.release(); 
    }
});

module.exports = router;