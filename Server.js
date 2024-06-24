const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Endpunkt zum Speichern der Liste
app.post('/save', (req, res) => {
    const list = req.body.list;
    fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(list), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Speichern der Daten' });
        }
        res.status(200).json({ message: 'Daten erfolgreich gespeichert' });
    });
});

// Endpunkt zum Laden der Liste
app.get('/load', (req, res) => {
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Laden der Daten' });
        }
        res.status(200).json(JSON.parse(data));
    });
});

// Routen für die Basis-URL ("/") definieren
app.get('/', (req, res) => {
    // Absolute Pfad zur index.html Datei
    const indexPath = path.join(__dirname, 'public', 'index.html');
    // Senden der HTML-Datei als Antwort
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});