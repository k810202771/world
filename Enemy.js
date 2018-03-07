function Enemy() {
    var playerP = [];
    var attackAnimations = [];
    var BlockAnimations = [];
    return {
        preload: function () {

        },
        create: function (x,y) {
            //playerP.push(game.add.sprite(x, y, 'role1-Run'));
            playerP.push(ObjectGroup.create(x, y, 'role1-Run'));
            var index = playerP.length-1;
            game.physics.arcade.enable(playerP[index]);
            playerP[index].body.collideWorldBounds = true;
            playerP[index].animations.add('Run', [], 10, true);
            playerP[index].animations.add('Stand', [0, 1, 2, 1, 0], 5, true);
            playerP[index].anchor = {x: 0.5, y: 0.6};
            attackAnimations[index] = playerP[index].animations.add('attack', [0,1,2,3], 5, true);
            BlockAnimations[index] = playerP[index].animations.add('Block', [1,0], 10, true);

            //动画播放结束
            attackAnimations[index].onLoop.add(attackAnimationStop, this);
            BlockAnimations[index].onLoop.add(BlockAnimationStop, this);
        },
        update: function () {

            for(var i=0;i<playerP.length;i++){
                if (playerP[i].key == 'role1-Run'){
                    playerP[i].loadTexture('role1-Stand', 0);
                    playerP[i].animations.play('Stand');
                }

                if(playerP[i].key == 'role1-ready-Block'){
                    playerP[i].loadTexture('role1-Block', 0);
                    playerP[i].animations.play('Block');
                }
            }

        },
        player:playerP
    }
    function BlockAnimationStop(e){
        if(e.key == 'role1-Block'){
            e.loadTexture('role1-Stand', 0);
            e.animations.play('Stand');
        }
    }
    function attackAnimationStop(e) {
        if(e.key == 'role1-attackOver'){
            e.loadTexture('role1-Stand', 0);
            e.animations.play('Stand');
        }
    }
}