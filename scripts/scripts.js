var onField = [];

function addNewOnField(){

    // Get all variables
    onField.push({name: inputName.value, health: inputHP.value, initiative: inputInitiative.value, isPlayer: inputPlayerBool.checked});

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
        "<td>" + onField[i].name + "</td>" +
        "<td><input type='number' value = '" + onField[i].health + "'></td>" +
        "<td>" + onField[i].initiative + "</td>" +
        "<td> <button>Kill</button></td>";
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

function removeSingleFromTracker(){

}

function nextInTurn(){
    
}