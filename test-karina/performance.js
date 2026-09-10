const gamesElement = document.getElementById("performance");
const errorElement = document.getElementById("error");
let week = "";

const printPicksVsWinner = (pick, winner) => {
    const picksElem = document.createElement("div");
    picksElem.className = "performance-row";
    const karinaPickElem = document.createElement("div");
    karinaPickElem.innerText = pick["karina"];
    if (winner && pick["karina"].toLowerCase() === winner.toLowerCase()) {
        karinaPickElem.className = "winner";
    }
    picksElem.appendChild(karinaPickElem);
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
    const karinaTitleElem = document.createElement("div");
    karinaTitleElem.innerText = "Karina";
    performanceTitleElem.appendChild(karinaTitleElem);
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
        name1: 'karina',
        name2: 'jose',
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
