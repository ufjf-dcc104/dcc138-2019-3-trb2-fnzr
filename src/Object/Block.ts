import FixedObject from "./FixedObject";

export default class Block extends FixedObject {

    height = 32;
    width = 32;
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