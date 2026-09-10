const gamesElement = document.getElementById("differences");
const errorElement = document.getElementById("error");
let week = "";

const printDifference = (difference, winner) => {
    const picksElem = document.createElement("div");
    picksElem.className = "differences-row";
    const karinaPickElem = document.createElement("div");
    karinaPickElem.innerText = difference["karina"];
    if (difference["karina"] === "No pick yet") {
        karinaPickElem.className = "no-pick";
    } else if (winner && difference["karina"].toLowerCase() === winner.toLowerCase()) {
        karinaPickElem.className = "winner";
    }
    picksElem.appendChild(karinaPickElem);
    const josePickElem = document.createElement("div");
    josePickElem.innerText = difference["jose"];
    if (difference["jose"] === "No pick yet") {
        josePickElem.className = "no-pick";
    } else if (winner && difference["jose"].toLowerCase() === winner.toLowerCase()) {
        josePickElem.className = "winner";
    }
    picksElem.appendChild(josePickElem);
    gamesElement.appendChild(picksElem);
};

const printDifferences = (differences, winners) => {
    const differencesTitleElem = document.createElement("div");
    differencesTitleElem.className = "differences-title";
    const karinaTitleElem = document.createElement("div");
    karinaTitleElem.innerText = "Karina";
    differencesTitleElem.appendChild(karinaTitleElem);
    const joseTitleElem = document.createElement("div");
    joseTitleElem.innerText = "Jose";
    differencesTitleElem.appendChild(joseTitleElem);
    gamesElement.appendChild(differencesTitleElem);
    sortByKickoff(differences, winners).forEach(element => {
        const winner = winners.find(item => item.game == element.game);
        printDifference(element, winner ? winner.winner : null);
    });
};

const selectWeek = async (event) => {
    gamesElement.innerHTML = "";
    errorElement.innerHTML = "";
    week = event.target.value;
    const requestBody = {
        name1: 'karina',
        name2: 'jose',
    };
    const response = await fetch(`${API_BASE_URL}/compare/${YEAR}/${week}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status === 200) {
        const differences = await response.json();
        const winners = await getWinners(week);
        printDifferences(differences, winners);
    } else {
        const errorBody = await response.json();
        errorElement.innerHTML = errorBody.error_message;
    }
};

const selectWeekElement = document.getElementById("week");
selectWeekElement.addEventListener("change", selectWeek);
