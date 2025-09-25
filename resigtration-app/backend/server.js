const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const {pool} = require('./config/db')
const usersRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is Live')
})

app.use('/api/users', usersRoutes);


async function initDB() {
    try {
        await pool.query('SELECT 1 AS result');
        console.log('Mysql connected Successfully');

        app.listen(PORT, ()=> {
            console.log(`Server runnning at http://localhost:${PORT}`);
        })
    } catch (err) {
        console.error('MYSQL connection error', err);
        process.exit(1);
    }
}

initDB();

