const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const corsMiddleware = require('./config/cors');
const dotenv = require('dotenv');
dotenv.config();

//import routes
const register = require('./routes/register')
const login = require('./routes/login')
const getDataByGeo = require('./routes/API/getDataByGeo')
const getDataForecastByGeo = require('./routes/API/getDataForecastByGeo')
const userRoutes = require('./routes/userRoutes');


//middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//endpoint utama
app.get('/', (req, res) => {
    res.send('Selamat datang di server kami!')
})

//Endpoint login
app.use('/login', login)
app.use('/register', register)
app.use('/api', getDataByGeo)
app.use('/api/forecast', getDataForecastByGeo)
app.use('/users/', userRoutes)

app.use((req, res, next) => {
    res.status(404).send('Endpoint yang diminta tidak ditemukan.')
})

app.listen(8080, "0.0.0.0");
console.log('Server running at http://localhost:8080/'); 