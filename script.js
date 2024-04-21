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
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    // saveData();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        // saveData();
    }
}, false);

// Um die Daten zu speichern, wenn man die Webseite aktualisiert könnte man folgendes dem Skript hinzufügen (plus vorheriges aus Zeile 19 und 28)

/*
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();
*/