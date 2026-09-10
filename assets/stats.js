const statsElement = document.getElementById("stats");
const errorElement = document.getElementById("error");

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
    const jeffTitleElement = document.createElement('div');
    jeffTitleElement.innerText = "Jeff";
    titleElement.appendChild(jeffTitleElement);
    const joseTitleElement = document.createElement('div');
    joseTitleElement.innerText = "Jose";
    titleElement.appendChild(joseTitleElement);
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
        const jeffElem = document.createElement("div");
        jeffElem.innerText = element["jeff"];
        rowElem.appendChild(jeffElem);
        const joseElem = document.createElement("div");
        joseElem.innerText = element["jose"];
        rowElem.appendChild(joseElem);
        const winnerElem = document.createElement("div");
        winnerElem.innerText = element.winner;
        winnerElem.className = "stats-winner";
        rowElem.appendChild(winnerElem);
        statsElement.appendChild(rowElem);
    });
};

fetch(`${API_BASE_URL}/picks_stats/${YEAR}`, {
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
