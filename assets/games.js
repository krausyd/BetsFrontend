const gamesElement = document.getElementById("games");
const errorElement = document.getElementById("error");
let totalGames = 0;
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

const selectWeek = async (event) => {
    gamesElement.innerHTML = "";
    errorElement.innerHTML = "";
    week = event.target.value;
    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/games/${YEAR}/${week}`);
    if (response.status === 200) {
        const games = await response.json();
        games.sort((a, b) => {
            if (!a.kickoff_utc) return 1;
            if (!b.kickoff_utc) return -1;
            return new Date(a.kickoff_utc) - new Date(b.kickoff_utc);
        });
        totalGames = games.length;
        printAllGames(games);
    } else {
        errorElement.innerHTML = "An error occurred when trying to get the games for that week"
    }
};

const printAllGames = (games) => {
    const titleDiv = document.createElement("div");
    titleDiv.className = "games-title";
    const visitorLabel = document.createElement("div");
    visitorLabel.innerHTML = "Visitor";
    visitorLabel.className = "games-label";
    titleDiv.append(visitorLabel);
    const homeLabel = document.createElement("div");
    homeLabel.innerHTML = "Home";
    homeLabel.className = "games-label";
    titleDiv.append(homeLabel);
    gamesElement.append(titleDiv);
    games.forEach( game => {
        gamesElement.append(printGame(game));
    });

    const saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "save";
    saveButton.addEventListener("click", saveBets);
    gamesElement.append(saveButton);
}

const printGame = (game) => {
    const gameDiv = document.createElement("div");
    gameDiv.className = "individual-game";
    gameDiv.id = `game_${game.game}`

    const checkMarkVisitor = document.createElement("input");
    checkMarkVisitor.type = "checkbox";
    checkMarkVisitor.id = `visitor_${game.game}`;
    const labelVisitor = document.createElement("label");
    labelVisitor.setAttribute("for", `visitor_${game.game}`);
    labelVisitor.innerHTML = game.visitor;
    const gameVisitorDiv = document.createElement("div");
    gameVisitorDiv.className = "game-visitor";
    gameVisitorDiv.append(checkMarkVisitor);
    gameVisitorDiv.append(labelVisitor);
    gameDiv.append(gameVisitorDiv);

    const checkMarkHome = document.createElement("input");
    checkMarkHome.type = "checkbox";
    checkMarkHome.id = `home_${game.game}`;
    const labelHome = document.createElement("label");
    labelHome.setAttribute("for", `home_${game.game}`);
    labelHome.innerHTML = game.home;
    const gameHomeDiv = document.createElement("div");
    gameHomeDiv.className = "game-home";
    gameHomeDiv.append(labelHome);
    gameHomeDiv.append(checkMarkHome);
    gameDiv.append(gameHomeDiv);

    return gameDiv;
};

const saveBets = async (event) => {
    errorElement.innerHTML = "";
    event.target.disabled = true;
    const name = document.getElementById("name").value;
    const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    if (!name) { 
        errorElement.innerHTML = "Please select your name before saving";
        event.target.disabled = false;
        return;
    }
    if (!checkedCheckboxes || checkedCheckboxes.length !== totalGames) {
        errorElement.innerHTML = "Please select one winner per game before saving";
        event.target.disabled = false;
        return;
    }
    const bets = [];
    checkedCheckboxes.forEach(checkbox => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        const game_id = checkbox.id.replace("visitor_", "").replace("home_", "");
        bets.push({
            game: game_id,
            winner: label.innerText,
        });
    });

    const response = await fetch(`https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod/bets/${YEAR}/${week}/${name.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({bets: bets})
    });
    if (response.status === 200) {
        errorElement.innerHTML = "SAVED SUCCESSFULLY!";
    } else {
        const errorBody = await response.json();
        errorElement.innerHTML = errorBody.error_message;
    }
    event.target.disabled = false;
}


const selectWeekElement = document.getElementById("week");
selectWeekElement.addEventListener("change", selectWeek);
