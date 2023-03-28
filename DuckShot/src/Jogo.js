// IMPORTS //
import Bird from './Bird.js';
import Shooter from './Shooter.js';
import Projectile from './Projectile.js';
import Box from'./Box.js';
import Spark from './Spark.js';
import Portal from './Portal.js';
import MuteButton from './Mute.js';

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
var wKey;
var aKey;
var sKey;
var dKey;
var cursors;
var cheatOn = false;
var tKey;
var rKey;


// VARIABLES GAME //
var shooter;
var projectile;
var enemies;
var enemeyTexture;
var enemeyAnimation;
var blocks;
var deadly;
var portals;
var powerlines;
var speed;

var currentlevel = 99;
var timeWin = true;
var timeLose = true;
var textLevel;
var textShots;

// VARIABLES AUDIO //
var mute;
var music;
var shooterSound;
var blockSound;
var portalSound;
var catchSound;
var killSound;
var levelupSound;
var failSound;



function preload ()
{   
    this.load.image('sky', 'assets/image/background.png');
    this.load.image('ground', 'assets/image/grass.png');
    this.load.image('poles', 'assets/image/poles.png');
    this.load.image('level', 'assets/image/levelBorder.png');
    this.load.image('shots', 'assets/image/shotsBorder.png');
    this.load.image('sling', 'assets/image/slingshot.png');
    this.load.image('weapon', 'assets/image/weapon.png');
    this.load.image('rock', 'assets/image/rock.png');
    this.load.image('bullet', 'assets/image/bullet.png');
    this.load.image('bird', 'assets/image/bird.png');
    this.load.spritesheet('birdM', 'assets/image/birdSprite.png', {frameWidth:46, frameHeight:58, endFrame: 1});
    this.load.image('birdR', 'assets/image/BirdR.png');
    this.load.spritesheet('birdMR', 'assets/image/birdSpriteR.png', {frameWidth:46, frameHeight:58, endFrame: 1});
    this.load.image('cable', 'assets/image/cable.png');
    this.load.image('box', 'assets/image/box.png');
    this.load.spritesheet('spark', 'assets/image/sparkSprite.png', {frameWidth:32, frameHeight:32, endFrame: 5});
    this.load.spritesheet('portal', 'assets/image/portalSprite.png', {frameWidth:64, frameHeight:42, endFrame: 3});
    this.load.image('mute', 'assets/image/mute.png');
    this.load.image('unmute', 'assets/image/unmute.png');

    this.load.audio('music', ['assets/audio/musicR.mp3' , 'assets/audio/musicR.ogg']);
    this.load.audio('musicR', ['assets/audio/musicR.mp3' , 'assets/audio/musicR.ogg']);
    this.load.audio('som-sling', ['assets/audio/slingshot.mp3' , 'assets/audio/slingshot.ogg']);
    this.load.audio('som-box', ['assets/audio/box.mp3' , 'assets/audio/box.ogg']);
    this.load.audio('som-portal', ['assets/audio/portal.mp3' , 'assets/audio/portal.ogg']);
    this.load.audio('som-catch', ['assets/audio/catch2.mp3' , 'assets/audio/catch2.ogg']);
    this.load.audio('som-kill', ['assets/audio/kill.mp3' , 'assets/audio/kill.ogg']);
    this.load.audio('som-killR', ['assets/audio/killR.mp3' , 'assets/audio/killR.ogg']);
    this.load.audio('som-levelup', ['assets/audio/levelup.mp3' , 'assets/audio/levelup.ogg']);
    this.load.audio('som-fail', ['assets/audio/fail.mp3' , 'assets/audio/fail.ogg']);

}

function create ()
{
    // GUARDAR A CENA
    scene = this;

    // AUDIO //
    shooterSound = this.sound.add('som-sling');
    blockSound = this.sound.add('som-box');
    portalSound = this.sound.add('som-portal');
    catchSound = this.sound.add('som-catch');
    killSound = this.sound.add('som-kill');
    levelupSound = this.sound.add('som-levelup');
    failSound = this.sound.add('som-fail');
    music = this.sound.add('music', { loop: true });
    music.play();
    
    // BACKGROUND //
    this.add.image(320,240, 'sky');
    this.add.image(320,240, 'poles');
    this.add.image(320,240, 'ground');
    powerlines = this.physics.add.staticGroup();

    // MOVEMENT //
    cursors = this.input.keyboard.createCursorKeys();
    wKey = this.input.keyboard.addKey('W');
    aKey = this.input.keyboard.addKey('A');
    sKey = this.input.keyboard.addKey('S');
    dKey = this.input.keyboard.addKey('D');
    speed = Phaser.Math.GetSpeed(120, 1);

    // PLAYER //
    shooter = new Shooter(this,320, 435, 'sling');
    shooter.body.setCollideWorldBounds(true);
    
    // BULLET //
    projectile = new Projectile(this,shooter.x,shooter.y - 28, 'rock', 300);

    // BIRDS //
    enemies = this.physics.add.group();
    enemeyTexture = 'bird';
    enemeyAnimation = 'birdM';

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
    mute = new MuteButton(this, 75, 25, 'unmute', 'mute');
    this.add.image(75,457, 'shots');
    textShots = this.add.text(23, 445, 'SHOTS: 000', {fontFamily: 'serif', fontSize: '20px', fill: '#' });
    this.add.image(565,457, 'level');
    textLevel = this.add.text(510, 445, 'LEVEL: 1/10', {fontFamily: 'serif', fontSize: '20px', fill: '#' });

    // START GAME //
    loadLevel(currentlevel);
    
    // CHEATS //
    var combo = this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 'B', 'A', 'B', 'A' ], { resetOnMatch: true });
    this.input.keyboard.on('keycombomatch', function (event) {
        if(cheatOn == false) {
            cheatOn = true;
            scene.physics.world.colliders.destroy();
            scene.physics.add.collider(projectile, enemies, hitEnemy);
            shooter.setTexture('weapon');
            projectile.setTexture('bullet');
            projectile.startY = shooter.y - 73; 
            speed = Phaser.Math.GetSpeed(400, 1);
            reset(currentlevel);
        } else {
            cheatOn = false;
            scene.physics.add.collider(projectile, blocks, hitBlock);
            scene.physics.add.collider(projectile, shooter, catchProjectile);
            scene.physics.add.collider(projectile, deadly, hitDeath);
            scene.physics.add.collider(projectile, portals, teleport);
            shooter.setTexture('sling');
            projectile.setTexture('rock');
            projectile.startY = shooter.y - 28; 
            speed = Phaser.Math.GetSpeed(120, 1);
            reset(currentlevel);
        }
        console.log('Konami Code entered! (CHEATS - ' + cheatOn + ')');
    });
    tKey = this.input.keyboard.addKey('T');
    rKey = this.input.keyboard.addKey('R');
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
    if ((Phaser.Input.Keyboard.JustDown(cursors.space) || cursors.up.isDown || wKey.isDown) && shooter.canShoot == true && cheatOn == false)
    {
        projectile.fire();
        shooter.hasBullet = false;
        shooter.canShoot = false;
        textShots.setText('SHOTS: ' + projectile.shoots.toString().padStart(3, '0'));
        shooterSound.play();
    }
    
    // KEYS //
    if (cheatOn == true) {
        shooter.canShoot = false;
        timeLose = false;
        projectile.x = shooter.x + 23;
        if(cursors.down.isDown || sKey.isDown)
        {
            projectile.y += speed * delta;
        }
        else if (cursors.up.isDown || wKey.isDown)
        {
            projectile.y -= speed * delta;
        }
    }

    if (rKey.isDown) {
        setTimeout(() => {
            if (music.key != 'musicR') {
                music.stop();
                music = this.sound.add('musicR', { loop: true });
                music.play();
                killSound = this.sound.add('som-killR');
                enemeyTexture = 'birdR';
                enemeyAnimation = 'birdMR';
                enemies.getChildren().forEach(function(enemy) {
                    if(enemy.canMove) {
                        enemy.setTexture(enemeyAnimation);
                    } else {
                        enemy.setTexture(enemeyTexture);
                    }
                });
                
            } else {
                music.stop();
                music = this.sound.add('music', { loop: true });
                music.play();
                killSound = this.sound.add('som-kill');
                enemeyTexture = 'bird';
                enemeyAnimation = 'birdM';
                enemies.getChildren().forEach(function(enemy) {
                    if(enemy.canMove) {
                        enemy.setTexture(enemeyAnimation);
                    } else {
                        enemy.setTexture(enemeyTexture);
                    }
                });
            }
        }, 300);
    }

    if (tKey.isDown) {
        
    }

}

function loadLevel(level)
{
    textLevel.setText('LEVEL: ' + level + '/10');
    if (level == 1) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 320, 100 - 24, enemeyTexture, false));
        powerlines.create(320, 200, 'cable').setScale(2);
        enemies.add(new Bird(scene, 320, 200 - 24, enemeyTexture, false));
    }

    if (level == 2) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 120, 100 - 24, enemeyAnimation, true, 1, 400, 70));
        powerlines.create(320, 200, 'cable').setScale(2);
        enemies.add(new Bird(scene, 470, 200 - 24, enemeyTexture, false));
    }

    if (level == 3) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 220, 100 - 24, enemeyAnimation, true, 1, 200, 70));
        powerlines.create(320, 250, 'cable').setScale(2);
        enemies.add(new Bird(scene, 420, 250 - 24, enemeyAnimation, true, -1, 200, 70));
    }

    if (level == 4) {
        powerlines.create(320, 100, 'cable').setScale(2);
        enemies.add(new Bird(scene, 220, 100 - 24, enemeyTexture, false));
        blocks.add(new Box(scene,420, 100, 'box', -1));
        powerlines.create(320, 250, 'cable').setScale(2);
        enemies.add(new Bird(scene, 420, 250 - 24, enemeyTexture, false));  
    }

    if (level == 5) {
        powerlines.create(320, 100, 'cable').setScale(2);
        powerlines.create(320, 200, 'cable').setScale(2);
        powerlines.create(320, 300, 'cable').setScale(2);

        blocks.add(new Box(scene,120, 100, 'box', -1));
        enemies.add(new Bird(scene, 70, 200 - 24, enemeyAnimation, true, 1, 100, 70)); 
        enemies.add(new Bird(scene, 170, 300 - 24, enemeyAnimation, true, -1, 100, 70)); 

        enemies.add(new Bird(scene, 270, 200 - 24, enemeyAnimation, true, 1, 100, 70)); 
        enemies.add(new Bird(scene, 370, 300 - 24, enemeyAnimation, true, -1, 100, 70)); 

        blocks.add(new Box(scene,520, 100, 'box', -1));
        enemies.add(new Bird(scene, 470, 200 - 24, enemeyAnimation, true, 1, 100, 70)); 
        enemies.add(new Bird(scene, 570, 300 - 24, enemeyAnimation, true, -1, 100, 70)); 
    }

    if (level == 6) {
        powerlines.create(320, 150, 'cable').setScale(2);
        powerlines.create(320, 250, 'cable').setScale(2);

        enemies.add(new Bird(scene, 320, 150 - 24, enemeyTexture, false));
        deadly.add(new Spark(scene, 270, 250, 'spark', true, 1, 114, 50))
    }

    if (level == 7) {
        powerlines.create(320, 150, 'cable').setScale(2);
        powerlines.create(320, 250, 'cable').setScale(2);

        enemies.add(new Bird(scene, 270, 150 - 24, enemeyAnimation, true, 1, 114, 50));
        deadly.add(new Spark(scene, 242, 250, 'spark', true, 1, 114, 50))
        deadly.add(new Spark(scene, 320, 250, 'spark', true, 1, 114, 50))
    }

    if (level == 8) {
        powerlines.create(320, 100, 'cable').setScale(2);
        powerlines.create(320, 275, 'cable').setScale(2);
        powerlines.create(320, 300, 'cable').setScale(2);

        blocks.add(new Box(scene,320, 100, 'box', -1));
        enemies.add(new Bird(scene, 70, 275 - 24, enemeyAnimation, true, 1, 477, 90));
        deadly.add(new Spark(scene, 49, 300, 'spark', true, 1, 477, 90))
        deadly.add(new Spark(scene, 77, 300, 'spark', true, 1, 477, 90))
        deadly.add(new Spark(scene, 21, 300, 'spark', true, 1, 477, 90))
        deadly.add(new Spark(scene, 105, 300, 'spark', true, 1, 477, 90)) 
    }

    if (level == 9) {
        powerlines.create(320, 100, 'cable').setScale(2);
        powerlines.create(320, 200, 'cable').setScale(2);
        powerlines.create(320, 300, 'cable').setScale(2);

        deadly.add(new Spark(scene, 320, 300, 'spark', false))
        deadly.add(new Spark(scene, 320 - 28, 300, 'spark', false))
        deadly.add(new Spark(scene, 320 + 28, 300, 'spark', false))

        enemies.add(new Bird(scene, 320, 100 - 24, enemeyTexture, false));

        portals.add(new Portal(scene,120, 100, 'portal',1,320,200-30));
        portals.add(new Portal(scene,320, 200,'portal',-1,120,100+30));
    }

    if(level == 10) {
        textLevel.x = 505;
        powerlines.create(320, 100, 'cable').setScale(2);
        powerlines.create(320, 200, 'cable').setScale(2);
        powerlines.create(320, 300, 'cable').setScale(2);

        enemies.add(new Bird(scene, 120, 200 - 24, enemeyAnimation, true,1,120,70));
        portals.add(new Portal(scene,120, 100,'portal',1,320,300-30));

        blocks.add(new Box(scene,320, 100, 'box', -1));
        enemies.add(new Bird(scene, 320, 200 - 24, enemeyTexture, false));
        portals.add(new Portal(scene,320, 300,'portal',-1,520,100+30));

        enemies.add(new Bird(scene, 480, 300 - 24, enemeyAnimation, true, 1, 114, 50));
        deadly.add(new Spark(scene, 442, 200, 'spark', true, 1, 114, 50))
        deadly.add(new Spark(scene, 520, 200, 'spark', true, 1, 114, 50))
        portals.add(new Portal(scene,520, 100,'portal',1,320,300-30));
    }
    // Teste Level
    if (level >= 99) {
        textLevel.setText('Teste Level: ' + level);
        enemies.add(new Bird(scene, 320, 100 - 24, enemeyTexture, false, 1, 230, 100));
        enemies.add(new Bird(scene, 320, 200 - 24, enemeyAnimation, true, -1, 230, 100));
        deadly.add(new Spark(scene, 220, 300,'spark', false));
        blocks.add(new Box(scene, 520, 100,'box', -1));
        portals.add(new Portal(scene,120, 100, 'portal',1,320,300-30));
        portals.add(new Portal(scene,320, 300,'portal',-1,120,100+30));
    }
}

function reset(level) 
{
    timeWin = true;
    timeLose = true;
    powerlines.clear(true,true);
    enemies.clear(true, true);
    blocks.clear(true, true);
    deadly.clear(true, true);
    portals.clear(true, true);
    loadLevel(level);
    shooter.reset();
    projectile.reset();
}

function checkBulletOutOfBounds()
{
    if((projectile.y < -50 || projectile.y > game.config.height + 50) && timeLose == true && timeWin == true) {
        timeLose = false;
        failSound.play();
        setTimeout(() => {
            reset(currentlevel);
        }, 2000);
    }
}

function checkVictory()
{
    if(enemies.countActive(true) == 0 && timeWin == true) {
        timeWin = false;
        setTimeout(() => {
            levelupSound.play();
        }, 400),
        setTimeout(() => {
            currentlevel += 1;
            reset(currentlevel);
        }, 2000);
    }
}

function hitEnemy(projectile, enemy)
{
    enemy.kill();
    killSound.play();
}

function hitBlock(projectile, block)
{
    projectile.direction = block.bounce;
    blockSound.play();
}

function catchProjectile(projectile, shooter)
{
    if(projectile.direction == -1) {
        catchSound.play();
        projectile.catch(shooter.x, shooter.y -28);
        shooter.hasBullet = true;
        setTimeout(() => {
            shooter.canShoot = true;
        }, 700);
    }
}

function hitDeath()
{
    if(timeWin == true) {
        projectile.kill();
        failSound.play();
        setTimeout(() => {
             reset(currentlevel);
        }, 2000);
    }
}

function teleport(projectile, portal)
{
    projectile.x = portal.teleportX;
    projectile.y = portal.teleportY;
    projectile.direction = portal.direction;
    portalSound.play();
}