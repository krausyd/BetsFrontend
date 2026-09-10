const gamesElement = document.getElementById("performance");
const errorElement = document.getElementById("error");
let week = "";

const printPicksVsWinner = (pick, winner) => {
    const picksElem = document.createElement("div");
    picksElem.className = "performance-row";
    const jeffPickElem = document.createElement("div");
    jeffPickElem.innerText = pick["jeff"];
    if (winner && pick["jeff"].toLowerCase() === winner.toLowerCase()) {
        jeffPickElem.className = "winner";
    }
    picksElem.appendChild(jeffPickElem);
    const josePickElem = document.createElement("div");
    josePickElem.innerText = pick["jose"];
    if (winner && pick["jose"].toLowerCase() === winner.toLowerCase()) {
        josePickElem.className = "winner";
    }
    picksElem.appendChild(josePickElem);
    const winnerElem = document.createElement("div");
    winnerElem.innerText = winner || "";
    picksElem.appendChild(winnerElem);
    gamesElement.appendChild(picksElem);
};

const printPerformance = (picks, winners) => {
    const performanceTitleElem = document.createElement("div");
    performanceTitleElem.className = "performance-title";
    const jeffTitleElem = document.createElement("div");
    jeffTitleElem.innerText = "Jeff";
    performanceTitleElem.appendChild(jeffTitleElem);
    const joseTitleElem = document.createElement("div");
    joseTitleElem.innerText = "Jose";
    performanceTitleElem.appendChild(joseTitleElem);
    const winnerTitleElem = document.createElement("div");
    winnerTitleElem.innerText = "Winner";
    performanceTitleElem.appendChild(winnerTitleElem);
    gamesElement.appendChild(performanceTitleElem);
    sortByKickoff(picks, winners).forEach(element => {
        const winner = winners.find(item => item.game == element.game);
        printPicksVsWinner(element, winner ? winner.winner : null);
    });
};

const selectWeek = async (event) => {
    gamesElement.innerHTML = "";
    errorElement.innerHTML = "";
    week = event.target.value;
    const requestBody = {
        name1: 'jose',
        name2: 'jeff',
    };
    const response = await fetch(`${API_BASE_URL}/sames/${YEAR}/${week}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status === 200) {
        const sames = await response.json();
        const winners = await getWinners(week);
        printPerformance(sames, winners);
    } else {
        const errorBody = await response.json();
        errorElement.innerHTML = errorBody.error_message;
    }
};


const selectWeekElement = document.getElementById("week");
selectWeekElement.addEventListener("change", selectWeek);
