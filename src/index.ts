import { Application, Loader, Text, Container } from "pixi.js";
import { pIndex, pName, pScore } from "./styles";
import "./style.css";

// declare const VERSION: string;
// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const urlPlayers = "./assets/data/players.json";
const urlQuotes = "./assets/data/players.json";
// const urlPlayers = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/players.json";
// const urlQuotes = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/quotes.json";
// const urlAvatars = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/avatars/2/8.png";

// CANVAS
const gameWidth = 960;
const gameHeight = 600;

const app = new Application({
    backgroundColor: 0x00bbbb,
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
        players; // fetched players
        quotes; // fetched quotes
        // console.log("quotes =>", quotes);
        console.log("players =>", players["players"]);

        // variables
        let y = 0;
        // const playerLen = players["players"].length;

        for (let i = 0; i < 5; i++) {
            y += 40;
            const playerContainer = new Container();
            //
            const playerIndex: number = players["players"][i].index;
            const playerName: string = players["players"][i].name;
            const playerScore: number = players["players"][i].score;
            //
            const index = new Text(playerIndex, pIndex);
            const name = new Text(playerName, pName);
            const score = new Text(playerScore, pScore);
            //
            index.position.set(100, 0);
            name.position.set(100, 0);
            score.position.set(200, 0);

            // app.stage.addChild(player);
            playerContainer.addChild(index).addChild(name).addChild(score);
            playerContainer.position.set(10, y);
            app.stage.addChild(playerContainer);
            // player.anchor.set(0.5, 0.5);
        }
    })
    .catch((error) => {
        // /players or /quotes request failed
        console.log("error =>", error.message);
    });

// ON LOAD
window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    // resizeCanvas();
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
