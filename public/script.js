const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Laden der gespeicherten Daten beim Seitenaufruf
document.addEventListener('DOMContentLoaded', () => {
    showTask();
});

// Eventlistener für das Hinzufügen eines Einkaufs durch Klicken auf den Button
document.querySelector('.add button').addEventListener('click', addTask);

// Eventlistener für das Hinzufügen eines Einkaufs durch Drücken der Enter-Taste
inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Funktion zum Hinzufügen eines Einkaufs
function addTask() {
    if (inputBox.value === '') {
        swal('Achtung', 'Bitte ein Produkt angeben!');
        return;
    }

    // Daten für die POST-Anfrage vorbereiten
    const newItem = { item: inputBox.value, checked: false }; // Default: unchecked

    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    })
    .then(response => response.json())
    .then(data => {
        // Eintrag zur Liste auf der Seite hinzufügen
        let li = document.createElement("li");
        li.textContent = inputBox.value;
        if (data.checked) {
            li.classList.add("checked");
        }
        li.addEventListener('click', toggleChecked);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.classList.add("delete-btn");
        span.addEventListener('click', deleteTask);
        li.appendChild(span);

        listContainer.appendChild(li);

        inputBox.value = "";
    })
    .catch(error => console.error('Fehler beim Hinzufügen:', error));
}


// Event Delegation für das Löschen eines Einkaufs
function deleteTask(e) {
    const itemText = e.target.parentElement.firstChild.textContent.trim(); // Nur den Textinhalt des ersten Childs (ohne das Löschen-Symbol)

    fetch(`http://localhost:3000/delete/${encodeURIComponent(itemText)}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        e.target.parentElement.remove();
    })
    .catch(error => console.error('Fehler beim Löschen:', error));
}

// Event Delegation für das Toggle des checked-Status
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        toggleChecked(e.target); // Übergib das LI-Element direkt an die Funktion
    }
});

// Funktion zum Toggle des checked-Status eines Eintrags
function toggleChecked(li) {
    const itemText = li.textContent.trim();
    const isChecked = li.classList.toggle("checked"); // Toggle der CSS-Klasse für visuelles Feedback

    fetch(`http://localhost:3000/update/${encodeURIComponent(itemText)}`, {
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
        // Rollback des visuellen Toggles bei einem Fehler
        li.classList.toggle("checked");
    });
}



// Funktion zum Laden der gespeicherten Daten vom Server
function showTask() {
    fetch('http://localhost:3000/load')
        .then(response => response.json())
        .then(data => {
            shoppingList = data; // Aktualisiere die lokale shoppingList

            listContainer.innerHTML = ''; // Leere die aktuelle Liste

            // Füge jedes Element aus der shoppingList hinzu
            shoppingList.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item.item;

                if (item.checked) {
                    li.classList.add("checked"); // Falls checked, füge die Klasse checked hinzu
                }

                let span = document.createElement("span");
                span.innerHTML = "\u00d7";
                span.classList.add("delete-btn");
                span.addEventListener('click', deleteTask);
                li.appendChild(span);

                listContainer.appendChild(li);
            });

            // Eventlistener für das Toggle des checked-Status hinzufügen
            listContainer.querySelectorAll("li").forEach(li => {
                li.addEventListener('click', toggleChecked);
            });
        })
        .catch(error => console.error('Fehler beim Laden der Daten:', error));
}












/*const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask1(){
    if(inputBox.value === ''){
        swal('Achtung', 'Bitte ein Produkt angeben!');
        // Es ginge im klassischen Sinne auch wie unten aufgeführt, doch durch Sweetalert, lässt sich eine Alertmeldung schöner darstellen
        //alert("Bitte gib ein Produkt an!");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        //Wenn man nun einen Task/Einkauf hinzufügt, so wird dies als liste (listcontainer) ausgegeben
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        // das Crossitem \u00d7 (zum Löschen des Eintrags) wird nun im dok Span dem eingetragenen Einkauf hinzugefügt
        
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    // Wenn LI geklickt wird, dann wird checked ausgeführt

    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
    //Wenn das Crossitem geklickt wird, dann wird der Eintrag gelöscht

}, false);


function saveData() {
    const items = Array.from(listContainer.querySelectorAll('li')).map(li => li.textContent);
    const jsonData = JSON.stringify(items);

    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list: jsonData })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Fehler:', error));
}

function showTask() {
    fetch('http://localhost:3000/load')
        .then(response => response.json())
        .then(data => {
            const items = JSON.parse(data.list);
            listContainer.innerHTML = items.map(item => `<li>${item.slice(0, -1)}<span>×</span></li>`).join('');
        })
        .catch(error => console.error('Fehler:', error));
}

showTask();

*/




/*function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();*/

// Um die Daten bei einem Reload des HTML Files beizubehalten werden über die Funktion "saveData" die Einträge local gespeichert. Zum Speichern wurde in zeile 22, 28 und 34 die function "saveData" beigefügt.