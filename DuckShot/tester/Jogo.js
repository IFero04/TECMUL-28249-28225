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
    this.load.image('portalTeste', 'assets/portal_sprite');
    this.load.image('portal-entry', 'assets/portal.png');
    this.load.image('portal-exit', 'assets/portal.png');
}


// VARIABLES //
var currentlevel = 99;
var textLevel;
var shots = 0;
var textShots;

var weapon;
var cursors;
var speed;
var bullet;

var enemies;
var blocks;
var portals;
var sparks;
var hit = false;
var direction = 1;


// CREATE //
function create ()
{
    // Teste //
    var combo = this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 'B', 'A', 'B', 'A' ], { resetOnMatch: true });
    this.input.keyboard.on('keycombomatch', function (event) {
        
        console.log('Konami Code entered!');
    });

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
    portals = this.physics.add.group();

    // DEADLY // 
    sparks = this.physics.add.group();

    // PHYSICS
    this.physics.add.collider(bullet, enemies, hitEnemy);
    this.physics.add.collider(bullet, blocks, hitBox);
    this.physics.add.collider(bullet, portals, hitPortal);
    this.physics.add.collider(bullet, weapon, catchRock);
    this.physics.add.collider(bullet, sparks, killBullet);
    
    // UI
    textLevel = this.add.text(25, 445, 'Level: 1', { fontSize: '24px', fill: '#FF0000' });
    textShots = this.add.text(510, 445, 'Shots: 0', { fontSize: '24px', fill: '#FF0000' });

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
        hit = false
        shots += 1;
        textShots.setText('Shots: ' + shots);
        bullet.enableBody(true, weapon.x, weapon.y-28, true, true);
        bullet.setVelocityY(-400);
    }

    // Check if bullet is out of bounds
    checkBulletOutOfBounds();

    // Check Victory
    checkVictory();

    // Animation

   
}

function loadLevel(level)
{
    textLevel.setText('Level: ' + level);
    if (level == 1) {
        enemies.create(320, 100, 'bird');
        enemies.create(320, 200, 'bird');
    }

    if (level == 2) {
        enemies.create(220, 150, 'bird');
        
    }

    if (level == 3) {
        enemies.create(220, 150, 'bird');
    }

    if (level == 4) {
        enemies.create(220, 100, 'bird');
        blocks.create(420,100,'box');
        enemies.create(420, 200, 'bird');
        
    }

    if (level == 5) {
        blocks.create(140, 100, 'box');
        enemies.create(140, 200, 'bird');
        enemies.create(140, 300, 'bird');

        enemies.create(320, 200, 'bird');
        enemies.create(320, 300, 'bird');
        
        blocks.create(500,100,'box');
        enemies.create(500, 200, 'bird');
        enemies.create(500, 300, 'bird');
    }

    // Teste Level
    if (level >= 99) {
        blocks.create(140, 100, 'box');
        enemies.create(140, 200, 'bird');
        
        enemies.create(140, 300, 'bird');
       
        enemies.create(320, 100, 'bird');
        portals.create(320,200, 'portal-exit')
        portals.create(320,300, 'portal-entry')

        sparks.create(500,100);
        enemies.create(500, 200, 'bird');
        enemies.create(500, 300, 'bird');

    }

    
}

function reset(level)
{   
    enemies.clear(true,true);
    blocks.clear(true, true);
    portals.clear(true, true);
    sparks.clear(true,true);
    loadLevel(level);
    bullet.setVisible(true);
    bullet.setX(weapon.x);
    bullet.setY(weapon.y -28);
    direction = 1;
    hit = false;
}

function killBullet()
{
    bullet.disableBody(true, true);
    reset(currentlevel);
}

function checkBulletOutOfBounds()
{
    if(bullet.y < -50 || bullet.y > game.config.height + 50) {
        killBullet();
    }
}

function checkVictory()
{
    if(enemies.countActive(true) == 0) {
        currentlevel += 1;
        bullet.disableBody(true, true);
        reset(currentlevel);
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

function hitBox(bullet)
{
    bullet.setVelocityY(400);
    hit = true;
    direction = -1;
}

function hitPortal(bullet, portal)
{

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

