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

var game = new Phaser.Game(config);


// LOAD CONTENT //
function preload ()
{
    this.load.image('sky', 'assets/background.png');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('poles', 'assets/poles.png');
    this.load.image('sling', 'assets/slingshot.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('bird', 'assets/Bird.png');
    this.load.image('box', 'assets/box.png');
}


// VARIABLES //
var currentlevel = 0;
var shots = 0;

var weapon;
var cursors;
var speed;
var bullet;

var enemies;
var blocks;
var portals;
var hit = false;
var direction = 1;


// CREATE //
function create ()
{
    

    // BACKGROUND //
    this.add.image(320,240, 'sky');
    this.add.image(320,240, 'poles');
    this.add.image(320,240, 'ground');

    // PLAYER //
    weapon = this.physics.add.image(320, 450, 'sling');
    weapon.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    speed = Phaser.Math.GetSpeed(300, 1);

    // BULLET //
    bullet = this.physics.add.image(weapon.x, weapon.y -28, 'rock');
    bullet.setVisible(true);
    bullet.setActive(false);

    // ENEMIES //
    enemies = this.physics.add.group();

    // OBSTACLE
    blocks = this.physics.add.staticGroup();

    // PORTALS //
    portals = this.physics.add.staticGroup();

    // PHYSICS
    this.physics.add.collider(bullet, enemies, hitEnemy);
    this.physics.add.collider(bullet, blocks, hitBox);
    this.physics.add.collider(bullet, portals, hitPortal);
    this.physics.add.collider(bullet, weapon, catchRock);
    

    // START GAME //
    loadLevel(currentlevel);
}


// UPDATE //
function update (time, delta)
{
    // PLAYER MOVEMENT
    if (cursors.left.isDown)
    {
        weapon.x -= speed * delta;
        if(bullet.visible && bullet.active == false) {
            bullet.x -= speed * delta;
        }
    }
    else if (cursors.right.isDown)
    {
        weapon.x += speed * delta;
        if(bullet.visible && bullet.active == false) {
            bullet.x += speed * delta;
        }
    }

    // FIRE BULLET
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && bullet.active == false)
    {
        hit = false
        shots += 1;
        bullet.enableBody(true, weapon.x, weapon.y-28, true, true);
        bullet.setVelocityY(-400);
    }

    // Check if bullet is out of bounds
    checkBulletOutOfBounds();
}

function loadLevel(level)
{
    if (level == 0) {
        enemies.create(320, 150, 'bird');
        enemies.create(400, 150, 'bird');
        enemies.create(100, 350, 'bird');
        blocks.create(100, 150, 'box');
        portals.create(320, 70);

    }
}

function reset(level)
{   
    enemies.clear(true,true);
    blocks.clear(true, true);
    loadLevel(level);
    bullet.setVisible(true);
    bullet.setX(weapon.x);
    bullet.setY(weapon.y -28);
    direction = 1;
    hit = false;
}

function checkBulletOutOfBounds()
{
    if(bullet.y < -50 || bullet.y > game.config.height + 50) {
        bullet.disableBody(true, true);
        reset(currentlevel)
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

function hitBox(bullet, box)
{
    bullet.setVelocityY(400);
    hit = true;
    direction = -1;
}

function hitPortal(bullet, portal)
{
    bullet.setX(100);
    bullet.setY(150);
    bullet.setVelocityY(400);
    hit = true;
    direction = -1;
}

function catchRock(bullet, weapon)
{
    if(hit) {
        bullet.setActive(false);
        bullet.setX(weapon.x);
        bullet.setY(weapon.y -28);
        direction = 1;
    }
}