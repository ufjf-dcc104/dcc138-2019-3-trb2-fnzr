import World from "@World";
import { WorldObject, Position } from "./WorldObject";
import Settings from "@Settings";

export default abstract class FixedObject extends WorldObject {
    position: Position;

    constructor(x: number, y: number) {
        super(x, y);
        this.position = new Position(x, y);
    }

    draw() {
        super.draw();
        if (Settings.DEBUG) {
            World.ctx.fillText(`(${this.position.i},${this.position.j})`, this.x + 4, this.screenY + 8);
        }
    }
}