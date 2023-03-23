// IMPORTS
import Bird from './Bird.js';


// GAME CONFIG //
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var tKey;
var scene = scene;
var game = new Phaser.Game(config);

// VARIABLES //

var weapon;
var cursors;
var speed;

var bullet;

var birds;


function preload ()
{
    this.load.image('sky', 'assets/background.png');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('poles', 'assets/poles.png');
    this.load.image('sling', 'assets/slingshot.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('bird', 'assets/Bird.png');
    this.load.image('cable', 'assets/cable.png');
}

function create ()
{
    // BACKGROUND //
    this.add.image(320,240, 'sky');
    this.add.image(320,240, 'poles');
    this.add.image(320,240, 'ground');
    this.add.image(320,100, 'cable').setScale(2);
    this.add.image(320,200, 'cable').setScale(2);
    this.add.image(320,300, 'cable').setScale(2);

    // PLAYER //
    weapon = this.physics.add.image(320, 450, 'sling');
    weapon.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    speed = Phaser.Math.GetSpeed(300, 1);

    // BULLET //
    bullet = this.physics.add.image(weapon.x, weapon.y -28, 'rock');
    bullet.setVisible(true);
    bullet.setActive(false);

    // BIRDS

    birds = this.physics.add.group();

    birds.add(new Bird(this, 320, 300 - 24, 'bird', true, 1, 230, 100));

    //birds.add(new Bird(this, 320, 100-24, 'bird', true, 1, 230, 100));
    //birds.add(new Bird(this, 320, 200-24, 'bird', true, -1, 230, 100));
    
    tKey = this.input.keyboard.addKey('T');


}

function update (time, delta) 
{
    
    // PLAYER MOVEMENT
    if (cursors.left.isDown)
    {
        weapon.x -= speed * delta;
        if(bullet.visible && bullet.active == false) {
            bullet.x = weapon.x;
        }
    }
    else if (cursors.right.isDown)
    {
        weapon.x += speed * delta;
        if(bullet.visible && bullet.active == false) {
            bullet.x = weapon.x;
        }
    }

    // FIRE BULLET
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && bullet.active == false)
    {
        bullet.enableBody(true, weapon.x, weapon.y-28, true, true);
        bullet.setVelocityY(-400);
    }

    // BIRDS
    
    birds.getChildren().forEach(function(bird) {
        bird.update(time, delta);
    });

    if (tKey.isDown) {
        loadLevel();
    }

}


function loadLevel()
{
    birds.clear(true, true);

    birds.add(new Bird(this, 320, 100 - 24, 'bird', true, 1, 230, 100));
    birds.add(new Bird(this, 320, 200 - 24, 'bird', true, -1, 230, 100));
}

function reset()
{   
    birds.clear(true,true);
    loadLevel();
    bullet.setVisible(true);
    bullet.setX(weapon.x);
    bullet.setY(weapon.y -28);
}

function killBullet()
{
    bullet.disableBody(true, true);
    reset();
}

function checkBulletOutOfBounds()
{
    if(bullet.y < -50 || bullet.y > game.config.height + 50) {
        killBullet();
    }
}



function hitEnemy(bullet, enemy) 
{
    enemy.disableBody(true, true);
    if(direction == 1) {
        bullet.setVelocityY(-400);
    }else {
        bullet.setVelocityY(400);
    }   
}

