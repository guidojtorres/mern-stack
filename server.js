require('dotenv').config({ path: './config.env' });

const express = require('express')
const cors = require('cors')
const path = require('path')
const dbo = require('./db')
const PORT = process.env.PORT || 5000;
const app = express()


//Definimos el uso de cors y respuestas json para la app
app.use(cors())
app.use(express.json())
app.use(express.static(
    path.join(__dirname, './client/build')
)
)
//Requerimos las rutas
app.use(require('./routes'))
app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, './client/build/index.html')
    )
})
//Conectarse a la base de datos cuando empieza el server

dbo.connectToServer(
    function (err) {
        if (err) {
            console.error(err);
            process.exit();
        }

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`)
        })
    }
)