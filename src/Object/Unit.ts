import _ from "lodash";
import World from "@World";
import { WorldObject, Position } from "./WorldObject";
import Bomb from "./Bomb";
import FixedObject from "./FixedObject";

export default abstract class Unit extends WorldObject {

    _position!: Position    
    bombs = 1;
    activeBombs = 0;
    height = 18;
    width = 18;

    constructor(x: number, y: number, color: string) {
        super(x, y)
        this._position = new Position(x, y);
        this.color = color
    }

    set position(pos: Position) {        
        if (this.position.key == pos.key) return;        
        _.remove(World.positions[this.position.key], this)
        this._position = pos
        World.positions[pos.key].push(this)
    }

    get position() {
        return this._position;
    }

    isCollided([x, y]: number[]) {
        const position = new Position(x, y);
        const key = position.key;
        if (!(key in World.positions)){
            return false;
        }
        const objs = World.positions[key];
        return objs.some(obj => {
            if (obj instanceof Bomb) {
                return obj.owner != this || obj.timeAlive > 1
            }
            return obj instanceof FixedObject
        });
    }

    move(delta: number) {
        if (this.speedY == 0 && this.speedX == 0) {
            return;
        }
        const modX = this.speedX * delta;
        const modY = this.speedY * delta;
        const topLeft = [this.x + modX, this.y + modY];
        const topRight = [(this.x + this.width) + modX, this.y + modY];
        const bottomLeft = [this.x + modX, (this.y + this.height) + modY];
        const bottomRight = [(this.x + this.width) + modX, (this.y + this.width) + modY];
        if (this.isCollided(topLeft) || this.isCollided(topRight) || this.isCollided(bottomLeft) || this.isCollided(bottomRight)){
            return;
        }
        this.x += this.speedX * delta;
        this.y += this.speedY * delta;
        this.position = new Position(this.x, this.y);
    }

    onExploded() {
        console.log("Unit exploded");
    }

    removeFromWorld() {
        super.removeFromWorld();
        _.remove(World.positions[this.position.key], this)
    }

    dropBomb() {        
        const position = new Position(this.x, this.y);
        new Bomb(position, this).addToWorld();
        this.activeBombs++;
    }

    update(delta: number) {
        super.update(delta);
        this.move(delta);
    }
}