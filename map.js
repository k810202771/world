function Map(width,height){
    var platforms;
    var MediumShot = [];
    var background = [];
    return{
        preload:function(){
            game.load.image('tiles', 'assets/map/1.png');
            game.load.image('tiles2', 'assets/map/2.png');
            game.load.image('background', 'assets/map/3.jpg');
        },
        create:function () {
            var mapGroup = game.add.group();

            var MapLength = parseInt(width / 640) + 1
            //渲染背景
            for (var i = 0; i < MapLength; i++)
            {
                background[i] = mapGroup.create(640*i, (height-235)-240, 'background');
            }
            //渲染中景
            MapLength = parseInt(width / 640) + 1
            for (var i = 0; i < MapLength; i++)
            {
                MediumShot[i] = mapGroup.create(640*i, (height-235)-240, 'tiles2');
            }
            //渲染前景
            MapLength = parseInt(width / 224) + 1
            for (var i = 0; i < MapLength; i++)
            {
                titleWidth = mapGroup.create(224*i, height - 235, 'tiles');
            }
            game.world.resize(width, height);
        },
        position:function () {

        },
        update:function () {
            for(var i=0;i<background.length;i++){
                background[i].x = 640*i+(game.camera.x / 1.2);
            }
            for(var i=0;i<MediumShot.length;i++){
                MediumShot[i].x = 640*i+(game.camera.x / 5);
            }

            if(game.camera.x == 0 && actor.x > game.width/2){
                MoveSpeed = 0;
            }else if(width - game.width == game.camera.x && actor.x < game.camera.x + game.width/2){
                MoveSpeed = 0;
            }else if(width - game.width == game.camera.x || game.camera.x == 0){
                MoveSpeed = 150;
            }

            //game.camera.x = 20;
        },
        width:width,
        height:height,
        platforms:platforms
    }
}