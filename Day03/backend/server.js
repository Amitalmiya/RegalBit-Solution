const express = require('express')
const PORT = 5000;
const user = require("./route/user")

const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to HTTP response"})
})


app.get('/api/message', (req, res) => {
    res.status(200).json({message: "Hello, This is https response from Express js"})
})


app.get("/api/users", (req, res) => {
    res.status(201).json({message: "user succefully register"})
});


app.listen(5000, ()=> console.log(`Server Running at http://localhost:${PORT}`));