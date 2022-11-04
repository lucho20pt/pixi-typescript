// https://github.com/davidfig/pixi-scrollbox
import { Application, Sprite, Texture } from "pixi.js";
import { Scrollbox } from "pixi-scrollbox";

// create the scrollbox
const scrollbox = new Scrollbox({ boxWidth: 200, boxHeight: 200 });

// add a sprite to the scrollbox's content
const sprite = scrollbox.content.addChild(new Sprite(Texture.WHITE));
sprite.width = sprite.height = 500;
sprite.tint = 0xff0000;

// force an update of the scrollbox's calculations after updating the children
scrollbox.update();

// add the viewport to the stage
const app = new Application();
document.body.appendChild(app.view);
app.stage.addChild(scrollbox);
