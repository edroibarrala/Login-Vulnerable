 const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const SECRET_KEY = "mi_clave_secreta_super_segura";

const users = [
    { id: 1, username: 'edwar', password: 'password' },
    { id: 2, username: 'lara', password: '123456' }
];


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign(
            {id: user.id, username: user.username},
            SECRET_KEY,
            {expiresIn: '1h'}
        );
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials - Ibarra Lara' });
    }
});

const verifyToken = require('./middleware/auth');

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard, Edwar Ibarra!',
        users: req.user
     }) 
});     

app.get('/public', (req, res) => {
    res.json({ message: 'This is a public endpoint, Edwar Ibarra!' });
});


app.get('/', (req, res) => {
    res.json({ message: 'Hello Edwar Ibarra' });
});

app.get('/steal', (req, res) => {
    console.log("TOKEN ROBADO:", req.query.token);
    res.json({ message: "Token robado, Edwar Ibarra!" });
});

app.listen(4000, () => {
    console.log("server is running' - Edwar Ibarra en http://localhost:4000");
});