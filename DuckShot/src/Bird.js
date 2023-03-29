export default class Bird extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, canMove = true, direction = 1, distance = 0, speed = 0, rOn) {
        super(scene, x, y, texture);
  
        scene.add.existing(this);
  
        scene.physics.world.enable(this);
        
        if(canMove) {
            // Animação
            scene.anims.create({
                key: 'animationBL',
                frames: scene.anims.generateFrameNumbers('birdM', { start: 0, end: 0 }),
                frameRate: 0,
                repeat: -1
            });
            scene.anims.create({
                key: 'animationBR',
                frames: scene.anims.generateFrameNumbers('birdM', { start: 1, end: 1 }),
                frameRate: 0,
                repeat: -1
            });
            scene.anims.create({
                key: 'animationBLR',
                frames: scene.anims.generateFrameNumbers('birdMR', { start: 0, end: 0 }),
                frameRate: 0,
                repeat: -1
            });
            scene.anims.create({
                key: 'animationBRR',
                frames: scene.anims.generateFrameNumbers('birdMR', { start: 1, end: 1 }),
                frameRate: 0,
                repeat: -1
            });
        }

        // Definir as variáveis
        
        this.rOn = rOn;
        this.scene = scene;
        this.canMove = canMove;
        this.direction = direction;
        this.initalDirection = direction;
        this.distance = distance;
        this.speed = Phaser.Math.GetSpeed(speed, 1);
        this.startX = x;
    }

    update(time, delta) {

        if(this.canMove) {
            // Animation
            if(this.direction ==1) {
                if(this.rOn){
                    this.play('animationBRR');
                } else{
                    this.play('animationBR');
                }
            }else {
                if(this.rOn){
                    this.play('animationBLR');
                } else{
                    this.play('animationBL');
                }
            }

            //Movement
            this.x += this.speed * this.direction * delta;

            //Management Direction
            if(this.initalDirection == 1) {
                if(this.direction == 1 && this.x >= this.startX + this.distance) {
                    this.direction = -1;
                } else if (this.x <= this.startX){
                    this.direction = 1;
                }
            }
    
            if(this.initalDirection == -1) {
                if(this.direction == -1 && this.x <= this.startX - this.distance) {
                    this.direction = 1;
                } else if (this.x >= this.startX){
                    this.direction = -1;
                }
            }
        }
    }

    kill() {
        this.destroy();
    }
}