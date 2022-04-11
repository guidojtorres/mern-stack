const express = require('express')
const router = express.Router()
const dbo = require('./db')
const {ObjectID} = require("mongodb");



router.route('/api/comentarios/:movie_id').get(async function (req, res) {
    const dbConnect = dbo.getDb();

    const objID = ObjectID(req.params.movie_id)
    dbConnect
        .collection('comments')
        .find({movie_id:objID})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error encontrando las entradas')
            } else {
                res.status(200).json(result)
            }
        })
})

router.route('/api/nuevoComentario').post(function (req, res) {
    const dbConnect = dbo.getDb()


    const objMovieID = ObjectID(req.body.id)

    const matchDocument = {
        name: req.body.nombre,
        email: req.body.email,
        movie_id: objMovieID,
        text: req.body.texto,
        date: new Date()
    }

    dbConnect
        .collection('comments')
        .insertOne(matchDocument, function (err, result) {
            if (err) {
                res.status(400).send('Error insertando comentario')
            } else {
                console.log(`Agregado un nuevo comentario con id ${result.insertedId}`)
                res.status(204).send('Bien ahi');
            }
        })
})

router.route('/api/peliculas').get(async function (req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('movies')
        .find({})
        .limit(50)
        .toArray((err, result) => {
            if (err) {
                res.status(400).send('Error encontrando peliculas')
            } else {
                res.status(200).json(result)
            }
        })
})
router.route('/api/borrarComentario').delete((req, res) => {
    const dbConnect = dbo.getDb();
    const cualBorrar = {_id: ObjectID(req.body.id)}

    dbConnect
        .collection('comments')
        .deleteOne(cualBorrar, function (err) {
            if (err) {
                res.status(400).send(`Error borrando el comentario con id ${cualBorrar._id}`)
            } else {
                console.log(`Borrado comentario con id ${req.body.id}`)
                res.status(204).send('Borrado')
            }
        })
})

module.exports = router;