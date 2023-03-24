export default class Portal extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, direction, teleportX, teleportY){
        super(scene, x, y, texture);

        scene.add.existing(this);
  
        scene.physics.world.enable(this);

        // Variáveis
        this.direction = direction;
        this.teleportX = teleportX;
        this.teleportY = teleportY;
    }
}