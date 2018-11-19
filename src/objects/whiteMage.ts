import { Player } from "./player";
import { MageStaff } from "./mageStaff";

export class WhiteMage extends Player {
  public type: string = "white-mage";

  constructor(params) {
    super({ ...params, type: "white-mage"});
  }

  addWeapon(id: string = undefined): void {
    if (!this.canAddWeapon()) return;
    
    super.addWeapon(id);

    this.weapon = new MageStaff({
      id,
      scene: this.scene,
      player: this,
    });
  }
}