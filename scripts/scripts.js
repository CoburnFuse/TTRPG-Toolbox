var onField = [];

function addNewOnField(){

    // Get all variables
    onField.push({name: inputName.value, health: inputHP.value, initiative: inputInitiative.value, isPlayer: inputPlayerBool.checked, currentTurn: false});

    console.table(onField);

    // Clear form
    updateTable();
    addNew.reset();
}

function updateTable(){
    // Empty the table to rewrite
    emptyTable();
    sortByInitiative();

    // Get the tbody of the table
    var tbodyRef = document.getElementById('combatTracker').getElementsByTagName('tbody')[0];
    for (var i = 0; i < onField.length; i++){
        tbodyRef.insertRow().innerHTML =
        "<td>" + ((onField[i].currentTurn) ? '►':'') + onField[i].name + "</td>" +
        "<td>" + ((onField[i].isPlayer) ? '' : '<input type="number" value = ' + onField[i].health + '>') + "</td>" +
        "<td>" + onField[i].initiative + "</td>" +
        "<td> <button onclick='removeSingleFromTracker(" + i + ");'>Kill</button></td>";
    }
}

function sortByInitiative(){
    onField.sort(function (a,b){
        return b.initiative - a.initiative
    });
}

function updateHP(){

}

function emptyTracker(){
    // Empty the array
    onField.length = 0;

    updateTable();
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
    
}

function startCombat(){
    // Sets the currentTurn to the first in the list
    clearCurrentTurn();
    onField[0].currentTurn = true;
    updateTable();
}

function clearCurrentTurn(){
    for (var j = 0; j < onField.length; j++){
        onField[j].currentTurn = false;
    }
}