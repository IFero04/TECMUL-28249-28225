function preload() 
{
    this.load.image('bird', 'assets/Bird.png');
}

function create()
{
    var Bird = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,
    
        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bird');
        },

    });
}
