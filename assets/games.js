const gamesElement = document.getElementById("games");
const errorElement = document.getElementById("error");
let week = "";

const PICK_DEADLINE_BUFFER_MS = 30 * 60 * 1000;

// A game's pick deadline is 30 minutes before its own kickoff. Returns null
// if there's no usable kickoff_utc to compute a deadline from.
const getGameDeadlineMs = (game) => {
    if (!game.kickoff_utc) return null;
    const kickoffMs = new Date(game.kickoff_utc).getTime();
    if (isNaN(kickoffMs)) return null;
    return kickoffMs - PICK_DEADLINE_BUFFER_MS;
};

const nameElement = document.getElementById("name");
const weekElement = document.getElementById("week");

// Both a name and a week are needed before we can show anything, since we
// now need to know whose picks to pre-fill/lock alongside the games.
const loadWeek = async () => {
    gamesElement.innerHTML = "";
    errorElement.innerHTML = "";
    const name = nameElement.value;
    week = weekElement.value;
    if (!name || !week) {
        return;
    }

    const [gamesResponse, picksResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/games/${YEAR}/${week}`),
        fetch(`${API_BASE_URL}/picks/${YEAR}/${week}/${name.toLowerCase()}`),
    ]);

    if (gamesResponse.status !== 200) {
        errorElement.innerHTML = "An error occurred when trying to get the games for that week";
        return;
    }

    const gamesUnsorted = await gamesResponse.json();
    // games are sorted using themselves as the kickoff lookup, since each
    // game already carries its own kickoff_utc
    const games = sortByKickoff(gamesUnsorted, gamesUnsorted);

    const existingPicks = picksResponse.status === 200 ? await picksResponse.json() : [];
    const existingPicksByGame = Object.fromEntries(existingPicks.map((pick) => [pick.game, pick.winner]));

    printAllGames(games, existingPicksByGame);
};

const printAllGames = (games, existingPicksByGame) => {
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
        gamesElement.append(printGame(game, existingPicksByGame));
    });

    const saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "save";
    saveButton.addEventListener("click", saveBets);
    gamesElement.append(saveButton);
}

const printGame = (game, existingPicksByGame) => {
    const gameDiv = document.createElement("div");
    gameDiv.className = "individual-game";
    gameDiv.id = `game_${game.game}`

    const existingWinner = existingPicksByGame[game.game];
    let locked = !!existingWinner;
    let lockedReason = existingWinner ? "already picked" : null;
    if (!locked) {
        const deadlineMs = getGameDeadlineMs(game);
        if (deadlineMs !== null && Date.now() > deadlineMs) {
            locked = true;
            lockedReason = "locked";
        }
    }

    const checkMarkVisitor = document.createElement("input");
    checkMarkVisitor.type = "checkbox";
    checkMarkVisitor.id = `visitor_${game.game}`;
    if (existingWinner === game.visitor) checkMarkVisitor.checked = true;
    if (locked) checkMarkVisitor.disabled = true;
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
    if (existingWinner === game.home) checkMarkHome.checked = true;
    if (locked) checkMarkHome.disabled = true;
    const labelHome = document.createElement("label");
    labelHome.setAttribute("for", `home_${game.game}`);
    labelHome.innerHTML = game.home;
    const gameHomeDiv = document.createElement("div");
    gameHomeDiv.className = "game-home";
    gameHomeDiv.append(labelHome);
    gameHomeDiv.append(checkMarkHome);
    gameDiv.append(gameHomeDiv);

    const noteElem = document.createElement("span");
    noteElem.className = "game-note";
    if (lockedReason) {
        noteElem.innerText = lockedReason === "already picked" ? "(picked)" : "(locked)";
    }
    gameDiv.append(noteElem);

    return gameDiv;
};

const saveBets = async (event) => {
    errorElement.innerHTML = "";
    event.target.disabled = true;
    const name = nameElement.value;
    // only send NEW selections -- checked-but-disabled boxes are existing
    // picks being displayed, not something to resubmit.
    const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)');
    if (!name) {
        errorElement.innerHTML = "Please select your name before saving";
        event.target.disabled = false;
        return;
    }
    if (!checkedCheckboxes || checkedCheckboxes.length === 0) {
        errorElement.innerHTML = "Select at least one game to save";
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

    const response = await fetch(`${API_BASE_URL}/bets/${YEAR}/${week}/${name.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({bets: bets})
    });
    if (response.status === 200) {
        const result = await response.json();
        let message = `Saved ${result.saved.length} pick(s)!`;
        if (result.ignored && result.ignored.length > 0) {
            const reasons = result.ignored.map(i => `game ${i.game} (${i.reason})`).join(", ");
            message += ` ${result.ignored.length} pick(s) were not saved: ${reasons}.`;
        }
        errorElement.innerHTML = message;
        await loadWeek(); // refresh so newly-picked games show as locked
    } else {
        const errorBody = await response.json();
        errorElement.innerHTML = errorBody.error_message;
        event.target.disabled = false;
    }
}

nameElement.addEventListener("change", loadWeek);
weekElement.addEventListener("change", loadWeek);
