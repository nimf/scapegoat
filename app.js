
var players = 3;
var player = 0;
var game = 0;
var seed = 0;
var rfunc;
var consequent = 0;
var scapegoats = [];
var shown = [];


function reset() {
    game = 0;
    consequent = 0;
    scapegoats = [];
    shown = [];
}

var colors = [
    "Red",
    "Yellow",
    "Blue",
    "Green",
    "Orange",
    "Purple",
];

var pages = [
    "setup-players",
    "setup-color",
    "setup-seed",
    "game-screen",
]

HTMLElement.prototype.hasClass = function(c){
    return this.className.split(" ").indexOf(c) > -1
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0);
    }
}

function byId(id) {
    return document.getElementById(id);
}

function goTo(page) {
    for (const p of pages) {
        byId(p).style.display = page === p ? "block" : "none";
    }
    byId("start-over-btn").style.display = page === "setup-players" ? "none" : "block";
}

function toGame() {
    if (shown[game] === undefined) {
        makeNext();
    }
    showGame();
}

function showGame() {
    byId("game-label").textContent = (game + 1);
    byId("scapegoat-label").textContent = colors[shown[game]];
    byId("scapegoat-label").className = "color-" + shown[game];
}

function makeNext() {
    if (scapegoats[game] === undefined) {
        scapegoats[game] = rfunc() % players;
    }
    if (scapegoats[game] === scapegoats[game-1]) {
        consequent += 1;
    } else {
        consequent = 0;
    }
    if (consequent > 1) {
        // Try to swap with further consequent-1 games.
        for (let i = 1; i < consequent; i++) {
            if (scapegoats[game+i] === undefined) {
                scapegoats[game+i] = rfunc() % players;
            }
            if (scapegoats[game+i] !== scapegoats[game]) {
                let temp = scapegoats[game+i];
                scapegoats[game+i] = scapegoats[game];
                scapegoats[game] = temp;
                consequent = 0;
            }
        }
    }

    if (shown[game] === undefined) {
        let candidate = scapegoats[game];
        while (candidate === player) {
            candidate = Math.floor(Math.random() * players);
        }
        shown[game] = candidate;
    }
}

window.addEventListener('load', (_event) => {
    goTo("setup-players");
});

window.addEventListener('click', (event) => {
    if (!event.target.hasClass("full-width-btn")) {
        return;
    }
    if (event.target.getAttribute("id") === "start-over-btn") {
        if (game > 1 && !confirm("Are you sure?")) {
            return;
        }
        reset();
        goTo("setup-players");
    }
    if (event.target.hasClass("players-select")) {
        players = parseInt(event.target.getAttribute("value"), 10);
        for (const p of document.getElementsByClassName("color-select")) {
            p.style.display = parseInt(p.getAttribute("value"), 10) < players ? "block" : "none";
        }
        goTo("setup-color");
    }
    if (event.target.hasClass("color-select")) {
        player = parseInt(event.target.getAttribute("value"), 10);
        goTo("setup-seed");
    }
    if (event.target.hasClass("seed-select")) {
        seed = parseInt(byId("seed-field").value, 10);
        byId("seed-label").textContent = seed;
        if (isNaN(seed)) {
            alert("please enter a valid number");
            return;
        }
        rfunc = mulberry32(seed);
        toGame();
        goTo("game-screen");
    }
    if (event.target.hasClass("next-game")) {
        game += 1;
        toGame();
    }
    if (event.target.hasClass("prev-game")) {
        game = game > 0 ? game - 1 : game;
        toGame();
    }
});
