import FixedObject from "./FixedObject";
import Settings from "@Settings";

export default class Wall extends FixedObject {

    height = Settings.BLOCK_HEIGHT;
    width = Settings.BLOCK_WIDTH;
    color = "black";
}