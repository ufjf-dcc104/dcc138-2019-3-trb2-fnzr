import _ from "lodash";
import World from "@World";
import { WorldObject, Position } from "./WorldObject";
import Wall from "./Wall";
import Block from "./Block";
import Unit from "./Unit";

export default class Bomb extends WorldObject {

    height = 24;
    width = 24;
    color = "red";
    position: Position;
    timeToExplode = 3;
    power = 3;
    owner: Unit;
    
    constructor(position: Position, owner: Unit) {
        super(0, 0);        
        this.x = position.i * 32 + 4;
        this.y = position.j * 32 + 4;
        this.position = position;
        World.positions[position.key].push(this);        
        this.owner = owner;
    }

    onExploded() {

    }

    explode() {
        function _explode(i: number, j: number) {
            let blocked = false;
            const key = `${i},${j}`;
            if (key in World.positions) {
                World.positions[key].forEach((obj) => {                    
                    obj.onExploded();
                    if (obj instanceof Wall || obj instanceof Block) {
                        blocked = true;
                    }
                })
            }
            return blocked;
        }
        for (let x=1; x<=this.power;x++) {
            if (_explode(this.position.i + x, this.position.j)) {                
                break;
            }
        }

        for (let x=1; x<=this.power;x++) {
           if (_explode(this.position.i, this.position.j + x)) {
                break;
            }
        }

        for (let x=1; x<=this.power;x++) {
            if (_explode(this.position.i - x, this.position.j)) {                
                break;
            }
        }

        for (let x=1; x<=this.power;x++) {
           if (_explode(this.position.i, this.position.j - x)) {
                break;
            }
        }
    }

    removeFromWorld() {
        this.owner.activeBombs--;
        super.removeFromWorld(this.position.key);
    }

    update(delta: number) {
        super.update(delta);
        if (this.timeAlive > this.timeToExplode) {
            this.removeFromWorld();
            this.explode();
        }        
        //console.log(this.timeAlive);
    }
}