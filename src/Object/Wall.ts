import FixedObject from "./FixedObject";

export default class Wall extends FixedObject {

    height = 32;
    width = 32;
    color = "black";

    onExploded() {
        console.log("Wall exploded");
    }
}