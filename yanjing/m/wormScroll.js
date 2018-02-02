function $$(text,Parent,judge){
    var h = text.substr(0,1);
    var t = text.substr(1,text.length - 1);
    var pt = (Parent?Parent:document);
    var el;
    var a=[];
    switch(h){
        case "#":
            el = pt.getElementById(t);
            break;
        case ".":
            el = pt.getElementsByClassName(t);
            break;
    }
    if(!el)el = pt.getElementsByTagName(text);
    if(judge){
        a[0] = (!el.length?el:el.length==1?el[0]:null);
        if(!a[0]){a=el};
        return a;
    }
    return (!el.length?el:el.length==1?el[0]:el);
}
function $set(text,attribute,Parent){
    var object = document.createElement(text);
    for(var i in attribute)if(attribute[i])object[i] = attribute[i];
    if(Parent)Parent.appendChild(object);
    return object;
}
wormScroll = function(box,data){
    var that = this;
    that = {
        time:0.5,
        object:{
            loadTop:{el:null,attribute:{className:"lineTop wormLine wormText",innerHTML:"上拉刷新!"}},
            loadContent:{el:null,attribute:{className:"lineContent wormLine",innerHTML:"<ul></ul>"}},
            loadBottom:{el:null,attribute:{className:"lineBottom wormLine wormText",innerHTML:"下拉刷新!"}},
        },
        load:null,
        reload:null
    }
    for(var i in data)that[i] = data[i];
    //设置box
    var listBox = $$(box);
    //设置box内容
    for(var i in that.object){
        that.object[i].el = $set("div",that.object[i].attribute,listBox);
    }

/*    listBox.insertBefore(listLiTop,listUl);
    listBox.appendChild(listLiBottom);*/

    that.object.loadContent.el.onscroll = function(){
        if(that.object.loadContent.el.scrollTop == 0 || that.object.loadContent.el.scrollTop == $$("ul",that.object.loadContent.el).offsetHeight - that.object.loadContent.el.offsetHeight) {
            position.pageY += positionW.pageY - positionS.pageY;
            positionS = {pageX:0,pageY:0};
        }
            /*        switch (this.scrollTop){
                        case 0:
                            console.log(1);
                            break;
                        case listUl.offsetHeight - listBox.offsetHeight - 1:
                            console.log(2);
                            break;
                    }*/
    }

    //设置HTML内容
    setInnerHTML = function(html){
        $set("li",{innerHTML:html},$$("ul",that.object.loadContent.el));
    }
    //设置位置
    scrollTop = function(y){
        var top = "translateY("+ (position.pageY + y)+"px)"
        that.object.loadTop.el.style.transform = top;
        that.object.loadContent.el.style.transform = top;
        that.object.loadBottom.el.style.transform = top;
    }
    //event回调
    var positionS = {pageX:0,pageY:0};
    var positionW = {pageX:0,pageY:0};
    var position = {pageX:0,pageY:0};
    listEvent  = function(event){
        var touch = event.touches[0];
        switch (event.type){
            case "touchstart":
                break;
            case "touchmove":
                if(that.object.loadContent.el.scrollTop == 0 || that.object.loadContent.el.scrollTop == $$("ul",that.object.loadContent.el).offsetHeight - that.object.loadContent.el.offsetHeight){
                    if(positionS.pageX == 0 && positionS.pageY == 0) positionS = touch;
                    positionW = touch;
                    scrollTop(positionW.pageY - positionS.pageY);
                }
                break;
            case "touchend":
                position.pageY += positionW.pageY - positionS.pageY;
                positionS = {pageX:0,pageY:0};
                break;
        }
    }



    listBox.addEventListener("touchstart",listEvent,false);
    listBox.addEventListener("touchmove",listEvent,false);
    listBox.addEventListener("touchend",listEvent,false);
    return {
        InsertLine : setInnerHTML,
        top:function(top){
            listBox.scrollTop = top + listLiTopHeight;
        },
    }
}
