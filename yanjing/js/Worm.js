/*
* */
//获取Element
function addEvent(obj,e,fun){
    obj.attachEvent ? obj.attachEvent("on"+e,fun) : obj.addEventListener(e,fun,false);
}

//AccessNode
function AccessNode(text){
    var h = text.substr(0,1);
    var t = text.substr(1,text.length - 1);
    switch(h){
        case "#":
            return document.getElementById(t);
    }
}

function Worm(op){
    that = {
        el:"body",
        onclick:null
    }

    for(i in op)that[i] = op[i];
    that.el = AccessNode(that.el);
    //that.onclick = that.onclick.toString().replace(/this\./, "that.");

}

