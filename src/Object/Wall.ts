import FixedObject from "./FixedObject";
import Settings from "@Settings";
import World from "@World";
import AssetManager from "@AssetManager";

export default class Wall extends FixedObject {

    height = Settings.BLOCK_HEIGHT;
    width = Settings.BLOCK_WIDTH;
    color = "black";

    draw() {
        World.ctx.drawImage(AssetManager.sceneSpritesheet, 239, 114, 34, 44, this.x, this.y, Settings.BLOCK_WIDTH, Settings.BLOCK_HEIGHT);
    }
}