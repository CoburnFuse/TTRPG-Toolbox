var onField = [];
var darkThemeOn;
var combatantInitiative;

function addNewOnField(event){
    event.preventDefault();

    combatantInitiative = parseFloat(inputInitiative.value).toFixed(1);
    // Get all variables
    if (onField.some(onField => onField.initiative === combatantInitiative) === false ){
        onField.push({name: inputName.value, health: inputHP.value, initiative: combatantInitiative, isPlayer: inputPlayerBool.checked, currentTurn: false});

        // Clear form
        addNew.reset();
        updateTable();
    } else {
        alert("A combatant already has this initiative.");
    }
}

function updateTable(){
    // Empty the table to rewrite
    emptyTable();
    sortByInitiative();
    saveToStorage();
    checkForCombat();

    // Get the tbody of the table and write to table
    var tbodyRef = document.getElementById('combatTracker').getElementsByTagName('tbody')[0];
    for (var i = 0; i < onField.length; i++){
        tbodyRef.insertRow().innerHTML =
        "<td>" + ((onField[i].currentTurn) ? '►':'') + onField[i].name + "</td>" +
        "<td>" + ((onField[i].isPlayer) ? '' : '<input class="healthTable" type="number" value = ' + onField[i].health + ' id="hp_' + i + '" onchange="updateHP(' + i + ')">') + "</td>" +
        "<td>" + onField[i].initiative + "</td>" +
        "<td> <button onclick='removeSingleFromTracker(" + i + ");'>Kill</button></td>";
    }
}

function sortByInitiative(){
    onField.sort(function (a,b){
        return b.initiative - a.initiative
    });
}

function updateHP(id){
    var newHealth = document.getElementById("hp_" + id).value;
    onField[id].health = parseInt(newHealth);

    console.table(onField);

    saveToStorage();
}

function emptyTracker(){
    // Empty the array
    let text = "Are you sure you want to clear the tracker?";
    if (confirm(text) === true){
        onField.length = 0;
        updateTable();
    }
}

function emptyTable(){
    document.getElementById('combatants').innerHTML = '';
}

function removeSingleFromTracker(id){
    onField.splice(id, 1);
    updateTable();
}

function nextInTurn(){
    var getCurrentTurn = onField.findIndex(onField => onField.currentTurn === true);

    if (getCurrentTurn !== -1) {
        onField[getCurrentTurn].currentTurn = false;
    }

    var getNextTurn = (getCurrentTurn + 1) % onField.length;
    onField[getNextTurn].currentTurn = true;

    updateTable();
}

function saveToStorage(){
    localStorage.currentCombatants = JSON.stringify(onField);
}

function loadStorage(){
    if (localStorage.getItem("currentCombatants") != null){
        onField = JSON.parse(localStorage.currentCombatants);
    }
    
    if (localStorage.getItem("currentTheme") != null){
        darkThemeOn = JSON.parse(localStorage.currentTheme);
        if(darkThemeOn === true){
            document.body.classList.add("dark");
        }
    }   
    updateTable();
}

function switchTheme(){
    if(darkThemeOn === true){
        document.body.classList.remove("dark");
        darkThemeOn = false;
    }else{
        document.body.classList.add("dark");
        darkThemeOn = true;
    }

    localStorage.currentTheme = JSON.stringify(darkThemeOn);
}

function checkForCombat(){
    if(onField.find(item => item.currentTurn === true)) {
        document.getElementById("turnButton").textContent = "Next in turn!";
    }else{
        document.getElementById("turnButton").textContent = "Start combat!";
    }
}