/*
* */

//AccessNode 文本转节点
function AccessNode(text){
    var h = text.substr(0,1);
    var t = text.substr(1,text.length - 1);
    var el;
    switch(h){
        case "#":
            el = document.getElementById(t);
            break;
        case ".":
            el = document.getElementsByClassName(t);
            break;
        el = document.getElementsByTagName(text);
    }
    return (!el.length?el:el.length==1?el[0]:el);
}

Worm = function (op){
    var that = this;
    that.options = {
        el:"body",
        onclick:null,
        data:null,
    }
 
    for(var i in op)that.options[i] = op[i];

    that.options.el = AccessNode(that.options.el);


    //执行事件
    if(!that.options.el.length){
        //针对 ID 单个类型
        //data赋值
        for(var i in that.options.data){
            var text = that.options.el.innerHTML;
            var p = eval("/^.+?\{\{(.+?)\}\}.+?\{\{(.+?)\}\}.*$/");
            console.log(p.exec(that.options.el.innerHTML))
            that.options.el.innerHTML=text.replace(p, that.options.data[i]);
            //console.log(p.exec(text),text,i,that.options.data[i])
        }

        //按下事件
        that.options.onclick?that.options.el.onclick=function(e){that.options.onclick(e)}:null;
    }else{
        for(var i=0;i<this.el.length;i++){
            //针对 Class or Tag 的单个类型
            //按下事件
            that.options.onclick?that.options.el[i].onclick=function(e){that.options.onclick(e)}:null;
        }
    }
}

