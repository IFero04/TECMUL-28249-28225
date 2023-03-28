export default class Portal extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, direction, teleportX, teleportY){
        super(scene, x, y, texture);

        scene.add.existing(this);
  
        scene.physics.world.enable(this);

        // Animação
        scene.anims.create({
            key: 'animationP',
            frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
        });
        this.play('animationP');

        // Variáveis
        this.direction = direction;
        this.teleportX = teleportX;
        this.teleportY = teleportY;
    }
}