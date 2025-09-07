const statsElement = document.getElementById("stats");
const errorElement = document.getElementById("error");

const requestBody = {
    name1: 'jose',
    name2: 'jeff howell',
};
fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/picks_stats`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:8080',
    },
    body: JSON.stringify(requestBody)
}).then(response => response.json()
).then(data => {
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
        console.log(element);
        const rowElem = document.createElement("div");
        rowElem.className = "stats-row";
        const weekElem = document.createElement("div");
        weekElem.innerText = element.week;
        rowElem.appendChild(weekElem);
        const joseElem = document.createElement("div");
        joseElem.innerText = element["jose"];
        rowElem.appendChild(joseElem);
        const jeffElem = document.createElement("div");
        jeffElem.innerText = element["jeff howell"];
        rowElem.appendChild(jeffElem);
        const winnerElem = document.createElement("div");
        winnerElem.innerText = element.winner;
        rowElem.appendChild(winnerElem);
        statsElement.appendChild(rowElem);
        
    });
});