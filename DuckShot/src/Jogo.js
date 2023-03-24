// IMPORTS //
import Bird from './Bird.js';
import Shooter from './Shooter.js';
import Projectile from './Projectile.js';
import Box from'./Box.js';
import Spark from './Spark.js';
import Portal from './Portal.js';

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

// GAME SETUP //
var game = new Phaser.Game(config);
var scene;

// KEYS //
var aKey;
var dKey;
var tKey;
var cursors;

// VARIABLES GAME //
var shooter;
var projectile;
var enemies;
var blocks;
var deadly;
var portals;
var powerlines;
var speed;

var currentlevel = 99;
var textLevel;
var textShots;

function preload ()
{
    this.load.image('sky', 'assets/background.png');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('poles', 'assets/poles.png');
    this.load.image('sling', 'assets/slingshot.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('bird', 'assets/Bird.png');
    this.load.image('cable', 'assets/cable.png');
    this.load.image('box', 'assets/box.png');
    this.load.image('spark', 'assets/spark_front.png');
    this.load.image('portal', 'assets/portal.png');
}

function create ()
{
    // GUARDAR A CENA
    scene = this;
    // BACKGROUND //
    this.add.image(320,240, 'sky');
    this.add.image(320,240, 'poles');
    this.add.image(320,240, 'ground');
    powerlines = this.physics.add.staticGroup();

    // MOVEMENT //
    cursors = this.input.keyboard.createCursorKeys();
    aKey = this.input.keyboard.addKey('A');
    dKey = this.input.keyboard.addKey('D');
    speed = Phaser.Math.GetSpeed(120, 1);

    // PLAYER //
    shooter = new Shooter(this,320, 435, 'sling');
    shooter.body.setCollideWorldBounds(true);
    
    // BULLET //
    projectile = new Projectile(this,shooter.x,shooter.y - 28, 'rock', 300);

    // BIRDS //
    enemies = this.physics.add.group();

    // BOXS //
    blocks = this.physics.add.group();

    // SPARKS //
    deadly = this.physics.add.group();

    // Portals //
    portals = this.physics.add.group();

    // PHYSICS //
    this.physics.add.collider(projectile, enemies, hitEnemy);
    this.physics.add.collider(projectile, blocks, hitBlock);
    this.physics.add.collider(projectile, shooter, catchProjectile);
    this.physics.add.collider(projectile, deadly, hitDeath);
    this.physics.add.collider(projectile, portals, teleport);

    // UI //
    textLevel = this.add.text(25, 445, 'Level: 1', { fontSize: '24px', fill: '#FF0000' });
    textShots = this.add.text(510, 445, 'Shots: 0', { fontSize: '24px', fill: '#FF0000' });

    // START GAME //
    loadLevel(currentlevel);
    
    // Teste //
    tKey = this.input.keyboard.addKey('T');
}

function update (time, delta) 
{
    // UPDATE CLASSES //
    projectile.update(time, delta);
    enemies.getChildren().forEach(function(enemy) {
        enemy.update(time, delta);
    });
    deadly.getChildren().forEach(function(dead) {
        dead.update(time, delta);
    });

    // CHECK CONDITIONS //
    checkBulletOutOfBounds();
    checkVictory()
    
    // PLAYER MOVEMENT //
    if (cursors.left.isDown || aKey.isDown)
    {
        shooter.x -= speed * delta;
        if(shooter.hasBullet == true) {
            projectile.x = shooter.x;
        }
    }
    else if (cursors.right.isDown || dKey.isDown)
    {
        shooter.x += speed * delta;
        if(shooter.hasBullet == true) {
            projectile.x = shooter.x;
        }
    }

    // FIRE BULLET //
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && shooter.hasBullet == true)
    {
        projectile.fire();
        shooter.hasBullet = false;
        textShots.setText('Shots: ' + projectile.shoots);
    }
    
    // KEYS //
    if (tKey.isDown) {
        currentlevel += 1;
        reset(currentlevel);
    }

}

function loadLevel(level)
{
    textLevel.setText('Level: ' + level);
    if (level == 1) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 320, 100 - 24, 'bird', false));
        powerlines.create(320, 200, 'cable').setScale(2);
        enemies.add(new Bird(scene, 320, 200 - 24, 'bird', false));
    }

    if (level == 2) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 120, 100 - 24, 'bird', true, 1, 400, 70));
        powerlines.create(320, 200, 'cable').setScale(2);
        enemies.add(new Bird(scene, 470, 200 - 24, 'bird', false));
    }

    if (level == 3) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 220, 100 - 24, 'bird', true, 1, 200, 70));
        powerlines.create(320, 250, 'cable').setScale(2);
        enemies.add(new Bird(scene, 420, 250 - 24, 'bird', true, -1, 200, 70));
    }

    if (level == 4) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 220, 100 - 24, 'bird', false));
        blocks.add(new Box(scene,420, 100, 'box', -1));
        powerlines.create(320, 250, 'cable').setScale(2);
        enemies.add(new Bird(scene, 420, 250 - 24, 'bird', false));  
    }

    if (level == 5) {
        powerlines.create(320, 100, 'cable').setScale(2);
        powerlines.create(320, 200, 'cable').setScale(2);
        powerlines.create(320, 300, 'cable').setScale(2);

        blocks.add(new Box(scene,120, 100, 'box', -1));
        enemies.add(new Bird(scene, 70, 200 - 24, 'bird', true, 1, 100, 70)); 
        enemies.add(new Bird(scene, 170, 300 - 24, 'bird', true, -1, 100, 70)); 

        enemies.add(new Bird(scene, 270, 200 - 24, 'bird', true, 1, 100, 70)); 
        enemies.add(new Bird(scene, 370, 300 - 24, 'bird', true, -1, 100, 70)); 

        blocks.add(new Box(scene,520, 100, 'box', -1));
        enemies.add(new Bird(scene, 470, 200 - 24, 'bird', true, 1, 100, 70)); 
        enemies.add(new Bird(scene, 570, 300 - 24, 'bird', true, -1, 100, 70)); 
    }

    if (level == 6) {
        powerlines.create(320, 150, 'cable').setScale(2);
        powerlines.create(320, 250, 'cable').setScale(2);

        enemies.add(new Bird(scene, 320, 150 - 24, 'bird', false));
        deadly.add(new Spark(scene, 270, 250, 'spark', true, 1, 114, 50))
    }

    if (level == 7) {
        powerlines.create(320, 150, 'cable').setScale(2);
        powerlines.create(320, 250, 'cable').setScale(2);

        enemies.add(new Bird(scene, 270, 150 - 24, 'bird', true, 1, 114, 50));
        deadly.add(new Spark(scene, 242, 250, 'spark', true, 1, 114, 50))
        deadly.add(new Spark(scene, 320, 250, 'spark', true, 1, 114, 50))
    }

    if (level == 8) {
        powerlines.create(320, 100, 'cable').setScale(2);
        powerlines.create(320, 275, 'cable').setScale(2);
        powerlines.create(320, 300, 'cable').setScale(2);

        blocks.add(new Box(scene,320, 100, 'box', -1));
        enemies.add(new Bird(scene, 70, 275 - 24, 'bird', true, 1, 477, 90));
        deadly.add(new Spark(scene, 49, 300, 'spark', true, 1, 477, 90))
        deadly.add(new Spark(scene, 77, 300, 'spark', true, 1, 477, 90))
        deadly.add(new Spark(scene, 21, 300, 'spark', true, 1, 477, 90))
        deadly.add(new Spark(scene, 105, 300, 'spark', true, 1, 477, 90)) 
    }

    // Teste Level
    if (level >= 99) {
        textLevel.setText('Teste Level: ' + level);
        enemies.add(new Bird(scene, 320, 100 - 24, 'bird', false, 1, 230, 100));
        enemies.add(new Bird(scene, 320, 200 - 24, 'bird', true, -1, 230, 100));
        blocks.add(new Box(scene, 220, 300,'box', -1));
        portals.add(new Portal(scene,120, 100, 'portal',1,320,300-30));
        portals.add(new Portal(scene,320, 300,'portal',-1,120,100+30));
    }
}

function reset(level) 
{
    powerlines.clear(true,true);
    enemies.clear(true, true);
    blocks.clear(true, true);
    deadly.clear(true, true);
    loadLevel(level);
    shooter.reset();
    projectile.reset();
}

function checkBulletOutOfBounds()
{
    if(projectile.y < -50 || projectile.y > game.config.height + 50) {
        reset(currentlevel);
    }
}

function checkVictory()
{
    if(enemies.countActive(true) == 0) {
        currentlevel += 1;
        reset(currentlevel);
    }
}

function hitEnemy(projectile, enemy)
{
    enemy.kill();
}

function hitBlock(projectile, block)
{
    projectile.direction = block.bounce;
}

function catchProjectile(projectile, shooter)
{
    if(projectile.direction == -1) {
        projectile.catch(shooter.x, shooter.y -28);
        shooter.hasBullet = true;
    }
}

function hitDeath()
{
    reset(currentlevel);
}

function teleport(projectile, portal)
{
    projectile.x = portal.teleportX;
    projectile.y = portal.teleportY;
    projectile.direction = portal.direction;
}