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

function loadShoppingList() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Fehler beim Laden der Daten:', err.message);
        return [];
    }
}

let shoppingList = loadShoppingList();

function saveShoppingList() {
    fs.writeFileSync(dataFilePath, JSON.stringify(shoppingList, null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Fehler beim Speichern der Daten:', err.message);
        } else {
            console.log('Daten erfolgreich gespeichert.');
        }
    });
}

app.post('/save', (req, res) => {
    const newItem = { id: req.body.id, item: req.body.item, checked: req.body.checked, amount: req.body.amount };
    const existingItem = shoppingList.find(item => item.item === newItem.item);

    if (existingItem) {
        res.status(400).json({ error: 'Dieses Produkt befindet sich bereits in der Liste!' });
        return;
    }

    shoppingList.push(newItem);

    saveShoppingList();

    res.status(200).json(newItem);
});

app.get('/load', (req, res) => {
    shoppingList = loadShoppingList();
    res.status(200).json(shoppingList);
});

app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = shoppingList.findIndex(item => item.id === id);

    if (index !== -1) {
        shoppingList.splice(index, 1);

        saveShoppingList();

        console.log('Eintrag erfolgreich gelöscht und Daten aktualisiert.');
        res.status(200).json({ message: 'Eintrag gelöscht' });
    } else {
        res.status(404).json({ error: 'Eintrag nicht gefunden' });
    }
});

app.patch('/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const itemToUpdate = shoppingList.find(item => item.id === id);

    if (itemToUpdate) {
        if (req.body.checked !== undefined) {
            itemToUpdate.checked = req.body.checked;
        }
        if (req.body.amount !== undefined) {
            itemToUpdate.amount = req.body.amount;
        }

        saveShoppingList();

        console.log('Eintrag erfolgreich aktualisiert.');
        res.status(200).json(itemToUpdate);
    } else {
        res.status(404).json({ error: 'Eintrag nicht gefunden' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
