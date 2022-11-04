import { Application, Loader, Text, Container, Sprite, Texture } from "pixi.js";
import { pIndex, pName, pScore } from "./styles";
import "./style.css";

// declare const VERSION: string;
// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const urlPlayers = "./assets/data/players.json";
const urlQuotes = "./assets/data/players.json";
// const urlPlayers = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/players.json";
// const urlQuotes = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/quotes.json";

// const avatarPromises: string[] = [];
const avatarUrl =
    "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/avatars";
const getAvatarUrl = (type: number, avatar: number) => `${avatarUrl}/${type}/${avatar}.png`;

// CANVAS
const portrait = window.matchMedia("(orientation: portrait)");
const gameWidth = 800;
const gameHeight = 400;

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
        // console.log("players =>", players["players"]);

        // variables
        let y = 0;
        // const playerLen = players["players"].length;

        // PLAYERS CONTANER
        for (let i = 0; i < 5; i++) {
            y += 50;
            const playerContainer = new Container();
            //
            const { index, name, score, type, avatar } = players["players"][i];
            const texture = Texture.from(getAvatarUrl(type, avatar));
            // console.log(index, name, score, type, avatar);
            // console.log(getAvatarUrl(type, avatar));
            //
            const playerIndex = new Text(index, pIndex);
            const playerAvatar = new Sprite(texture);
            const playerName = new Text(name, pName);
            const playerScore = new Text(score, pScore);
            //
            playerIndex.position.set(10, 0);
            playerAvatar.anchor.set(0.5, 0.5);
            playerAvatar.position.set(50, 0);
            playerAvatar.scale.set(0.2, 0.2);
            playerName.position.set(100, 0);
            playerScore.position.set(200, 0);

            // app.stage.addChild(player);
            playerContainer.addChild(playerIndex).addChild(playerName).addChild(playerScore);
            playerContainer.addChild(playerAvatar);
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
    // on init
    if (portrait.matches) {
        // Portrait mode
        console.log("init Portrait");
        app.renderer.resize(gameHeight, gameWidth);
    } else {
        // Landscape mode
        console.log("init Landscape");
        app.renderer.resize(gameWidth, gameHeight);
    }

    // on change
    portrait.addEventListener("change", function (e) {
        if (e.matches) {
            // Portrait mode
            console.log("Portrait");
            app.renderer.resize(gameHeight, gameWidth);
        } else {
            // Landscape mode
            console.log("Landscape");
            app.renderer.resize(gameWidth, gameHeight);
        }
    });
}

// function resizeCanvas(): void {
//     const resize = () => {
//         app.renderer.resize(window.innerWidth, window.innerHeight);
//         app.stage.scale.x = window.innerWidth / gameWidth;
//         app.stage.scale.y = window.innerHeight / gameHeight;
//     };

//     resize();

//     window.addEventListener("resize", resize);
// }
