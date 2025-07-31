require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
mongoose.connect(process.env.MONGO_URI)

const taskSchema = new mongoose.Schema({
    text: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)

const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

// when the user signup, he should be logged in after automatically too

app.post('/signup', async (req, res) => {
    try {
        const {username, password} = req.body;
        const existingUser = await User.findOne({username})
        if (existingUser) {
            return res.status(400).json({message: 'Username already taken'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({username, password: hashedPassword})
        await newUser.save()
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.SECRET_KEY);
        res.status(201).json({ message: 'User created successfully!', token });

    }   catch (err) {
        res.status(500).json({message: 'Error creating user', error: err})
    }

})

app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json({message: 'Invalid username or password'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid username or password'})
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.SECRET_KEY);
        res.json({message: 'Login successful!', token})

    } catch (err) {
        res.status(500).json({message: 'Error logging in', error: err})
    }
})


function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'No token provided'})
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = decoded.userId
        next()
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired token'})
    }
}



app.post('/tasks', authMiddleware, async (req, res) => {
    const task = new Task({ text: req.body.text, userId: req.userId })
    await task.save();
    res.status(201).json({ message: 'Task saved!', task})
})


app.get('/tasks', authMiddleware, async (req, res) => {
    const tasks = await Task.find({userId: req.userId})
    res.json(tasks)
})

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOneAndDelete({_id: req.params.id, userId: req.userId})
    if (!task) {
        return res.status(404).json({message: 'Task not found or not yours'})   
    }

    res.json({message: 'Task deleted', task})
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});