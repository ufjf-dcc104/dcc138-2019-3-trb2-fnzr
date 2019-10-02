import Player from "@Object/Player";
import Settings from "@Settings";

export enum Button {
    NONE, UP, DOWN, LEFT, RIGHT, MOD, ATTACK
}

export const installedControls: {
    [key: string]: Function;
} = {};

interface ControlScheme {
    [Button.RIGHT]: string;
    [Button.LEFT]: string;
    [Button.UP]: string;
    [Button.DOWN]: string;
    [Button.MOD]: string;
    [Button.ATTACK]: string;
}

export function installControls(controls: ControlScheme, player: Player) {
    const newControls: typeof installedControls = {};
    for (const [button, keyboardKey] of Object.entries(controls)) {
        newControls[keyboardKey] = player.controller.handleCommand(button as unknown as Button)
    }
    Object.assign(installedControls, newControls)
}

export default class Controller {
    lastX = Button.NONE
    lastY = Button.NONE
    factorX = 0;
    factorY = 0;

    buttons = {
        [Button.NONE]: false,
        [Button.UP]: false,
        [Button.DOWN]: false,
        [Button.LEFT]: false,
        [Button.RIGHT]: false,
        [Button.MOD]: false,
        [Button.ATTACK]: false,
    }
    player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    handleCommand(button: Button) {
        return (activate: boolean) => {
            this.buttons[button] = activate;
        }
    }

    update() {
        if (!this.buttons[this.lastX]) {
            if (this.buttons[Button.LEFT]) {
                this.factorX = -1;
                this.lastX = Button.LEFT;
            }
            else if (this.buttons[Button.RIGHT]) {
                this.factorX = 1;
                this.lastX = Button.RIGHT;
            }
            else {
                this.factorX = 0;
                this.lastX = Button.NONE;
            }
        }
        if (!this.buttons[this.lastY]) {
            if (this.buttons[Button.DOWN]) {
                this.factorY = 1;
                this.lastY = Button.DOWN;
            }
            else if (this.buttons[Button.UP]) {
                this.factorY = -1;
                this.lastY = Button.UP;
            }
            else {
                this.factorY = 0;
                this.lastY = Button.NONE;
            }
        }
        const speed = this.buttons[Button.MOD] ? Settings.WALK_SPEED : Settings.MOVE_SPEED;
        this.player.speedX = this.factorX * speed;
        this.player.speedY = this.factorY * speed;
    }
}