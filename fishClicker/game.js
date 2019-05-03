var config = {
        type: Phaser.AUTO,
        width: 1350,
        height: 655,
        physics: {
    	        default: 'arcade',
    	        arcade: {
    	            gravity: { y: 0 },
    	            debug: false
    	        }},
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    var game = new Phaser.Game(config);
    var pointer = game.input.activePointer;
    var group;
    var f1;
    var rod;
    //
    var caption;
    var fishCount = 0;

    var captionStyle = {
        fill: '#000000',
        fontFamily: 'monospace',
        lineSpacing: 4
    };

    var captionTextFormat = (
        'Fish:       %1\n' +
        'Gold:       %2\n' +
        'Fisherman:  %3\n' +
        'Villager:   %4\n' 
    );
    
    function preload ()
    {
    	this.load.image('waves', 'assets/bigo.png');
    	this.load.image('waves2', 'assets/bigoR.png');
        this.load.image('boat', 'assets/boat.png');
        this.load.image('deep', 'assets/deepOcean.png');
        this.load.image('ol', 'assets/overlap.png');
        
        this.load.spritesheet('fish1', 
            'assets/fish_full.png',
            { frameWidth: 45, frameHeight: 60 }
        );
        
        this.load.spritesheet('fishingrod', 
                'assets/rod_fishing.png',
                { frameWidth: 22, frameHeight: 32 }
            );
    }

    function create ()
    { 	
        this.add.image(400, 210, 'waves');
        this.add.image(1348, 212, 'waves2');
        this.add.image(200,310, 'boat');
        this.add.image(500, 520, 'deep');
        this.add.image(430, 340, 'ol');
        rod = this.physics.add.sprite(240, 240, 'fishingrod');
        
        this.anims.create({
            key: 'f1',
            frames: this.anims.generateFrameNumbers('fish1', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'rod',
            frames: this.anims.generateFrameNumbers('fishingrod', { frames: [ 0, 1, 2, 3, 3, 3, 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3] }),
            frameRate: 4,
            repeat: -1
        });
        
        group = this.add.group({
            defaultKey: 'fish1',
            maxSize: 100,
            hitArea: new Phaser.Geom.Rectangle(0, 0, 32, 24),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            
            createCallback: function (f1) {
                f1.setName('fish1' + this.getLength());
                console.log('Created', f1.name);
            },
            removeCallback: function (f1) {
                console.log('Removed', f1.name);
            }
        });
        
        group.inputEnableChildren = true;
        this.input.on('pointerdown', function (pointer, obj) {
        	fishCount = fishCount +1;       	
          });
        
        caption = this.add.text(16, 16, '', captionStyle);
        
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: addFish
        });
    }

    function update(){
    	Phaser.Actions.IncX(group.getChildren(), -1.4);
        group.children.iterate(function (f1) {
            if (f1.x < -10) {
                group.killAndHide(f1);
            }
        });
        
        caption.setText(Phaser.Utils.String.Format(captionTextFormat, [fishCount]));
        
        rod.anims.play('rod', true);
    }
    
    function activateFish (f1) {
        f1
        .setActive(true)
        .setVisible(true)
        .setTint(Phaser.Display.Color.RandomRGB().color)
        .play('f1');
    }

    function addFish () {
        var f1 = group.get(Phaser.Math.Between(1350, 1400), 
        		Phaser.Math.Between(360, 570));
        if (!f1) return; // None free
        activateFish(f1);
    }
    
    