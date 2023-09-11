const mongoose = require('mongoose');
const Player = mongoose.model('Player');

const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secrets');

module.exports = app => {

    // Route for fetching players
    app.get('/fetchPlayers', async (req, res) => {
        try {
            // Verify the JWT token
            const token = req.headers.authorization?.split(' ')[1];
            const decodedToken = jwt.verify(token, secretKey);

            // Retrieve players based on the therapist ID from the token
            const players = await Player.find({ therapist: decodedToken.id },
                '_id fullName points');

            res.json(players);
        } catch (error) {
            console.error('Error fetching players:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Route for fetch a player detail
    app.post('/fetchPlayerDetail', async (req, res) => {
        try {
            // Retrieve player based on the ID
            const player = await Player.findOne({ _id: req.body.id });

            res.json(player);
        } catch (error) {
            console.error('Error fetching player detail:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Route for creating a player
    app.post('/createPlayer', async (req, res) => {
        try {
            // Verify the JWT token
            const token = req.headers.authorization?.split(' ')[1];
            const decodedToken = jwt.verify(token, secretKey);

            // Create a new player document
            const player = new Player({
                fullName: req.body.fullName,
                therapist: decodedToken.id,
                points: 0,
                movement: true,
                turn: true,
                difficulty: 0,
                floorUnlocked: 0,
            });

            // Save the player document
            await player.save();

            res.status(201).json({ message: 'Player created successfully' });
        } catch (error) {
            console.error('Error creating player:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Route for updating a player settings
    app.post('/updatePlayerSettings', async (req, res) => {
        try {
            // Retrieve player based on the ID
            const player = await Player.findOne({ _id: req.body.id });

            if (!player) {
                res.status(404).json({ error: 'Player not found' });
                return;
            }

            // Update the player settings based on the request body
            player[req.body.key] = req.body.value;

            // Save the player document
            await player.save();

            res.json({ message: 'Player settings updated successfully' });
        } catch (error) {
            console.error('Error updating player settings:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    // Route for deleting a player
    app.post('/deletePlayer', async (req, res) => {
        try {
            // Retrieve player based on the ID
            const player = await Player.findOne({ _id: req.body.id });

            if (!player) {
                res.status(404).json({ error: 'Player not found' });
                return;
            }

            // Delete the player
            await Player.deleteOne({ _id: req.body.id });

            res.json({ message: 'Player deleted successfully' });
        } catch (error) {
            console.error('Error deleting player:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};