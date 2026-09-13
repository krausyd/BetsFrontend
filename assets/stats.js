const statsElement = document.getElementById("stats");
const errorElement = document.getElementById("error");
const seasonSelectElement = document.getElementById("season-select");

// Earliest season this app has data for. Adjust if you ever backfill
// something older.
const EARLIEST_SEASON = 2025;

// Populate the season dropdown: current season down to the earliest one,
// most recent first. This grows on its own each year since it's based on
// getCurrentSeasonYear() (from common.js) rather than a hardcoded list.
const currentSeason = getCurrentSeasonYear();
for (let year = currentSeason; year >= EARLIEST_SEASON; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.innerText = year;
    seasonSelectElement.appendChild(option);
}
seasonSelectElement.value = currentSeason;

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
        winnerElem.className = element.winner === "Tie" ? "stats-winner no-pick" : "stats-winner";
        rowElem.appendChild(winnerElem);
        statsElement.appendChild(rowElem);
    });
};

const loadStats = async (year) => {
    statsElement.innerHTML = "";
    errorElement.innerHTML = "";
    const response = await fetch(`${API_BASE_URL}/picks_stats/${year}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status === 200) {
        const data = await response.json();
        printStats(data);
    } else {
        const errorBody = await response.json();
        errorElement.innerHTML = errorBody.error_message;
    }
};

seasonSelectElement.addEventListener("change", (event) => loadStats(event.target.value));

loadStats(currentSeason);
