import Settings from "@Settings";
import World from "@World";
import AssetManager from "@AssetManager";
import { WorldObject } from "./WorldObject";

export default class Ground extends WorldObject {

    height = Settings.BLOCK_HEIGHT;
    width = Settings.BLOCK_WIDTH;
    color = "white";

    draw() {
        World.ctx.drawImage(AssetManager.sceneSpritesheet, 7, 127, 32, 32, this.x, this.y, Settings.BLOCK_WIDTH, Settings.BLOCK_HEIGHT);
    }
}