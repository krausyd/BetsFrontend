const statsElement = document.getElementById("stats");
const errorElement = document.getElementById("error");

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

const requestBody = {
    name1: 'jose',
    name2: 'jeff',
};

const printStats = (data) => {
    const titleElement = document.createElement('div');
    titleElement.className = "stats-title";
    const weekTitleElement = document.createElement('div');
    weekTitleElement.innerText = "Week";
    titleElement.appendChild(weekTitleElement);
    const joseTitleElement = document.createElement('div');
    joseTitleElement.innerText = "Jose";
    titleElement.appendChild(joseTitleElement);
    const jeffTitleElement = document.createElement('div');
    jeffTitleElement.innerText = "Jeff";
    titleElement.appendChild(jeffTitleElement);
    const winnerTitleElement = document.createElement('div');
    winnerTitleElement.innerText = "Winner";
    titleElement.appendChild(winnerTitleElement);
    statsElement.appendChild(titleElement);
    data.forEach(element => {
        const rowElem = document.createElement("div");
        rowElem.className = "stats-row";
        const weekElem = document.createElement("div");
        weekElem.innerText = element.week;
        weekElem.className = "week";
        rowElem.appendChild(weekElem);
        const joseElem = document.createElement("div");
        joseElem.innerText = element["jose"];
        rowElem.appendChild(joseElem);
        const jeffElem = document.createElement("div");
        jeffElem.innerText = element["jeff"];
        rowElem.appendChild(jeffElem);
        const winnerElem = document.createElement("div");
        winnerElem.innerText = element.winner;
        winnerElem.className = "stats-winner";
        rowElem.appendChild(winnerElem);
        statsElement.appendChild(rowElem);
    });
};

fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/picks_stats/${YEAR}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
}).then(async (response) => {
    if (response.status === 200) {
        const data = await response.json();
        printStats(data);
    } else {
        const errorBody = await response.json();
        errorElement.innerHTML = errorBody.error_message;
    }
});
