import Wall from "@Object/Wall";
import Block from "@Object/Block";
import Bomb from "@Object/Bomb";
import { WorldObject } from "@Object/WorldObject";
import Scene, { StartScene, GameScene } from "@Scene";
import Unit from "@Object/Unit";
import Settings from "@Settings";
import { Explosion } from "@Object/Explosion";
class World {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    lastTime = 0;
    static readonly Instance: World = new World();
    units: Unit[] = []
    walls: Wall[] = []
    blocks: Block[] = []
    bombs: Bomb[] = []
    positions: {[k: string]: WorldObject[]} = {};
    objects: WorldObject[] = [];    
    explosions: Explosion[] = [];
    
    constructor() {
        this.canvas = document.getElementById('cv') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.update = this.update.bind(this);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(currentTime: number) {
        const delta = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.clearCanvas();
        //this.context.fillStyle = "green";
        //this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        Scene.update(delta);
        requestAnimationFrame(this.update);
    }

    clear() {
        this.units = []
        this.positions = {};
        this.objects= [];  
    }

    start() {
        //Scene.current = new StartScene();
        Scene.current = new GameScene();
        this.lastTime = performance.now();
        this.update(this.lastTime);
    }

    buildMap(map: number[][]) {
        for (let i = 0; i<map.length; i++) {
            for (let j = 0; j<map[i].length;j++) {                
                const x = Settings.BLOCK_WIDTH * (j);
                const y = Settings.BLOCK_HEIGHT * (i);                
                const key = `${j},${i}`;
                this.positions[key] = []
                let obj;
                switch (map[i][j]) {
                    case 1:
                        obj = new Block(x, y);
                        
                        break;
                    case 2:
                        obj = new Wall(x, y);
                        break;
                }
                if (obj) {
                    this.positions[key].push(obj);
                    obj.addToWorld();
                }
            }            
        }
    }
}

export default World.Instance;