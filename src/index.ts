import { Application, Text, Container, Sprite, Texture, Graphics } from "pixi.js";
import { pIndex, pName, pScore, pButton, pNameDark, pQuoteDark } from "./styles";
import { Scrollbox } from "pixi-scrollbox";
import "./style.css";

// declare const VERSION: string;
// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const url = "https://testing.cdn.arkadiumhosted.com/gameExamples/programming-assignments/senior-core-developer/";
// const urlPlayers = "./assets/data/players.json";
// const urlQuotes = "./assets/data/quotes.json";
const urlPlayers = `${url}/players.json`;
const urlQuotes = `${url}/quotes.json`;

// CANVAS
const portrait = window.matchMedia("(orientation: portrait)");
let gameWidth = 900;
let gameHeight = 500;

const app = new Application({
    backgroundColor: 0xffffff,
    // backgroundColor: 0x000000,
    width: gameWidth,
    height: gameHeight,
    antialias: true,
});

// profile
const profileName = new Text("", pNameDark);

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
const getAvatarUrl = (type: number, avatar: number) => `${url}/avatars/${type}/${avatar}.png`;

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

// fetching DATA PLAYERS
fetchPlayers()
    .then((players) => {
        // players; // fetched players
        // console.log("players =>", players["players"]);

        // VARS
        let y = 50;
        const playerLen = players["players"].length;

        // PLAYERS CONTANER
        for (let i = 0; i < playerLen; i++) {
            if (i !== 0) y += 70;

            // player SPRITE
            const playerSprite = new Sprite(Texture.WHITE);
            playerSprite.width = gameWidth - 25;
            playerSprite.height = 65;
            playerSprite.anchor.set(0, 0.5);
            playerSprite.tint = 0x00aaaa;

            // player CONTAINER
            const playerContainer = new Container();
            playerContainer.addChild(playerSprite);

            // player DESTRUCTER OBJ
            const { index, name, score, type, avatar } = players["players"][i];
            // console.log(index, name, score, type, avatar);

            // avatar
            const avatarTexture = Texture.from(getAvatarUrl(type, avatar));
            // console.log(getAvatarUrl(type, avatar));

            // BUTTON square
            const buttonSquare = new Graphics();
            buttonSquare.lineStyle(2, 0x000000, 1);
            buttonSquare.beginFill(0x650a5a, 0.25);
            buttonSquare.drawRoundedRect(0, 0, 75, 40, 5);
            buttonSquare.endFill();
            // BUTTON text
            const buttonText = new Text("Profile", pButton);
            buttonText.position.set(12, 10);
            // BUTTON container
            const buttonContainer = new Container();
            buttonContainer.addChild(buttonSquare).addChild(buttonText);
            buttonContainer.buttonMode = true;
            buttonContainer.interactive = true;
            // BUTTON events
            buttonContainer.on("pointerdown", () => onClickButton(buttonSquare, name, type, avatar));
            buttonContainer.on("pointerover", () => onPointerOverButton(buttonSquare));
            buttonContainer.on("pointerout", () => onPointerOutButton(buttonSquare));

            // player CREATE
            const playerIndex = new Text(index, pIndex);
            const playerAvatar = new Sprite(avatarTexture);
            const playerName = new Text(name, pName);
            const playerScore = new Text(formatNumbers(score), pScore);

            // player SET
            playerIndex.position.set(10, -8);

            playerAvatar.anchor.set(0.5, 0.5);
            playerAvatar.position.set(75, 0);
            playerAvatar.scale.set(0.38, 0.38);

            playerName.position.set(100, 0);
            playerScore.position.set(190, 0);

            buttonContainer.position.set(96, -8);

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

// fetching DATA QUOTES
const fetchSingleQuote = () => {
    return fetchQuotes()
        .then((quotes) => {
            // quotes; // fetched quotes
            // console.log("quotes =>", quotes["quotes"]);

            // VARS
            const quotesLen = quotes["quotes"].length;
            const randomInt = getRandomInt(0, quotesLen);
            // console.log(randomInt);
            const randomQuote = quotes["quotes"][randomInt];
            // console.log(randomQuote.quote);
            return randomQuote.quote;
        })
        .catch((error) => {
            // quotes request failed
            console.log("error =>", error.message);
        });
};

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
        gameWidth = 500;
        gameHeight = 900;
        app.renderer.resize(gameWidth, gameHeight);
        scrollbox.update();
        // lightbox
        lightboxInner.position.x = 30;
        lightboxOuter.height = gameHeight;
        profileName.position.set(120, 300);
    } else {
        // Landscape mode
        console.log("Landscape");
        gameWidth = 900;
        gameHeight = 500;
        app.renderer.resize(gameWidth, gameHeight);
        scrollbox.update();
        // lightbox
        lightboxInner.position.x = gameWidth / 4;
        profileName.x = lightboxInner.position.x + 10;
        profileName.position.set(lightboxInner.position.x + 80, 300);
    }
}

// Button Events
const onClickButton = async (object: Graphics, name: string, type: number, avatar: number) => {
    console.log("onClickButton");
    object.alpha = 0.5;
    // add lightboxContainer
    // console.log(name);

    // name
    profileName.text = name;
    profileName.anchor.set(0.5, 0.5);
    // avatar
    const profileTexture = Texture.from(getAvatarUrl(type, avatar));
    const profileAvatar = new Sprite(profileTexture);
    profileAvatar.anchor.set(0.5, 0.5);
    profileAvatar.position.set(0, 0);
    profileAvatar.scale.set(0.7, 0.7);
    profileAvatar.position.y = -80;
    // quote
    const fetchedQuote = await fetchSingleQuote();
    if (fetchedQuote.length > 200) pQuoteDark.fontSize = 26;
    else pQuoteDark.fontSize = 32;
    const profileQuote = new Text(fetchedQuote, pQuoteDark);
    profileQuote.anchor.set(0.5, 0.5);
    profileQuote.position.set(280, 35);
    // create profile
    const profileContainer = new Container();
    profileContainer.addChild(profileName).addChild(profileAvatar).addChild(profileQuote);

    // add profile
    lightboxContainer.addChild(profileContainer);

    // add lightbox
    app.stage.addChild(lightboxContainer);

    // fetch SINGLE QUOTE
    // fetchSingleQuote();

    // remove lightbox
    lightboxInner.on("pointerdown", () => false);
    lightboxOuter.on("pointerdown", () => {
        lightboxContainer.removeChild(profileContainer);
        lightboxContainer.removeChild(profileName);
        profileName.removeChild(profileAvatar);
        profileAvatar.removeChild(profileQuote);
        app.stage.removeChild(lightboxContainer);
    });
};
const onPointerOverButton = (object: Graphics) => {
    object.alpha = 0.7;
};
const onPointerOutButton = (object: Graphics) => {
    object.alpha = 1;
};

// add comma to digits
const formatNumbers = (num: number) => {
    if (num === null) return;
    return num
        .toString()
        .split("")
        .reverse()
        .map((digit, i) => (i != 0 && i % 3 === 0 ? `${digit},` : digit))
        .reverse()
        .join("");
};

// get random number
const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
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
