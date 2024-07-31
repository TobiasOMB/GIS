const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Global variable to hold the list of existing items (case insensitive)
let existingItems = new Set();

document.addEventListener('DOMContentLoaded', () => {
    showTask();
});

document.querySelector('.add button').addEventListener('click', addTask);

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const newItemName = inputBox.value.trim().toLowerCase();

    // Check if the item already exists
    if (existingItems.has(newItemName)) {
        swal('Achtung', 'Dieses Produkt befindet sich bereits in der Liste!');
        inputBox.value = ""; // Clear the input field
        return;
    }

    if (newItemName === '') {
        swal('Achtung', 'Bitte ein Produkt angeben!');
        return;
    }

    const newItem = { id: Date.now(), item: inputBox.value.trim(), checked: false, amount: 1 };

    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Produkt existiert bereits');
        }
        return response.json();
    })
    .then(data => {
        addItemToDOM(data);
        existingItems.add(newItemName); // Add the new item to the set (case insensitive)
        inputBox.value = "";
    })
    .catch(error => {
        console.error('Fehler beim Hinzufügen:', error);
        swal('Achtung', 'Dieses Produkt befindet sich bereits in der Liste!');
    });
}

function addItemToDOM(item) {
    let li = document.createElement("li");
    li.dataset.id = item.id;
    li.textContent = item.item;

    if (item.checked) {
        li.classList.add("checked");
    }
    li.addEventListener('click', toggleChecked);

    let amount = document.createElement("span");
    amount.textContent = item.amount;
    amount.classList.add("amount");

    let plus = document.createElement("span");
    plus.textContent = "+";
    plus.classList.add("plus-btn");
    plus.addEventListener('click', increaseAmount);

    let minus = document.createElement("span");
    minus.textContent = "-";
    minus.classList.add("minus-btn");
    minus.addEventListener('click', decreaseAmount);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.classList.add("delete-btn");
    span.addEventListener('click', deleteTask);

    li.appendChild(amount);
    li.appendChild(plus);
    li.appendChild(minus);
    li.appendChild(span);

    listContainer.appendChild(li);
}

function deleteTask(e) {
    const id = e.target.parentElement.dataset.id;
    const itemName = e.target.parentElement.textContent.trim().split('\u00d7')[0].trim().toLowerCase();

    fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        e.target.parentElement.remove();
        existingItems.delete(itemName); // Remove the deleted item from the set (case insensitive)
    })
    .catch(error => console.error('Fehler beim Löschen:', error));
}

function toggleChecked(e) {
    if (e.target.classList.contains('plus-btn') || e.target.classList.contains('minus-btn') || e.target.classList.contains('delete-btn')) {
        return;
    }

    const id = e.target.dataset.id;
    const isChecked = e.target.classList.toggle("checked");

    fetch(`http://localhost:3000/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checked: isChecked }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Status erfolgreich aktualisiert:', data);
    })
    .catch(error => {
        console.error('Fehler beim Aktualisieren des Status:', error);
        e.target.classList.toggle("checked");
    });
}

function increaseAmount(e) {
    const id = e.target.parentElement.dataset.id;
    const amountElement = e.target.previousElementSibling;
    const newAmount = parseInt(amountElement.textContent) + 1;

    fetch(`http://localhost:3000/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: newAmount }),
    })
    .then(response => response.json())
    .then(data => {
        amountElement.textContent = newAmount;
    })
    .catch(error => console.error('Fehler beim Aktualisieren der Menge:', error));
}

function decreaseAmount(e) {
    const id = e.target.parentElement.dataset.id;
    let amountElement = e.target.previousElementSibling; 

    const currentAmount = parseInt(amountElement.textContent);
    const newAmount = currentAmount > 1 ? currentAmount - 1 : 1;

    fetch(`http://localhost:3000/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: newAmount }),
    })
    .then(response => response.json())
    .then(data => {
        amountElement.textContent = newAmount;
    })
    .catch(error => console.error('Fehler beim Aktualisieren der Menge:', error));
}

function showTask() {
    fetch('http://localhost:3000/load')
        .then(response => response.json())
        .then(data => {
            listContainer.innerHTML = '';
            existingItems.clear(); // Clear the set of existing items
            data.forEach(item => {
                existingItems.add(item.item.toLowerCase()); // Add each item to the set (case insensitive)
                addItemToDOM(item);
            });
        })
        .catch(error => console.error('Fehler beim Laden der Daten:', error));
}
