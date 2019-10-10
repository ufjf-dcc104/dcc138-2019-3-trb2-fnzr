import _ from "lodash";
import World from "@World";
import { WorldObject, Position } from "./WorldObject";
import Bomb from "./Bomb";
import FixedObject from "./FixedObject";
import { Sprites } from "@AssetManager";
import Settings from "@Settings";

export default abstract class Unit extends WorldObject {

    _position = new Position(0, 0);
    bombs = 1;
    activeBombs = 0;
    height = 8;
    width = 16;
    name: string;
    static frameUpdate = 0.16;
    currentFrame = 0;
    currentAnimation = "run";
    lastFrameUpdate = 0;
    sprites: Sprites = {};

    constructor(name: string, x: number, y: number, color: string) {
        super(Settings.BLOCK_WIDTH * x + Settings.BLOCK_WIDTH / 4, Settings.BLOCK_HEIGHT * x + Settings.BLOCK_HEIGHT / 4);
        this.position = new Position(this.x, this.y);
        this.color = color
        this.name = name;
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
        if (!this.isWalking) {
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
        this.removeFromWorld();
    }

    removeFromWorld() {
        super.removeFromWorld();
        _.remove(World.positions[this.position.key], this)
        _.remove(World.units, this);
    }

    dropBomb() {        
        const position = new Position(this.x, this.y);
        new Bomb(position, this).addToWorld();
        this.activeBombs++;
    }

    draw() {
        if (Settings.DEBUG) {
            super.draw();
        }
        else {
            const sprite = this.sprites[this.currentAnimation][this.currentFrame];
            World.ctx.drawImage(sprite, this.x -  Settings.BLOCK_WIDTH / 4, this.y - Settings.BLOCK_HEIGHT / 2, sprite.width, sprite.height);
            //context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        }
        
    }

    updateSpriteOrientation() {

    }

    get isWalking() {
        return this.speedY != 0 || this.speedX != 0;
    }

    animate(delta: number) {
        if (this.isWalking) {
            this.currentAnimation = "run";
        }
        else {
            this.currentAnimation = "idle"
        }
        this.lastFrameUpdate += delta;
        if (this.lastFrameUpdate >= Unit.frameUpdate) {
            this.lastFrameUpdate = 0;
            if (this.currentFrame + 1 == this.sprites[this.currentAnimation].length) {
                this.currentFrame = 0;
            }
            else {
                this.currentFrame++;
            }
        }
    }

    update(delta: number) {
        super.update(delta);
        this.move(delta);
        this.animate(delta);
    }
}