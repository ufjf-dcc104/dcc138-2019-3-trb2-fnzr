import Unit from "./Unit";
import Controller, { Button } from "@Controller";

export default class Player extends Unit {

    controller: Controller = new Controller(this);

    update(delta: number) {
        this.controller.update();
        if (this.controller.buttons[Button.ATTACK]) {
            if (this.activeBombs < this.bombs) {
                this.dropBomb();
            }
        }
        super.update(delta);
    }
}