var Roulette = {x:0,y:0},AttackButton;

//碰撞检测
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

function AttackButtonBoolean(){
    return{
        isValue:function (value) {
            this.id = -1;
            if(value.x >= AttackButton.x - game.camera.x && value.x <= AttackButton.x - game.camera.x+ AttackButton.width && value.y >= AttackButton.y && value.y <= AttackButton.y + AttackButton.height){
                this.id = value.id;
                return true;
            }
        }
    }
}
function actor(){
    var timer,player;
    return{
        preload:function(){
            game.load.spritesheet('role1-Stand', 'assets/actor/role1/Stand.png', 47, 64); //待机
            game.load.spritesheet('role1-Run', 'assets/actor/role1/Run.png', 64, 66); //行走
            game.load.spritesheet('role1-attack', 'assets/actor/role1/attack.png', 114, 58); //攻击
            game.load.spritesheet('role1-Block', 'assets/actor/role1/Block.png', 59, 61); //被击中

            game.load.spritesheet('button', 'assets/ui/button.png', 180, 180); //攻击按钮

        },
        create:function () {

            player = ObjectGroup.create(32, game.world.height - 150, 'role1-Run');
            game.physics.arcade.enable(player);

            player.body.collideWorldBounds = true;
            player.animations.add('Run', [0,1,2,3,4,5,6,7], 10, true);
            player.animations.add('Stand', [0,1,2,1,0], 5, true);
            var attackAnimations = player.animations.add('attack', [0,1,2,3], 5, true);
            var BlockAnimations = player.animations.add('Block', [1,0], 10, true);

            player.anchor = {x:0.5,y:0.6};


            onFocus = game.onFocus.Signal;

            scoreText = game.add.text(16, 16, 'HP: 0', { fontSize: '24px', fill: '#fff' });
            scoreText.fixedToCamera = true;

            AttackButton = game.add.button(game.width - 180, game.height - 180, 'button', actionOnClick, this, 1,1);
            AttackButton.alpha = 0.5;

            //动画播放结束
            attackAnimations.onLoop.add(attackAnimationStop, this);
            BlockAnimations.onLoop.add(BlockAnimationStop, this);
        },
        update:function () {

            player.body.velocity.x = 0;
            player.body.velocity.y = 0;


            if(player.key != 'role1-attack' && player.key != 'role1-attackOver' ){
                //左右移动
                if(Roulette.x < 0){
                    if(player.width>0)player.width  = -player.width;
                    player.animations.play('Run');
                }
                if(Roulette.x > 0){
                    if(player.width<0)player.width  = -player.width;
                    player.animations.play('Run');
                }

                if(MoveSpeed==0)game.camera.x += (2*Roulette.x);
                player.body.velocity.x = MoveSpeed*Roulette.x;

                //上下移动
                if(Roulette.y != 0){
                    player.animations.play('Run');
                }

                if(player.y >= game.height - 235){
                    player.body.velocity.y = 100*Roulette.y;
                }else{
                    player.y = game.height - 235
                }
            }

            this.x = player.x;
            this.y = player.y;
            this.z = player.z;

            AttackButton.x = windowData.width - 180 + game.camera.x;
            AttackButton.y = windowData.height - 180 + game.camera.y;


            //重置位置于画面中央
            if(MoveSpeed==0)player.x = game.width/2+game.camera.x;

            if(Roulette.x != 0 || Roulette.y != 0){
                if(player.key == 'role1-Stand')player.loadTexture('role1-Run', 0);
            }else {
                if(player.key == 'role1-Run'){
                    player.loadTexture('role1-Stand', 0);
                    player.animations.play('Stand');
                }
            }
            //攻击检测
            for(var i=0;i<ObjectGroup.children.length;i++){
                if(ObjectGroup.children[i] != player && player.frame >= 2){
                    if(player.key == 'role1-attackOver' || player.key == 'role1-attack'){
                        if(checkOverlap(player, ObjectGroup.children[i])){
                            ObjectGroup.children[i].key = "role1-ready-Block";
                        };
                    }
                }
            }

        },
        AttackButtonOver:function(e) {
            e.alpha = 0.6;
            clearTimeout(timer);
            e.setFrames(1,0)
            player.loadTexture('role1-attack', 0);
            player.animations.play('attack');
        },
        AttackButtonOnClick:function(e) {
	        timer = setTimeout(function () {
	            e.alpha = 0.3;
	        },500)
            e.setFrames(0,1)

            player.key = 'role1-attackOver';
        }
    }
    function BlockAnimationStop(e){
        if(e.key == 'role1-attackOver'){
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
    function actionOnClick() {

    }
}