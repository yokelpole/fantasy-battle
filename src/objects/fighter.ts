import { Player } from "./player";
import { Sword } from "./sword";

export class Fighter extends Player {
  public type: string = "fighter";
  public weapon: Sword;

  constructor(params) {
    super({ ...params, type: "fighter" });
  }

  addWeapon(id: string = undefined): void {
    if (!this.canAddWeapon()) return;

    super.addWeapon(id);
    
    this.weapon = new Sword({
      id,
      scene: this.scene,
      player: this,
    });
  }
}
