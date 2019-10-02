import World from "@World";
import Player from "@Object/Player";
import { installControls, Button, installedControls } from "@Controller";

(window as any).World = World;

function onKeyDown(event: KeyboardEvent) {
    if (event.keyCode in installedControls) {
        installedControls[event.keyCode](true)
    }
}

function onKeyUp(event: KeyboardEvent) {
    if (event.keyCode in installedControls) {
        installedControls[event.keyCode](false)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    
World.start();
const p1 = new Player(35, 35, "green");
const p2 = new Player(356, 292, "blue");
p1.addToWorld();
p2.addToWorld();
//World.positions[Position.pair(1, 1)].push(p1);
installControls({
    [Button.RIGHT]: "39",
    [Button.LEFT]: "37",
    [Button.UP]: "38",
    [Button.DOWN]: "40",
    [Button.MOD]: "16",
    [Button.ATTACK]: "97"
}, p1);
World.players.push(p1);

installControls({
    [Button.RIGHT]: "68",
    [Button.LEFT]: "65",
    [Button.UP]: "87",
    [Button.DOWN]: "83",
    [Button.MOD]: "16",
    [Button.ATTACK]: "71"
}, p2);
World.players.push(p2);
});