import _ from "lodash";
import World from "@World";
import { WorldObject, Position } from "./WorldObject";
import Wall from "./Wall";
import Block from "./Block";
import Unit from "./Unit";
import Settings from "@Settings";
import { ExplosionType, Explosion } from "./Explosion";
import AssetManager from "@AssetManager";

export default class Bomb extends WorldObject {

    height = Settings.BLOCK_HEIGHT / 2;
    width = Settings.BLOCK_WIDTH / 2;
    color = "red";
    position: Position;
    timeToExplode = 3;
    power = 3;
    owner: Unit;
    static frameUpdate = 0.16;
    currentFrame = 0;
    lastFrameUpdate = 0;
    
    constructor(position: Position, owner: Unit) {
        super(0, 0);        
        this.x = position.i * Settings.BLOCK_WIDTH;
        this.y = position.j * Settings.BLOCK_HEIGHT;
        this.position = position;
        World.positions[position.key].push(this);        
        this.owner = owner;
    }

    _explode(i: number, j: number, type: ExplosionType) {
        let blocked = false;
        const key = `${i},${j}`;        
        let hitWall = false;
        if (key in World.positions) {
            World.positions[key].forEach((obj) => {                    
                obj.onExploded();
                if (obj instanceof Wall) {
                    hitWall = true;
                    blocked = true;
                }
                if (obj instanceof Block) {
                    blocked = true;
                }
            })
        }
        if (!hitWall) {
            World.explosions.push(new Explosion(i, j, type))
        }
        return blocked;
    }

    explodeRight() {        
        for (let x=1; x<this.power;x++) {
            if (this._explode(this.position.i + x, this.position.j, ExplosionType.HORIZONTAL)) {
                return;
            }
        }
        this._explode(this.position.i + this.power, this.position.j, ExplosionType.RIGHT)
    }

    explodeLeft() {
        for (let x=1; x<this.power;x++) {
            if (this._explode(this.position.i - x, this.position.j, ExplosionType.HORIZONTAL)) {
                return;
            }
        }
        this._explode(this.position.i - this.power, this.position.j, ExplosionType.LEFT)
    }

    explodeUp() {        
        for (let x=1; x<this.power;x++) {
            if (this._explode(this.position.i, this.position.j + x, ExplosionType.VERTICAL)) {
                return;
            }
        }
        this._explode(this.position.i, this.position.j + this.power, ExplosionType.UP)
    }

    explodeDown() {
        for (let x=1; x<this.power;x++) {
            if (this._explode(this.position.i, this.position.j - x, ExplosionType.VERTICAL)) {
                return;
            }
        }
        this._explode(this.position.i, this.position.j - this.power, ExplosionType.DOWN)
    }

    explode() {        
        this._explode(this.position.i, this.position.j, ExplosionType.CENTER);
        this.explodeRight();
        this.explodeLeft();
        this.explodeUp();
        this.explodeDown();
    }

    removeFromWorld() {
        this.owner.activeBombs--;
        super.removeFromWorld(this.position.key);
    }

    draw() {
        if (Settings.DEBUG) {
            super.draw();
        }
        else {
            World.ctx.drawImage(AssetManager.bombSprite, 258 * this.currentFrame, 0, 256, 256, this.x, this.y, Settings.BLOCK_WIDTH, Settings.BLOCK_HEIGHT);
            //context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        }
        
    }

    update(delta: number) {
        super.update(delta);
        this.lastFrameUpdate += delta;
        if (this.lastFrameUpdate >= Unit.frameUpdate) {
            this.lastFrameUpdate = 0;
            if (this.currentFrame + 1 == 15) {
                this.currentFrame = 0;
            }
            else {
                this.currentFrame++;
            }
        }
        if (this.timeAlive > this.timeToExplode) {
            this.removeFromWorld();
            this.explode();
        }        
    }
}