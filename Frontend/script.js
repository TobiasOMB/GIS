const inputBox = document.getElementById("input-box");
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
    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list: listContainer.innerHTML })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Fehler:', error));
}

function showTask() {
    fetch('http://localhost:3000/load')
        .then(response => response.json())
        .then(data => {
            listContainer.innerHTML = data;
        })
        .catch(error => console.error('Fehler:', error));
}

showTask();






/*function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();*/

// Um die Daten bei einem Reload des HTML Files beizubehalten werden über die Funktion "saveData" die Einträge local gespeichert. Zum Speichern wurde in zeile 22, 28 und 34 die function "saveData" beigefügt.