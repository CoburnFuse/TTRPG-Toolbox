var onField = [];
var darkThemeOn;
var combatantInitiative;
var sharedInitiativeDropdown = document.getElementById('inputPriorityDropdown');

function addNewOnField(event) {
    event.preventDefault();
    combatantHP = parseInt(inputHP.value, 10);
    combatantInitiative = parseInt(inputInitiative.value, 10);
    var priorityIndex = parseInt(inputPriorityDropdown.value, 10)
    // Get all variables

    var toPush = ({ name: inputName.value, health: combatantHP, initiative: combatantInitiative, armorClass: inputAC.value, isPlayer: inputPlayerBool.checked, currentTurn: false });
    if(priorityIndex !== "first" && !isNaN(priorityIndex)){
        onField.splice(priorityIndex + 1, 0, toPush);
    }else{
        onField.unshift(toPush);
    }

    // Clear form
    addNew.reset();
    updateTable();
}

function updateTable() {
    // Empty the table to rewrite
    emptyTable();
    sortByInitiative();
    saveToStorage();
    checkForCombat();
    resetForm()

    // Get the tbody of the table and write to table
    var tbodyRef = document.getElementById('combatTracker').getElementsByTagName('tbody')[0];
    for (var i = 0; i < onField.length; i++) {
        tbodyRef.insertRow().innerHTML =
            "<td " + ((onField[i].currentTurn) ? ' class="currentTurn">' : '>') + onField[i].name + "</td>" +
            "<td>" + ((onField[i].isPlayer) ? '-' : '<input class="healthTable" type="text" placeholder = ' + onField[i].health + ' id="hp_' + i + '" onblur="updateHP(' + i +')" onkeydown="enterPressEvent(event, ' + i + ')">') + "</td>" +
            "<td>" + onField[i].initiative + "</td>" +
            "<td>" + ((onField[i].isPlayer) ? '-' : onField[i].armorClass) + "</td>" +
            "<td> <button onclick='removeSingleFromTracker(" + i + ");'>Kill</button><button onclick='renameCombatant(" + i + ");'>Rename</button></td>";
    }
}

function sortByInitiative() {
    onField.sort(function (a, b) {
        return b.initiative - a.initiative
    });
}

function enterPressEvent(event, id){
    if (event.key === 'Enter'){
        updateHP(id);
    }
}

function updateHP(id) {
    var inputHealth = document.getElementById("hp_" + id).value;
    var currentHealth = onField[id].health;
    var newHealth = currentHealth;
    var regex = /^[+-]?\d+/;

    if (regex.test(inputHealth)) {
        if (inputHealth.startsWith('+') || inputHealth.startsWith('-')) {
            newHealth = currentHealth + parseInt(inputHealth);
        } else {
            newHealth = parseInt(inputHealth);
        }
        onField[id].health = newHealth;
        document.getElementById("hp_" + id).placeholder = newHealth;
    } else {
        document.getElementById("hp_" + id).placeholder = currentHealth;
    }
    updateTable();
}

function emptyTracker() {
    // Empty the array
    let text = "Are you sure you want to clear the tracker?";
    if (confirm(text) === true) {
        onField.length = 0;
        updateTable();
    }
}

function emptyTable() {
    document.getElementById('combatants').innerHTML = '';
}

function removeSingleFromTracker(id) {
    if (onField[id].currentTurn === true) {
        nextTurn();
    }
    onField.splice(id, 1);
    updateTable();
}

function nextTurn() {
    if (onField.length !== 0) {
        var getCurrentTurn = onField.findIndex(onField => onField.currentTurn === true);

        if (getCurrentTurn !== -1) {
            onField[getCurrentTurn].currentTurn = false;
        }

        var getNextTurn = (getCurrentTurn + 1) % onField.length;
        onField[getNextTurn].currentTurn = true;

        updateTable();
    }
}

function saveToStorage() {
    localStorage.currentCombatants = JSON.stringify(onField);
}

function loadStorage() {
    if (localStorage.getItem("currentCombatants") != null) {
        onField = JSON.parse(localStorage.currentCombatants);
    }

    if (localStorage.getItem("currentTheme") != null) {
        darkThemeOn = JSON.parse(localStorage.currentTheme);
        if (darkThemeOn === true) {
            document.body.classList.add("dark");
        }
    }
    updateTable();
}

function switchTheme() {
    document.body.classList.toggle("dark");
    darkThemeOn = !darkThemeOn;

    localStorage.currentTheme = JSON.stringify(darkThemeOn);
}

function checkForCombat() {
    if (onField.find(item => item.currentTurn === true)) {
        document.getElementById("turnButton").textContent = "Next turn!";
    } else {
        document.getElementById("turnButton").textContent = "Start combat!";
    }
}

function toggleHPinput() {
    if (inputPlayerBool.checked === true) {
        document.getElementById('inputHP').disabled = true;
        document.getElementById('inputAC').disabled = true;
    } else {
        document.getElementById('inputHP').disabled = false;
        document.getElementById('inputAC').disabled = false;
    }
}

function resetForm() {
    document.getElementById("addNew").reset();
    document.getElementById('inputHP').disabled = false;
    document.getElementById('inputAC').disabled = false;
    clearPriorityDropdown();
}

function checkForDuplicateInitiative() {
    clearPriorityDropdown();

    combatantInitiative = parseInt(inputInitiative.value, 10);

    if (onField.some(item => item.initiative === combatantInitiative)) {
        var sharedInitiatives = onField.filter(item => item.initiative === combatantInitiative);
        sharedInitiatives.forEach(item => {
            var option = document.createElement('option');
            option.value = onField.indexOf(item);
            option.textContent = "After " + item.name;
            sharedInitiativeDropdown.appendChild(option);
        })

    } 
}

function clearPriorityDropdown(){
    sharedInitiativeDropdown.innerHTML = '';

    var firstOption = document.createElement('option');
    firstOption.value = 'first';
    firstOption.textContent = 'First';
    sharedInitiativeDropdown.appendChild(firstOption);
}

function renameCombatant(id){
    var toBeRenamed = prompt("Enter new name.", onField[id].name);
    if (toBeRenamed) {
        onField[id].name = toBeRenamed;
        updateTable();
    }
}