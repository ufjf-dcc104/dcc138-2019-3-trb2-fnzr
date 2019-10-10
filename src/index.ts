import World from "@World";
import AssetManager from "@AssetManager";

(window as any).World = World;
(window as any).AssetManager = AssetManager;

document.addEventListener("DOMContentLoaded", function () {
    World.start();
});