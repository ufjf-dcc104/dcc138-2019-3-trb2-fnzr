import FixedObject from "./FixedObject";
import Settings from "@Settings";

export default class Block extends FixedObject {

    height = Settings.BLOCK_HEIGHT;
    width = Settings.BLOCK_WIDTH;
    color = "grey";    

    onExploded() {
        this.color = "yellow";
        console.log("Block Exploded");
        this.removeFromWorld();
    }

    removeFromWorld() {
        super.removeFromWorld(this.position.key);
    }

}