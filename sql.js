import pkg from 'pg'
const {Pool}  = pkg

//Se realiza la conexión y se instancia la constante pool
const pool = new Pool({
    //connectionString : 'postgresql: //postgres:contrasena@localhost:5432/repertorio'
    user:'postgres',
    host: 'localhost',
    password: 'password',
    database: 'repertorio',
    port : 5432
})


// Se crea función para agregar una nueva canción, exportable
export const nuevaCancion = async (objCancion) => {
    let client;
    // Recuperar informacion para dejarlo dentro de un array con valores, ya que la información llega como objeto
    //['cancion hola', 'me llamo artista'. 'soy el tono']
    const values = Object.values(objCancion)
    //Se prepara la consulta para prevenir SQL Injection
    const query = {
        name : 'insert-data',
        text : 'INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) returning * ',
        values
    }
    try {
        //Para conectar a la BD
        client = await pool.connect()
        const response = await client.query(query);
        return response
    } catch (e) {
        console.error('Hubo un error', e.stack) //Pila de errores, pero se pueden agregar más y más específicos
    }finally{
        if(client){
            client.release();
        }
    }
}

//No llega objeto 
export const listarCanciones = async () =>{
    let client;
    const query = {
        name : 'select-data',
        text : 'SELECT * FROM canciones ORDER BY id ASC'
    }
    try {
        //Para conectar a la BD
        client = await pool.connect()
        const response = await client.query(query);
        return response
        
    } catch (e) {
        console.error('Hubo un error', e.stack)
    }finally{
        if(client){
            client.release();
        }
    }
}

export const editarCancion = async (cancion) => {
    let client
    const values = Object.values(cancion)
    const query = {
        name:'update-cancion',
        text: 'UPDATE canciones SET titulo = $2, artista = $3, tono = $4 WHERE id = $1 returning *',
        values
    }
    try {
        client = await pool.connect();
        const response = await  client.query(query);
        response.rows
    }catch(e){
        return console.error('Hubo un error en la actualización:', e.stack);

    }finally{
        if (client){
            client.release();
        }
    }
}

export const eliminarCancion = async (id) => {
    let client
    const query = {
        name : 'delete-cancion',
        text : 'DELETE FROM canciones WHERE id = $1 returning *',
        values: [id]
    }
    try{
        client = await pool.connect();
        const response = await client.query(query);
        return response.rows
    }catch(e){
        return console.error('Hubo un error al eliminar:', e.stack);

    }finally{
        if (client){
            client.release();
        }
    }
}