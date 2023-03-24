export default class Box extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, bounce){
        super(scene, x, y, texture);

        scene.add.existing(this);
  
        scene.physics.world.enable(this);

        // Variáveis
        this.bounce = bounce;
    }
}