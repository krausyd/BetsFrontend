const gamesElement = document.getElementById("differences");
const errorElement = document.getElementById("error");
let week = "";

const printDifference = (difference, winner) => {
    const picksElem = document.createElement("div");
    picksElem.className = "differences-row";
    const josePickElem = document.createElement("div");
    josePickElem.innerText = difference["jose"];
    if (winner && difference["jose"].toLowerCase() === winner.toLowerCase()) {
        josePickElem.className = "winner";
    }
    picksElem.appendChild(josePickElem);
    const jeffPickElem = document.createElement("div");
    jeffPickElem.innerText = difference["jeff howell"];
    if (winner && difference["jeff howell"].toLowerCase() === winner.toLowerCase()) {
        jeffPickElem.className = "winner";
    }
    picksElem.appendChild(jeffPickElem);
    gamesElement.appendChild(picksElem);
};

const printDifferences = (differences, winners) => {
    const differencesTitleElem = document.createElement("div");
    differencesTitleElem.className = "differences-title";
    const joseTitleElem = document.createElement("div");
    joseTitleElem.innerText = "Jose";
    differencesTitleElem.appendChild(joseTitleElem);
    const jeffTitleElem = document.createElement("div");
    jeffTitleElem.innerText = "Jeff";
    differencesTitleElem.appendChild(jeffTitleElem);
    gamesElement.appendChild(differencesTitleElem);
    differences.forEach(element => {
        winner = winners.filter(item => item.game == element.game)[0];
        printDifference(element, winner.winner);
    });
};

const getWinners = async (week) => {
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/winners/${week}`);
    if (response.status === 200) {
        const winners = await response.json();
        return winners;
    }
    return [];
};

const selectWeek = async (event) => {
    gamesElement.innerHTML = "";
    errorElement.innerHTML = "";
    week = event.target.value;
    const requestBody = {
        week: week,
        name1: 'jose',
        name2: 'jeff howell',
    };
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/compare/${week}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8080',
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status === 200) {
        const differences = await response.json();
        const winners = await getWinners(week);
        printDifferences(differences, winners);
    } else {
        errorElement.innerHTML = await response.json().error_message;
    }
};

const selectWeekElement = document.getElementById("week");
selectWeekElement.addEventListener("change", selectWeek);
