export default class Bird extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, canMove = true, direction = 1, distance = 0, speed = 0) {
        super(scene, x, y, texture);
  
        scene.add.existing(this);
  
        scene.physics.world.enable(this);

        // Adicione a animação do pássaro aqui, se desejado
        // Exemplo:
        // this.anims.create({
        //   key: 'flap',
        //   frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
        //   frameRate: 10,
        //   repeat: -1
        // });

        // Definir as variáveis
        this.canMove = canMove;
        this.direction = direction;
        this.initalDirection = direction;
        this.distance = distance;
        this.speed = Phaser.Math.GetSpeed(speed, 1);
        this.startX = x;
    }

    update(time, delta) {

        if(this.canMove) {
            this.x += this.speed * this.direction * delta;

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
}