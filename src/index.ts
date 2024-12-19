import server from './server'; // Nuestro 'app' del server
import colors from 'colors'; // Para darle mejor estilo de colores y tipografia a los mensajes de consola


// Asignamos nuestro puerto donde se estara ejecuntando el backend, si no existe, que tome el puerto 4000
const port = process.env.PORT || 4000;


// Probamos que nuestro puerto este abierto y modificamos el package.json con el script para ejecutarlo
server.listen(port, () => {
  console.log(colors.blue.bold(`RestAPI funcionando en el puerto ${port}`));

})