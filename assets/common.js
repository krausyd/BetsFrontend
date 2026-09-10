// Shared helpers loaded by every page on the site, before that page's own
// script. Anything used by more than one page lives here instead of being
// copy-pasted into each one.

const API_BASE_URL = "https://haqfcp8xdl.execute-api.us-east-1.amazonaws.com/prod";

// The NFL season is named after the year it starts in, but runs into
// January/February of the following calendar year. So in Jan/Feb we're
// still in the season that started the previous year.
const getCurrentSeasonYear = () => {
    const now = new Date();
    const month = now.getMonth(); // 0 = January
    return month <= 1 ? now.getFullYear() - 1 : now.getFullYear();
};

const YEAR = getCurrentSeasonYear().toString();

// Fills in the "Season 2026" header, if this page has one. Runs
// immediately -- assumes this script tag comes after the nav markup in
// the HTML, which is the case on every page.
const seasonElem = document.getElementById("season");
if (seasonElem) {
    seasonElem.innerText = `Season ${YEAR}`;
}

// Sorts a list of {game, ...} items (differences, sames, or the games
// themselves) by kickoff time, using a games/winners list as the lookup
// for each game's kickoff_utc. Games with no usable kickoff time sort last.
const sortByKickoff = (items, gamesWithKickoff) => {
    const kickoffByGame = Object.fromEntries(gamesWithKickoff.map((g) => [g.game, g.kickoff_utc]));
    return [...items].sort((a, b) => {
        const kickoffA = kickoffByGame[a.game];
        const kickoffB = kickoffByGame[b.game];
        if (!kickoffA) return 1;
        if (!kickoffB) return -1;
        return new Date(kickoffA) - new Date(kickoffB);
    });
};

// Gets every game (with kickoff/winner info) for a week. Shared by
// compare.js and performance.js, which both need this to sort and to
// highlight the correct winner.
const getWinners = async (week) => {
    const response = await fetch(`${API_BASE_URL}/winners/${YEAR}/${week}`);
    if (response.status === 200) {
        return await response.json();
    }
    return [];
};
