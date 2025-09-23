const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const usersRoutes = require('./routes/userRoutes')

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is Live')
})

app.use('/api/users', usersRoutes)

app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
})

