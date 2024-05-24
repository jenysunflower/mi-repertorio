// 1.- Se instala dependencia de express y pg
// 2. Se importan las dependencias
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app =  express()
const PORT = 3000

// Creación de variables de entorno
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Importación de consultas. como son varias se usa tipo objeto
import {nuevaCancion, listarCanciones, editarCancion, eliminarCancion} from './sql.js'


// Middleware mínimo par permitir a express que reciba json
app.use(express.json())

// Abrimos la ruta principal con el get y callback
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// 1.- POST /cancion: Recibe los datos correspondientes a una canción y realiza la inserción
// en la tabla canciones
app.post('/cancion', async (req, res) => {
    try {
        const response = await nuevaCancion(req.body); // obtenemos la información ingresada por el usuario en el formulario
        res.status(200).send('Ok') // respuesta correcta y se envía la información
        console.log(response)
        
    } catch (e) {
        console.error('Error al insertar datos:', e)
    }
})

//2.- GET /canciones: Devuelve un JSON con los registros de la tabla cancione
app.get('/canciones', async (req, res) => {
    try{
        const response = await listarCanciones();
        res.status(200).json(response.rows)
    }catch(e){
        console.error('Error al realizar la consulta de canciones', e)
    }
})


//3.- Crear una ruta PUT /cancion que reciba los datos de una canción que se desea editar,
//ejecuta una función asíncrona para hacer la consulta SQL correspondiente y actualice
//ese registro de la tabla canciones

app.put('/cancion/:id', async (req, res) => {
    try{
        const id = req.params.id 
        const {titulo, artista, tono} = req.body
        console.log('id:', id)
        const response = await editarCancion({id, titulo, artista, tono});
        res.status(200).send( response)
    }catch(e){
        console.error('error al actualizar', e)
    }
})


//4.- Crear una ruta DELETE /cancion que reciba por queryString el id de una canción y
//realiza una consulta SQL a través de una función asíncrona para eliminarla de la base de datos
app.delete('/cancion', async (req, res) => {
    try{
        const id = req.query.id 
        const response = await eliminarCancion(id)
        res.status(200).send(response.rows)
    }catch(e){
        console.error('error al eliminar', e)
    }
})

//Levantar servidor
app.listen(PORT, () => console.log('Server arriba en puerto', PORT))