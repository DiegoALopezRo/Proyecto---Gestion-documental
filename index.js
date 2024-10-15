const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configurar Multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'C:/Users/Diego Alejandro/Documents/DOCUMENTOS DE PRUEBA';
        // Verificar si la carpeta existe, si no, crearla
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir); // Carpeta donde se guardarán los archivos subidos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Mantener el nombre original del archivo
    }
});

const upload = multer({ storage });

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Asegúrate de tener el archivo index.html en el mismo directorio
});

// Array para almacenar documentos
const documentos = [];

// Ruta para subir un documento
app.post('/upload', upload.single('documento'), (req, res) => {
    documentos.push(req.file.originalname); // Agregar el nombre del documento al array
    res.send('Documento subido con éxito a ' + req.file.path);
});

// Ruta para obtener todos los documentos
app.get('/documentos', (req, res) => {
    res.json(documentos);
});

// Ruta para eliminar un documento
app.delete('/documentos/:nombre', (req, res) => {
    const nombreDocumento = req.params.nombre;
    const index = documentos.indexOf(nombreDocumento);
    if (index !== -1) {
        documentos.splice(index, 1); // Eliminar el documento del array
        res.send(`Documento ${nombreDocumento} eliminado con éxito.`);
    } else {
        res.status(404).send('Documento no encontrado.');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
