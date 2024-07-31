const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const dataFilePath = path.join(__dirname, 'data', 'shoppingList.json');
const userFilePath = path.join(__dirname, 'data', 'users.json');

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

function loadUsers() {
    try {
        const data = fs.readFileSync(userFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Fehler beim Laden der Benutzerdaten:', err.message);
        return [];
    }
}

function saveShoppingList() {
    fs.writeFile(dataFilePath, JSON.stringify(shoppingList, null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Fehler beim Speichern der Daten:', err.message);
        } else {
            console.log('Daten erfolgreich gespeichert.');
        }
    });
}

function saveUsers() {
    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
        if (err) {
            console.log('Fehler beim Speichern der Benutzerdaten:', err.message);
        } else {
            console.log('Benutzerdaten erfolgreich gespeichert.');
        }
    });
}

let shoppingList = loadShoppingList();
let users = loadUsers();

app.post('/save', (req, res) => {
    const newItem = { id: req.body.id, item: req.body.item, checked: req.body.checked, amount: req.body.amount };
    const existingItem = shoppingList.find(item => item.item.toLowerCase() === newItem.item.toLowerCase());

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
    const id = parseInt(req.params.id);
    shoppingList = shoppingList.filter(item => item.id !== id);
    saveShoppingList();
    res.status(200).json({ message: 'Item gelöscht' });
});

app.patch('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = shoppingList.findIndex(item => item.id === id);

    if (itemIndex === -1) {
        res.status(404).json({ error: 'Item nicht gefunden' });
        return;
    }

    shoppingList[itemIndex] = { ...shoppingList[itemIndex], ...req.body };
    saveShoppingList();
    res.status(200).json(shoppingList[itemIndex]);
});

app.post('/register', async (req, res) => {
    const { username, password, passwordCheck } = req.body;

    if (password !== passwordCheck) {
        res.status(400).json({ error: 'Passwörter stimmen nicht überein' });
        return;
    }

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        res.status(400).json({ error: 'Benutzername bereits vergeben' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now(), username, password: hashedPassword };
        users.push(newUser);
        saveUsers();
        res.status(200).json({ message: 'Registrierung erfolgreich' });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Registrieren' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
        return;
    }

    res.status(200).json({ message: 'Login erfolgreich' });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
