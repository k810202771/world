/*
* */
function dataset(that) {
    //data赋值
    var value,text;
    value=text=that.OriginalHTML
    var p = eval("/\{\{(.*?)\}\}/g");
    for(var i in that){
        console.log(that)
        while ((result = p.exec(text)) != null)  {
            if(result[1].replace(/\s/g,"") == i){
                value=value.replace(result[0],that.data[i]);
            }
        }
    }
    that.el.innerHTML = value;
}
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
    that = {
        el:"body",
        onclick:null,
        data:null,
        OriginalHTML:null,
    }
 
    for(var i in op)that[i] = op[i];

    that.el = AccessNode(that.el);
    //this.el = that.options.el
    that.OriginalHTML = that.el.innerHTML;


    for(var data in that.data) {
        Object.defineProperty(this,data,{
            set:function (val){
                dataset(this);
            }
        });
    }

    //执行事件
    if(!that.el.length){
        //针对 ID 单个类型
        dataset(that);
        //按下事件
        that.onclick?that.el.onclick=function(e){that.onclick(e)}:null;
    }else{
        for(var i=0;i<this.el.length;i++){
            //针对 Class or Tag 的单个类型
            //按下事件
            that.onclick?that.el[i].onclick=function(e){that.onclick(e)}:null;
        }
    }
    for(var i in that)this[i] = that[i];

}

