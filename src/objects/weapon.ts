import * as _ from "lodash";
import { Player, Direction } from "./player";
import { BaseObject } from "./baseObject";

export const ShortRangeWeapons = ["sword", "mage-staff"];
export const ProjectileWeapons = ["black-magic"];
export const WeaponTypes = [...ShortRangeWeapons, ...ProjectileWeapons];

export class Weapon extends BaseObject {
  public player: Player;
  public damageAmount: number;
  public canRespawn: boolean = false;
  protected timeAlive: number;
  protected respawnDelay: number;
  protected destroyTimeout;

  constructor({ scene, player, key, id, type, damageAmount, respawnDelay, timeAlive }) {
    super({
      scene,
      id,
      x: player.x,
      y: player.y,
      key,
      parentId: player.id,
      type
    });

    this.player = player;
    this.damageAmount = damageAmount;
    this.timeAlive = timeAlive;
    this.respawnDelay = respawnDelay;
    this.scene.webSocketManager.addSprite(this);
    this.flipWeapon();

    this.scene.physics.add.collider(
      this,
      _.map(this.scene.otherPlayers),
      this.onCollide.bind(this)
    );

    this.destroyTimeout = setTimeout(() => {
      this.makeDead();
      this.scene.webSocketManager.addSprite(this);
      this.destroy();
    }, this.timeAlive);
  }

  onCollide(weapon: Weapon, player: Player) {
    if (player.id === this.parentId) return;

    weapon.makeDead();
    player.health = player.health - weapon.damageAmount;

    this.scene.webSocketManager.addSprite(weapon);
    this.scene.webSocketManager.addSprite(player);

    weapon.destroy();
    if (player.health <= 0) player.destroy();
    clearTimeout(this.destroyTimeout);
  }

  positionShortRangeWeapon(): void {
    if (!_.includes(ShortRangeWeapons, this.type)) return;

    const playerAnimKey = this.player.anims.getCurrentKey();
    const playerType = this.player.type;

    if (playerAnimKey === `${playerType}-down`) {
      this.y = this.player.y + 16;
      this.setDepth(6); // Sword needs to be on top of fighter.
    } else if (playerAnimKey === `${playerType}-up`) {
      this.y = this.player.y - 16;
    } else if (playerAnimKey === `${playerType}-left`) {
      this.x = this.player.x - 16;
    } else if (playerAnimKey === `${playerType}-right`) {
      this.x = this.player.x + 16;
    }
  }

  makeDead() {
    super.makeDead();
    setTimeout(() => (this.canRespawn = true), this.respawnDelay);
  }

  flipWeapon(): void {
    const direction = this.player.getDirection();

    if (direction === Direction.down) this.setAngle(180);
    if (direction === Direction.left) this.setAngle(270);
    if (direction === Direction.right) this.setAngle(90);
  }
}
