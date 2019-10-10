import World from "@World";
import { Position } from "./WorldObject";
import Settings from "@Settings";
import AssetManager from "@AssetManager";
import _ from "lodash";

interface SpriteArea {
    clipX: number,
    clipY: number,
    clipHeight: number,
    clipWidth: number
}

export enum ExplosionType {
    LEFT, RIGHT, HORIZONTAL,
    UP, DOWN, VERTICAL,
    CENTER
}

export class Explosion {

    x: number
    y: number
    height = 5;
    static explosionTime = 0.5;
    //growthPerMS = Settings.BLOCK_HEIGHT / Explosion.visualTime;
    //lastGrowth = 0;
    timeAlive = 0;
    area: SpriteArea;
    static readonly spritesheet = 'assets/explosion.png';

    static calculateSpriteSheetPosition(type: ExplosionType): SpriteArea {
        let clipX, clipY, clipHeight, clipWidth
        switch (type) {
            case ExplosionType.LEFT:
                clipX = 0;
                clipY = 43;
                clipHeight = 16;
                clipWidth = 18;
                break;
            case ExplosionType.HORIZONTAL:
                clipX = 16;
                clipY = 42;
                clipHeight = 16;
                clipWidth = 14;
                break;
            case ExplosionType.RIGHT:
                clipX = 46;
                clipY = 42;
                clipHeight = 16;
                clipWidth = 14;
                break;
            case ExplosionType.DOWN:
                clipX = 0;
                clipY = 0;
                clipHeight = 12;
                clipWidth = 12;
                break;
            case ExplosionType.UP:
                clipX = 0;
                clipY = 30;
                clipHeight = 14;
                clipWidth = 12;
                break;
            case ExplosionType.VERTICAL:
                clipX = 0;
                clipY = 14;
                clipHeight = 12;
                clipWidth = 12;
                break;
            case ExplosionType.CENTER:
            default:
                clipX = 30;
                clipY = 42;
                clipHeight = 16;
                clipWidth = 18;
                break;
        }
        return {clipX, clipY, clipHeight, clipWidth}

    }

    constructor(i: number, j: number, type: ExplosionType) {
        this.x = i * Settings.BLOCK_WIDTH;
        this.y = j * Settings.BLOCK_HEIGHT;
        this.area = Explosion.calculateSpriteSheetPosition(type)        
    }
    
    draw() {
        World.ctx.drawImage(AssetManager.explosionSprite, this.area.clipX, this.area.clipY, this.area.clipWidth, this.area.clipHeight, this.x, this.y, Settings.BLOCK_WIDTH, Settings.BLOCK_HEIGHT);
    }

    update(delta: number) {
        this.timeAlive += delta;
        if (this.timeAlive >= Explosion.explosionTime) {
            _.remove(World.explosions, this);
        }
    }
}