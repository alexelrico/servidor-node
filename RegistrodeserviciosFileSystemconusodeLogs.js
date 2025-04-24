const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Inicializar EventEmitter
const eventEmitter = new EventEmitter();

// Función para registrar logs asincrónicamente
async function registrarLog(method, url) {
  const fecha = new Date().toISOString();
  const log = `[${fecha}] ${method} ${url}\n`;
  fs.promises.appendFile(path.join(__dirname, 'log.txt'), log)
    .catch(err => console.error('Error al escribir en el log:', err));
}

// Funciones para cada operación
function escribirArchivo(res) {
  fs.writeFile('archivo.txt', 'Este es el contenido inicial.', (err) => {
    if (err) {
      res.writeHead(500);
      res.end('Error al escribir el archivo');
    } else {
      res.end('Archivo creado exitosamente.');
    }
  });
}

function leerArchivo(res) {
  fs.readFile('archivo.txt', 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error al leer el archivo');
    } else {
      res.end(data);
    }
  });
}

function agregarAlArchivo(res) {
  fs.appendFile('archivo.txt', '\nNueva línea agregada.', (err) => {
    if (err) {
      res.writeHead(500);
      res.end('Error al agregar al archivo');
    } else {
      res.end('Línea agregada correctamente.');
    }
  });
}

function eliminarArchivo(res) {
  fs.unlink('archivo.txt', (err) => {
    if (err) {
      res.writeHead(500);
      res.end('Error al eliminar el archivo');
    } else {
      res.end('Archivo eliminado.');
    }
  });
}

function leerLog(res) {
  fs.readFile(path.join(__dirname, 'log.txt'), 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error al leer el log');
    } else {
      res.end(data);
    }
  });
}

// Servidor
const server = http.createServer(async (req, res) => {
  await registrarLog(req.method, req.url); // Llamar a la función de logging en cada petición

  // Manejador de rutas
  if (req.url === '/escribir-archivo') {
    escribirArchivo(res);
  } else if (req.url === '/leer-archivo') {
    leerArchivo(res);
  } else if (req.url === '/agregar-archivo') {
    agregarAlArchivo(res);
  } else if (req.url === '/eliminar-archivo') {
    eliminarArchivo(res);
  } else if (req.url === '/leer-log') {
    leerLog(res);
  } else {
    res.writeHead(404);
    res.end('Ruta no encontrada');
  }
});

// Iniciar servidor
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
