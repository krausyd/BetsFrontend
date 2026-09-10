const gamesElement = document.getElementById("performance");
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

const getWinners = async (week) => {
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/winners/${YEAR}/${week}`);
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
    jeffPickElem.innerText = pick["jeff"];
    if (winner && pick["jeff"].toLowerCase() === winner.toLowerCase()) {
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
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/sames/${YEAR}/${week}`, {
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
