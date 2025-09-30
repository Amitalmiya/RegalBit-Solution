const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session')
const PORT = process.env.PORT || 5000;
const secret = 'Amit@123$'
const {pool} = require('./config/db')
const usersRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/authRouter')

app.use(express.json());
app.use(cors());

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookir: { maxAge: 1000 * 60 * 60, secure:false }
    })
);

app.get('/', (req, res) => {
    res.send('Server is Live')
})

app.use('/api/users', usersRoutes);

app.use('/api/auth', otpRoutes);


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

