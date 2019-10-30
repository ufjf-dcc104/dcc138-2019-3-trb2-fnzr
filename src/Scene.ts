import World from "@World";
import Player from "@Object/Player";
import { Button, installControls, installedControls } from "@Controller";
import { Map1 } from "@Maps";
import AssetManager from "@AssetManager";
import Settings from "@Settings";

export default class Scene {

    static _current: Scene;

    static update(delta: number) {
        this._current.update(delta);
    }

    static set current(scene: Scene) {
        if (this._current !== undefined){
            this._current.leave();
        }
        scene.enter();
        this._current = scene;
    }

    static get current() {
        return this._current;
    }

    update(delta: number) {
        throw new Error("Base [Scene::update] should not be called");
    }

    leave() {
        throw new Error("Base [Scene::leave] should not be called");
    }

    async enter() {
        throw new Error("Base [Scene::enter] should not be called");
    }

}

export class StartScene extends Scene {

    onCanvasClick(e: Event) {
        Scene.current = new GameScene();
    }

    async enter() {
        World.canvas.addEventListener('click', this.onCanvasClick);
    }

    leave() {
        World.canvas.removeEventListener('click', this.onCanvasClick);
    }

    update(delta: number) {
      var x = World.canvas.width / 2;
      var y = World.canvas.height / 2;

      World.ctx.font = '30pt Calibri';
      World.ctx.textAlign = 'center';
      World.ctx.fillStyle = 'blue';
      World.ctx.fillText('Game Start!', x, y);
    }
}

export class GameScene extends Scene {

    state = "OFF";

    onKeyDown(event: KeyboardEvent) {
        if (event.keyCode in installedControls) {
            installedControls[event.keyCode](true)
        }
    }
    
    onKeyUp(event: KeyboardEvent) {
        if (event.keyCode in installedControls) {
            installedControls[event.keyCode](false)
        }
    }

    async enter() {
        this.state = "LOADING";
        World.clear();
        World.buildMap(Map1);
        World.ctx.font = '8pt TimesNewRoman';
        World.ctx.textAlign = 'left';

        const p1 = new Player("Player 1", 1, 1, "green");
        const p2 = new Player("Player 2", 9, 12, "blue");
        AssetManager.loadUnit("WizardFire").then(() => {
            p1.sprites = AssetManager.unitSprites["WizardFire"];
            p1.addToWorld()
        }),
        AssetManager.loadUnit("KnightSilver").then(() => {
            p2.sprites = AssetManager.unitSprites["KnightSilver"];
            p2.addToWorld()
        })
        
        await Promise.all([
            AssetManager.loadScene(),
            AssetManager.loadExplosion(),
            AssetManager.loadBomb()            
        ]);

        installControls({
            [Button.RIGHT]: "39",
            [Button.LEFT]: "37",
            [Button.UP]: "38",
            [Button.DOWN]: "40",
            [Button.MOD]: "16",
            [Button.ATTACK]: "97"
        }, p1);
        World.units.push(p1);

        installControls({
            [Button.RIGHT]: "68",
            [Button.LEFT]: "65",
            [Button.UP]: "87",
            [Button.DOWN]: "83",
            [Button.MOD]: "16",
            [Button.ATTACK]: "71"
        }, p2);
        World.units.push(p2);

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        this.state = "READY";
    }

    leave() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }

    update(delta: number) {
        if (this.state != "READY") return;
        if (World.units.length <= 1) {
            Scene.current = new GameEndScene()
        }
        World.objects.forEach(obj => {            
            obj.draw();
            obj.update(delta);
        })
        World.explosions.forEach(exp => {
            exp.draw();
            exp.update(delta);
        })
    }
}

export class GameEndScene extends Scene {

    onCanvasClick(e: Event) {
        Scene.current = new GameScene();
    }

    async enter() {
        World.canvas.addEventListener('click', this.onCanvasClick);
    }

    leave() {
        World.canvas.removeEventListener('click', this.onCanvasClick);
    }

    update(delta: number) {        
        var x = World.canvas.width / 2;
        var y = World.canvas.height / 2;
  
        World.ctx.font = '30pt Calibri';
        World.ctx.textAlign = 'center';        

        if (World.units.length === 0) {
            World.ctx.fillStyle = 'blue';
            World.ctx.fillText('Tie! :(', x, y);
        }
        else {
            World.ctx.fillStyle = 'red';
            World.ctx.fillText(`${World.units[0].name} wins!`, x, y);
        }
    }
}