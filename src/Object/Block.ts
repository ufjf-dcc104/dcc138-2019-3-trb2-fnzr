import FixedObject from "./FixedObject";
import Settings from "@Settings";
import World from "@World";
import AssetManager from "@AssetManager";
import Ground from "./Ground";

export default class Block extends FixedObject {

    height = Settings.BLOCK_HEIGHT;
    width = Settings.BLOCK_WIDTH;
    color = "grey";    

    onExploded() {
        this.color = "yellow";
        console.log("Block Exploded");
        this.removeFromWorld();
        const ground = new Ground(this.x, this.y);
        World.positions[this.position.key].push(ground);
        World.objects.unshift(ground);
    }

    draw() {
        World.ctx.drawImage(AssetManager.sceneSpritesheet, 226, 53, 24, 22, this.x, this.y, Settings.BLOCK_WIDTH, Settings.BLOCK_HEIGHT);
    }

    removeFromWorld() {
        super.removeFromWorld(this.position.key);
    }

}