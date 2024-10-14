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

// Ruta para subir un documento
app.post('/upload', upload.single('documento'), (req, res) => {
    res.send('Documento subido con éxito a ' + req.file.path);
});

// Ruta para obtener todos los documentos
app.get('/documentos', (req, res) => {
    const dir = 'C:/Users/Diego Alejandro/Documents/DOCUMENTOS DE PRUEBA';
    const documentos = fs.readdirSync(dir); // Leer documentos de la carpeta
    res.json(documentos); // Enviar la lista de documentos como respuesta
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
