import { Application, Text, Container, Sprite, Texture, Graphics } from "pixi.js";
import { pIndex, pName, pScore } from "./styles";
import { Scrollbox } from "pixi-scrollbox";
import "./style.css";

// declare const VERSION: string;
// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const urlPlayers = "./assets/data/players.json";
const urlQuotes = "./assets/data/quotes.json";
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
    antialias: true,
});

// lightbox
const lightboxOuter = new Graphics();
lightboxOuter.lineStyle(1, 0x000000, 1);
lightboxOuter.beginFill(0x000000, 0.7);
lightboxOuter.drawRoundedRect(0, 0, gameWidth, gameHeight, 0);
lightboxOuter.endFill();
lightboxOuter.buttonMode = true;
lightboxOuter.interactive = true;
//
const lightboxInner = new Graphics();
lightboxInner.lineStyle(1, 0x000000, 1);
lightboxInner.beginFill(0xffffff, 1);
lightboxInner.drawRoundedRect(0, gameHeight / 2 / 2, gameWidth / 2, gameHeight / 2, 20);
lightboxInner.endFill();
lightboxInner.buttonMode = false;
lightboxInner.interactive = true;
//
const lightboxContainer = new Container();
lightboxContainer.addChild(lightboxOuter, lightboxInner);

// scrollbox
const scrollbox = new Scrollbox({ boxWidth: gameWidth, boxHeight: gameHeight, overflowX: "hidden" });
const sprite = scrollbox.content.addChild(new Sprite());
sprite.width = gameWidth;
sprite.height = gameHeight;

// get AVATAR
const getAvatarUrl = (type: number, avatar: number) => `${avatarUrl}/${type}/${avatar}.png`;

// fetch DATA PLAYERS & QUOTES
// const fetchPlayersAndQuotes = async () => {
//     const [playersResponse, quotesResponse] = await Promise.all([fetch(urlPlayers), fetch(urlQuotes)]);

//     if (!playersResponse.ok || !quotesResponse.ok) {
//         const message = `An error has occured: ${playersResponse.status}`;
//         throw new Error(message);
//     }

//     const players = await playersResponse.json();
//     const quotes = await quotesResponse.json();
//     return [players, quotes];
// };

// fetch DATA PLAYERS
const fetchPlayers = async () => {
    const playersResponse = await fetch(urlPlayers);

    if (!playersResponse.ok) {
        const message = `An error has occured: ${playersResponse.status}`;
        throw new Error(message);
    }

    const players = await playersResponse.json();
    return players;
};

// fetch DATA QUOTES
const fetchQuotes = async () => {
    const quotesResponse = await fetch(urlQuotes);

    if (!quotesResponse.ok) {
        const message = `An error has occured: ${quotesResponse.status}`;
        throw new Error(message);
    }

    const quotes = await quotesResponse.json();
    return quotes;
};

// render DATA PLAYERS
fetchPlayers()
    .then((players) => {
        // players; // fetched players
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
            playerSprite.height = 45;
            playerSprite.anchor.set(0, 0.5);
            playerSprite.tint = 0x00aaaa;

            // player CONTAINER
            const playerContainer = new Container();
            playerContainer.addChild(playerSprite);

            // player DESTRUCTER OBJ
            const { index, name, score, type, avatar } = players["players"][i];
            // console.log(index, name, score, type, avatar);

            // avatar
            const texture = Texture.from(getAvatarUrl(type, avatar));
            // console.log(getAvatarUrl(type, avatar));

            // BUTTON square
            const buttonSquare = new Graphics();
            buttonSquare.lineStyle(2, 0x000000, 1);
            buttonSquare.beginFill(0x650a5a, 0.25);
            buttonSquare.drawRoundedRect(0, 0, 75, 30, 5);
            buttonSquare.endFill();
            // BUTTON text
            const buttonText = new Text("Profile", pName);
            buttonText.position.set(15, 5);
            // BUTTON container
            const buttonContainer = new Container();
            buttonContainer.addChild(buttonSquare).addChild(buttonText);
            buttonContainer.buttonMode = true;
            buttonContainer.interactive = true;
            // BUTTON events
            buttonContainer.on("pointerdown", () => onClickButton(buttonSquare));
            buttonContainer.on("pointerover", () => onPointerOverButton(buttonSquare));
            buttonContainer.on("pointerout", () => onPointerOutButton(buttonSquare));

            // player CREATE
            const playerIndex = new Text(index, pIndex);
            const playerAvatar = new Sprite(texture);
            const playerName = new Text(name, pName);
            const playerScore = new Text(formatNumbers(score), pScore);

            // player SET
            playerIndex.position.set(10, -8);

            playerAvatar.anchor.set(0.5, 0.5);
            playerAvatar.position.set(50, 0);
            playerAvatar.scale.set(0.2, 0.2);

            playerName.position.set(70, 0);
            playerScore.position.set(140, 0);

            buttonContainer.position.set(90, -6);

            // player CONTAINER ADD
            playerContainer.addChild(playerIndex).addChild(playerName).addChild(playerScore).addChild(buttonContainer);
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
        lightboxInner.position.x = 25;
    } else {
        // Landscape mode
        console.log("Landscape");
        gameWidth = 725;
        gameHeight = 400;
        app.renderer.resize(gameWidth, gameHeight);
        scrollbox.update();
        lightboxInner.position.x = gameWidth / 4;
    }
}

// add comma to digits
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

// Button Events
const onClickButton = (object: Graphics) => {
    console.log("onClickButton", object);
    object.alpha = 0.5;
    // add lightboxContainer
    app.stage.addChild(lightboxContainer);

    // fetch QUOTES
    fetchQuotes()
        .then((quotes) => {
            // quotes; // fetched quotes
            // console.log("quotes =>", quotes["quotes"]);

            // VARS
            quotes["quotes"].length;
        })
        .catch((error) => {
            // quotes request failed
            console.log("error =>", error.message);
        });

    // remove lightbox
    lightboxInner.on("pointerdown", () => false);
    lightboxOuter.on("pointerdown", () => app.stage.removeChild(lightboxContainer));
};
const onPointerOverButton = (object: Graphics) => {
    object.alpha = 0.7;
};
const onPointerOutButton = (object: Graphics) => {
    object.alpha = 1;
};

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
