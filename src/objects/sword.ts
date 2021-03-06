import * as _ from "lodash";
import { Weapon } from "./weapon";
import { Player } from "./player";

export class Sword extends Weapon {
  public player: Player;

  constructor({ scene, player, id }) {
    super({
      scene,
      id,
      player,
      key: "sword",
      type: "sword",
      damageAmount: 100,
      respawnDelay: 250,
      timeAlive: 200
    });

    this.scene.tweens.add({
      targets: this,
      duration: this.timeAlive,
      angle: this.angle + 90
    });

    this.positionShortRangeWeapon();
  }
}
