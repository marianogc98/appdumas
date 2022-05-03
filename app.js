const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express();

//set motor de plantillas
app.set('view engine', 'ejs')

//setear public
app.use(express.static(__dirname + '/public'));

//para procesar datos enviados desde formularios
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//variables de entorno
dotenv.config({path: './env/.env'})

//set cookies
app.use(cookieParser())

//llamar router
app.use('/', require('./routes/router'))

//eliminar el cache luego de logout
app.use(function(req,res,next){
    if(!req.user){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        next();
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})