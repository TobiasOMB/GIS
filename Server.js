const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data', 'shoppingList.json');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Funktion zum Laden der Daten aus der JSON-Datei
function loadShoppingList() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Fehler beim Laden der Daten:', err.message);
        return [];
    }
}

// Laden der Daten aus der JSON-Datei, falls vorhanden
let shoppingList = loadShoppingList();

// Endpunkt zum Speichern eines neuen Eintrags
app.post('/save', (req, res) => {
    const newItem = { item: req.body.item, checked: false }; // Standard: unchecked
    shoppingList.push(newItem);

    // Daten in die JSON-Datei schreiben
    fs.writeFile(dataFilePath, JSON.stringify(shoppingList, null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Fehler beim Speichern der Daten:', err.message);
            res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
            return;
        }
        console.log('Daten erfolgreich gespeichert.');
        res.status(200).json({ message: 'Eintrag hinzugefügt', ...newItem });
    });
});


// Endpunkt zum Laden der gesamten Einkaufsliste
app.get('/load', (req, res) => {
    shoppingList = loadShoppingList(); // Daten neu aus der Datei laden
    res.status(200).json(shoppingList);
});

// Endpunkt zum Löschen eines Eintrags
app.delete('/delete/:itemText', (req, res) => {
    const itemText = req.params.itemText;
    const index = shoppingList.findIndex(item => item.item === itemText.trim()); // Suchen nach dem genauen Eintrag

    if (index !== -1) {
        shoppingList.splice(index, 1); // Eintrag entfernen
        // Daten in die JSON-Datei schreiben
        fs.writeFile(dataFilePath, JSON.stringify(shoppingList, null, 2), 'utf8', (err) => {
            if (err) {
                console.log('Fehler beim Speichern der Daten:', err.message);
                res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
                return;
            }
            console.log('Eintrag erfolgreich gelöscht und Daten aktualisiert.');
            res.status(200).json({ message: 'Eintrag gelöscht', item: itemText });
        });
    } else {
        res.status(404).json({ error: 'Eintrag nicht gefunden' });
    }
});

// PATCH Route zum Aktualisieren des checked-Status eines Eintrags
app.patch('/update/:itemText', (req, res) => {
    const itemText = req.params.itemText;
    const index = shoppingList.findIndex(item => item.item === itemText.trim());

    if (index !== -1) {
        shoppingList[index].checked = req.body.checked; // Update des checked-Status
        // Daten in die JSON-Datei schreiben
        fs.writeFile(dataFilePath, JSON.stringify(shoppingList, null, 2), 'utf8', (err) => {
            if (err) {
                console.log('Fehler beim Speichern der Daten:', err.message);
                res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
                return;
            }
            console.log('Status erfolgreich aktualisiert und Daten gespeichert.');
            res.status(200).json({ message: 'Status aktualisiert', ...shoppingList[index] });
        });
    } else {
        res.status(404).json({ error: 'Eintrag nicht gefunden' });
    }
});


// Basis-URL Route für die index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
