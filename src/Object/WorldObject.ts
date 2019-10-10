import _ from "lodash";
import World from "@World";
import Settings from "@Settings";

export class Position {
    i: number;
    j: number;
    key: string;
    
    constructor(x: number, y: number) {        
        this.i = Math.floor(x / Settings.BLOCK_WIDTH);
        this.j = Math.floor(y / Settings.BLOCK_HEIGHT);
        this.key = `${this.i},${this.j}`;
    }

    equals(other: Position) {
        return this.i == other.i && this.j == other.j;
    }

    toString() {
        return this.key;
    }
}

export abstract class WorldObject {
    color = "black";
    width = 0;
    height = 0;
    speed = 0;
    speedX = 0;
    speedY = 0;
    isEnemy = true;
    radius = 0;
    angle = 0;
    timeAlive = 0;
    x = 0
    screenY = 0;
    private _y = 0

    set y(value: number) {
        this._y = value;
        this.screenY = value;
    }

    get y(): number {
        return this._y;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw() {
        World.ctx.fillStyle = this.color;
        if (Settings.DEBUG) {
            World.ctx.beginPath();
            World.ctx.rect(this.x, this.screenY, this.width, this.height);
            World.ctx.stroke();
        }
        else {
            World.ctx.fillRect(this.x, this.screenY, this.width, this.height)
        }
    }
    
    update(delta: number) {
        this.timeAlive += delta;
    }

    addToWorld() {        
        World.objects.push(this);
    }

    removeFromWorld(pos?: string) {
        _.remove(World.objects, this);
        if (pos) {
            _.remove(World.positions[pos], this)
        }
    }

    onExploded() {};
}