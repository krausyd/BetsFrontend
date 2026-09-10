const gamesElement = document.getElementById("differences");
const errorElement = document.getElementById("error");
let week = "";

// The NFL season is named after the year it starts in, but runs into
// January/February of the following calendar year. So in Jan/Feb we're
// still in the season that started the previous year.
const getCurrentSeasonYear = () => {
    const now = new Date();
    const month = now.getMonth(); // 0 = January
    return month <= 1 ? now.getFullYear() - 1 : now.getFullYear();
};
const YEAR = getCurrentSeasonYear().toString();

document.getElementById("season").innerText = `Season ${YEAR}`;

const printDifference = (difference, winner) => {
    const picksElem = document.createElement("div");
    picksElem.className = "differences-row";
    const jeffPickElem = document.createElement("div");
    jeffPickElem.innerText = difference["jeff"];
    if (winner && difference["jeff"].toLowerCase() === winner.toLowerCase()) {
        jeffPickElem.className = "winner";
    }
    picksElem.appendChild(jeffPickElem);
    const josePickElem = document.createElement("div");
    josePickElem.innerText = difference["jose"];
    if (winner && difference["jose"].toLowerCase() === winner.toLowerCase()) {
        josePickElem.className = "winner";
    }
    picksElem.appendChild(josePickElem);
    gamesElement.appendChild(picksElem);
};

const printDifferences = (differences, winners) => {
    const differencesTitleElem = document.createElement("div");
    differencesTitleElem.className = "differences-title";
    const jeffTitleElem = document.createElement("div");
    jeffTitleElem.innerText = "Jeff";
    differencesTitleElem.appendChild(jeffTitleElem);
    const joseTitleElem = document.createElement("div");
    joseTitleElem.innerText = "Jose";
    differencesTitleElem.appendChild(joseTitleElem);
    gamesElement.appendChild(differencesTitleElem);
    differences.forEach(element => {
        const winner = winners.find(item => item.game == element.game);
        printDifference(element, winner ? winner.winner : null);
    });
};

const getWinners = async (week) => {
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/winners/${YEAR}/${week}`);
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
        name1: 'jose',
        name2: 'jeff',
    };
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/compare/${YEAR}/${week}`, {
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
