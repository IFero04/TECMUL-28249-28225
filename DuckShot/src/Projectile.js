export default class Projectile extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, speed) {
        super(scene, x, y, texture);

        scene.add.existing(this);
  
        scene.physics.world.enable(this);

        // Variáveis
        this.speed = speed
        this.setActive(false)
        this.direction = 1;
        this.startX = x;
        this.startY = y;
        this.shoots = 0;
    }

    fire() {
        this.shoots += 1;
        this.setActive(true);
    }

    update(time, delta) {
        if(this.active == true) {
            this.y -= Phaser.Math.GetSpeed(this.speed, 1) * this.direction * delta;
        }
    }

    catch(x,y) {
        this.direction = 1;
        this.setActive(false);
        this.x = x;
        this.y = y;
    }

    reset() {
        this.direction = 1;
        this.setActive(false);
        this.setVisible(true);
        this.x = this.startX;
        this.y = this.startY;
    }

    kill() {
        this.setActive(false);
        this.setVisible(false);
        this.x = 0;
        this.y = 0;
    }
}