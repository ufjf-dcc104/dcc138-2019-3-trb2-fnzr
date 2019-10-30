import Settings from "@Settings";

export interface Sprites {
    [animation: string]: HTMLImageElement[]
}

function resizeToFit(image: HTMLImageElement) {    
    var ratio = Math.min(Settings.BLOCK_WIDTH / image.width, Settings.BLOCK_HEIGHT / image.height);
    image.height = image.height * ratio;
    image.width = image.width * ratio;
 }

export default class AssetManager {

    static unitSprites: {
        [name: string]: Sprites 
    } = {}    
    static explosionSprite: HTMLImageElement;
    static bombSprite: HTMLImageElement;
    static sceneSpritesheet: HTMLImageElement;

    static unitSprite(name: string, key: string, index: number) {
        return this.unitSprites[name][key][index];
    }

    private constructor() {

    }

    private static async loadUnitAsset(name: string, animation: string, assetPath: string): Promise<void> {
        const img = document.createElement('img');
        img.src = assetPath;
        return new Promise((resolve) => {
            img.addEventListener("load", () => {
                resizeToFit(img);
                if (!(animation in this.unitSprites[name])) {
                    this.unitSprites[name][animation] = []
                }
                this.unitSprites[name][animation].push(img);
                resolve();
            })
        })
    }

    static async loadExplosion() {
        const img = document.createElement('img');
        img.src = 'assets/explosion.png';
        return new Promise((resolve) => {
            img.addEventListener("load", () => {
                this.explosionSprite = img;
                resolve();
            })
        })
    }

    static async loadScene() {
        const img = document.createElement('img');
        img.src = 'assets/trees-and-bushes.png';        
        return new Promise((resolve) => {
            img.addEventListener("load", () => {
                this.sceneSpritesheet = img;
                resolve();
            })
        })
    }

    static async loadBomb() {
        const img = document.createElement('img');
        img.src = 'assets/bomb.png';
        return new Promise((resolve) => {
            img.addEventListener("load", () => {
                this.bombSprite = img;
                resolve();
            })
        })
    }

    static async loadUnit(name: string) {
        const promises: Promise<void>[] = []
        this.unitSprites[name] = {}
        for(let i=1; i<=4; i++) {
            promises.push(this.loadUnitAsset(name, "run", `assets/${name}/RUN${i}.png`));
            promises.push(this.loadUnitAsset(name, "idle", `assets/${name}/IDLE${i}.png`));
            promises.push(this.loadUnitAsset(name, "die", `assets/${name}/DIE${i}.png`));
        }
        return Promise.all(promises);
    }

}