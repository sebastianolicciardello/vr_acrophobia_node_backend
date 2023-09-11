const mongoose = require('mongoose');
const {Schema} = mongoose;

const playerSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    therapist: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0 
    },
    movement: {
        type: Boolean,
        default: true 
    },
    turn: {
        type: Boolean,
        default: true 
    },
    difficulty: {
        type: Number,
        default: 0 
    },
    floorUnlocked: {
        type: Number,
        default: 0 
    }
});

mongoose.model('Player', playerSchema);