const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Endpunkt zum Speichern der Liste
app.post('/save', (req, res) => {
    const list = req.body.list;
    fs.writeFile('data.json', JSON.stringify(list), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Speichern der Daten' });
        }
        res.status(200).json({ message: 'Daten erfolgreich gespeichert' });
    });
});

// Endpunkt zum Laden der Liste
app.get('/load', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Laden der Daten' });
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});