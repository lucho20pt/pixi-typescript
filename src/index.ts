import { Application, Loader, Text } from "pixi.js";
import "./style.css";

// declare const VERSION: string;
// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const urlPlayers =
    "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/players.json";
const urlQuotes =
    "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/quotes.json";

const gameWidth = 800;
const gameHeight = 600;

const app = new Application({
    backgroundColor: 0xf2f2f2,
    width: gameWidth,
    height: gameHeight,
});

// GET DATA PLAYERS & QUOTES
const fetchPlayersAndQuotes = async () => {
    const [playersResponse, quotesResponse] = await Promise.all([fetch(urlPlayers), fetch(urlQuotes)]);

    if (!playersResponse.ok || !quotesResponse.ok) {
        const message = `An error has occured: ${playersResponse.status}`;
        throw new Error(message);
    }

    const players = await playersResponse.json();
    const quotes = await quotesResponse.json();
    return [players, quotes];
};
fetchPlayersAndQuotes()
    .then(([players, quotes]) => {
        console.log("players =>", players);
        // console.log("quotes =>", quotes);
        players; // fetched players
        quotes; // fetched quotes
    })
    .catch((error) => {
        // /players or /quotes request failed
        console.log("error =>", error.message);
    });

// BASIC TEXT
const basicText = new Text("Hello World");
basicText.anchor.set(0.5, 0.5);
basicText.position.set(gameWidth / 2, 50);

// ON LOAD
window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);
    app.stage.addChild(basicText);
    app.stage.addChild(basicText);

    resizeCanvas();
    app.stage.interactive = true;
};

// LOAD ASSETS
async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("rabbit", "./assets/simpleSpriteSheet.json");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

// RESIZE CANVAS
function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}
