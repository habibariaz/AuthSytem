// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = "mongodb+srv://habibariaz:0000@authsystem.cpwmr.mongodb.net/AuthSystem"
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err)); () => {
        console.log("Connected DB")
    }

//user schema 
const signUpSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
})

const signUp = mongoose.model("SignUp", signUpSchema);


app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        let flag = 0;
        // Check if user already exists
        const existingUser = await signUp.findOne({ email: email });
        if (existingUser) {
            flag = 1;
            return res.json({ msg1: false })
        } else {
            // Create a new user
            const newUser = new signUp({ name, email, password, phone });

            // Save the new user
            await newUser.save();
            res.status(201).send({ msg2: true });
        }
    } catch (err) {
        console.error(err);
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;


        // Log input values for troubleshooting
        // console.log('Received:', email, password);

        const validation = await signUp.findOne({ email: email, password: password });

        // Log the result of the database query
        // console.log('Validation result:', validation);

        if (!validation) {
            return res.status(401).json({ message: "Invalid Details...!!!" });
        }

        res.status(200).json({ message: "Login successfully...!!!!" });
    } catch (error) {
        console.log(error)
    }
})

app.post('/updatepassword', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received: ",req.body)

        //check user exists or not
        const user = await signUp.findOne({ email: email });
        console.log("Database USer: ", user)

        if (!user) {
            return res.status(401).json({ message: "Incorrect Email...!!!" });
        } else {
            await signUp.updateOne({ email:email ,password: password })
            res.status(200).json({ message: "Password updated successfully!" });
        }



    } catch (error) {
        console.log(error)
    }
})

app.post('/deleteuser', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await signUp.findOneAndDelete({ email: email });

        if (user) {
            return res.json({ message: "User Deleted Successfully...!!!" });
        }
    } catch (error) {
        console.log(error)
    }
})


















// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});