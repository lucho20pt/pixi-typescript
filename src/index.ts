import { Application, Loader, Text, Container, Sprite, Texture } from "pixi.js";
import { pIndex, pName, pScore } from "./styles";
import { Scrollbox } from "pixi-scrollbox";
import "./style.css";

// declare const VERSION: string;
// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const urlPlayers = "./assets/data/players.json";
const urlQuotes = "./assets/data/players.json";
// const urlPlayers = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/players.json";
// const urlQuotes = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/quotes.json";

const avatarUrl =
    "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/avatars";

// CANVAS
const portrait = window.matchMedia("(orientation: portrait)");
let gameWidth = 725;
let gameHeight = 400;

const app = new Application({
    backgroundColor: 0x00dddd,
    // backgroundColor: 0x000000,
    width: gameWidth,
    height: gameHeight,
});

// scrollbox
const scrollbox = new Scrollbox({ boxWidth: gameWidth, boxHeight: gameHeight, overflowX: "hidden" });
const sprite = scrollbox.content.addChild(new Sprite());
sprite.width = gameWidth;
sprite.height = gameHeight;

// get AVATAR
const getAvatarUrl = (type: number, avatar: number) => `${avatarUrl}/${type}/${avatar}.png`;

// fetch DATA PLAYERS & QUOTES
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

// render DATA PLAYERS & QUOTES
fetchPlayersAndQuotes()
    .then(([players, quotes]) => {
        players; // fetched players
        quotes; // fetched quotes
        // console.log("players =>", players["players"]);

        // VARS
        let y = 20;
        // const playerLen = players["players"].length;

        // PLAYERS CONTANER
        for (let i = 0; i < 1000; i++) {
            if (i !== 0) y += 50;

            // player SPRITE
            const playerSprite = new Sprite(Texture.WHITE);
            playerSprite.width = gameHeight;
            playerSprite.height = 50 - 5;
            playerSprite.anchor.set(0, 0.5);
            playerSprite.tint = 0x00aaaa;

            // player CONTAINER
            const playerContainer = new Container();
            playerContainer.addChild(playerSprite);

            // player DESTRUCTER OBJ
            const { index, name, score, type, avatar } = players["players"][i];
            score.toLocaleString();
            const texture = Texture.from(getAvatarUrl(type, avatar));
            // console.log(index, name, score, type, avatar);
            // console.log(getAvatarUrl(type, avatar));

            // player CREATE
            const playerIndex = new Text(index, pIndex);
            const playerAvatar = new Sprite(texture);
            const playerName = new Text(name, pName);
            const playerScore = new Text(formatNumbers(score), pScore);

            // player SET
            playerIndex.position.set(10, 0);

            playerAvatar.anchor.set(0.5, 0.5);
            playerAvatar.position.set(50, 0);
            playerAvatar.scale.set(0.2, 0.2);

            playerName.position.set(80, 0);
            playerScore.position.set(180, 0);

            // player CONTAINER ADD
            playerContainer.addChild(playerIndex).addChild(playerName).addChild(playerScore);
            playerContainer.addChild(playerAvatar);
            playerContainer.position.set(10, y);

            // scrollbox ADD player CONTAINER
            scrollbox.content.addChild(playerContainer);
        }
    })
    .catch((error) => {
        // /players or /quotes request failed
        console.log("error =>", error.message);
    });

// ON LOAD
window.onload = async (): Promise<void> => {
    // await loadGameAssets();
    document.body.appendChild(app.view);
    app.stage.addChild(scrollbox);
    resizeCanvas();
    app.stage.interactive = true;
};

// RESIZE CANVAS
function resizeCanvas(): void {
    const resize = () => {
        // set full screen
        // app.renderer.resize(window.innerWidth, window.innerHeight);
        // app.stage.scale.x = window.innerWidth / gameWidth;
        // app.stage.scale.y = window.innerHeight / gameHeight;
        isPortrait();
        scrollbox.update();
    };
    resize();
    window.addEventListener("resize", resize);
}

// isPortrait
function isPortrait(): void {
    // on init
    if (portrait.matches) {
        // Portrait mode
        console.log("Portrait");
        gameWidth = 400;
        gameHeight = 725;
        app.renderer.resize(gameWidth, gameHeight);
        scrollbox.update();
    } else {
        // Landscape mode
        console.log("Landscape");
        gameWidth = 725;
        gameHeight = 400;
        app.renderer.resize(gameWidth, gameHeight);
        scrollbox.update();
    }
}

function formatNumbers(num: number) {
    if (num === null) return;
    return num
        .toString()
        .split("")
        .reverse()
        .map((digit, i) => (i != 0 && i % 3 === 0 ? `${digit},` : digit))
        .reverse()
        .join("");
}

// LOAD ASSETS
// async function loadGameAssets(): Promise<void> {
//     return new Promise((res, rej) => {
//         const loader = Loader.shared;
//         loader.add("rabbit", "./assets/simpleSpriteSheet.json");

//         loader.onComplete.once(() => {
//             res();
//         });

//         loader.onError.once(() => {
//             rej();
//         });

//         loader.load();
//     });
// }
