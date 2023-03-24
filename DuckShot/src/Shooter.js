export default class Shooter extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);

        scene.add.existing(this);
  
        scene.physics.world.enable(this);

        // Variáveis
        this.hasBullet = true;
        this.startX = x;
        this.startY = y;
    }

    reset() {
        this.hasBullet = true;
        this.x = this.startX;
        this.y = this.startY;
    }
}