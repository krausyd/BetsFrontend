const gamesElement = document.getElementById("performance");
const errorElement = document.getElementById("error");
let week = "";

const getWinners = async (week) => {
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/winners/${week}`);
    if (response.status === 200) {
        const winners = await response.json();
        return winners;
    }
    return [];
};

const printPicksVsWinner = (pick, winner) => {
    const picksElem = document.createElement("div");
    picksElem.className = "performance-row";
    const josePickElem = document.createElement("div");
    josePickElem.innerText = pick["jose"];
    if (winner && pick["jose"].toLowerCase() === winner.toLowerCase()) {
        josePickElem.className = "winner";
    }
    picksElem.appendChild(josePickElem);
    const jeffPickElem = document.createElement("div");
    jeffPickElem.innerText = pick["jeff howell"];
    if (winner && pick["jeff howell"].toLowerCase() === winner.toLowerCase()) {
        jeffPickElem.className = "winner";
    }
    picksElem.appendChild(jeffPickElem);
    const winnerElem = document.createElement("div");
    winnerElem.innerText = winner || "";
    picksElem.appendChild(winnerElem);
    gamesElement.appendChild(picksElem);
};

const printPerformance = (picks, winners) => {
    const performanceTitleElem = document.createElement("div");
    performanceTitleElem.className = "performance-title";
    const joseTitleElem = document.createElement("div");
    joseTitleElem.innerText = "Jose";
    performanceTitleElem.appendChild(joseTitleElem);
    const jeffTitleElem = document.createElement("div");
    jeffTitleElem.innerText = "Jeff";
    performanceTitleElem.appendChild(jeffTitleElem);
    const winnerTitleElem = document.createElement("div");
    winnerTitleElem.innerText = "Winner";
    performanceTitleElem.appendChild(winnerTitleElem);
    gamesElement.appendChild(performanceTitleElem);
    picks.forEach(element => {
        winner = winners.filter(item => item.game == element.game)[0];
        printPicksVsWinner(element, winner.winner);
    });
};

const selectWeek = async (event) => {
    gamesElement.innerHTML = "";
    errorElement.innerHTML = "";
    week = event.target.value;
    const requestBody = {
        name1: 'jose',
        name2: 'jeff howell',
    };
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/sames/${week}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8080',
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status === 200) {
        const sames = await response.json();
        const winners = await getWinners(week);
        printPerformance(sames, winners);
    } else {
        errorElement.innerHTML = await response.json().error_message;
    }
};


const selectWeekElement = document.getElementById("week");
selectWeekElement.addEventListener("change", selectWeek);
