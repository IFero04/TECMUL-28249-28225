export default class MuteButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, texture2) {
      super(scene, x, y, texture);
  
      scene.add.existing(this);

      scene.physics.world.enable(this);

      this.setInteractive();

      this.muted = false;
  
      this.on('pointerup', function() {
        this.muted = !this.muted; 
        if (this.muted) {
          this.scene.sound.mute = true;
          this.setTexture(texture2);
        } else {
          this.scene.sound.mute = false;
          this.setTexture(texture);
        }
      });
    }
  }
  