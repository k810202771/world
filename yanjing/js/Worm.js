/*
* */
/*检测IE7/IE8*/
function ie(){
    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")
    {
        return 7;
    }else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")
    {
        return 8;
    }
    return 9;
}

function DataSet(that) {
    var p = /\{\{(.*?)\}\}/g;

    if (!that.el.length) {
        var el = that.el.getElementsByTagName("*");
        topLevel(that.el,that,p)
        replace(el,that,p)
    } else {
        for(var i=0;i<that.el.length;i++){
            var el = that.el[i].getElementsByTagName("*");
            topLevel(that.el[i],that,p)
            replace(el,that,p)
        }
    }
}


function topLevel(el,that,p) {
    var value = {html: ""};
    var text = value;
    value.html = text.html = el.innerHTML;
    for(var i in that.data) {
        value.html = results(i,el,value.html,text.html,that,p);
    }
    if(value.html)el .innerHTML = value.html;
}

replace = function (element,that,p) {
    var value = {html: ""};
    var text = value;
    var el = element;

    for(var c=0;c<el.length;c++){
        value.html = text.html = el[c].innerHTML;
        for(var i in that.data){
            //静态属性
            onEvent("class",that,el[c],i,"",p,true);
            //动态属性
            onEvent("@click",that,el[c],i,"onclick",p,false);
            onEvent("@mouseover",that,el[c],i,"onmouseover",p,false);
            onEvent("@mouseout",that,el[c],i,"onmouseout",p,false);
            //内容
            value.html = results(i,el[c],value.html,text.html,that,p);
        }
        if(value.html)el[c].innerHTML = value.html;
    }
}

results = function(i,el,value,text,that,p){
    var result;
    var t = el.childNodes;
    var html = text;
    if(t){
        for(c=0;c<t.length;c++){
            if(t[c].nodeName == "#text" && !/\s/.test(t.nodeValue)){
            }else{
                html=html.replace(t[c].outerHTML,"&~worm~&"+c);
            }
        }
    }
    value = text = html;
    while ((result = p.exec(text)) != null)  {
        if(result[1].replace(/\s/g,"") == i){
            value=value.replace(result[0],that.data[i]);
        }
    }
    if(t) {
        for (c = 0; c < t.length; c++) {
            if (t[c].nodeName == "#text" && !/\s/.test(t.nodeValue)) {
            } else {
                value = value.replace("&~worm~&" + c, t[c].outerHTML);
            }
        }
    }
    return value;
};

onEvent = function(text,that,el,i,event,p,quiet){
    var result;
    var value = el.getAttribute(text);
    var att=p.exec(value);
    if(att){result = att[1].replace(/\s/g,"")
        if(result == i){
            if(quiet){
                value=value.replace(att[0],that.data[i]);
                el.setAttribute(text,value);
            }else{
                el.removeAttribute(text);
                el[event] = function(){that.data[i](this)};
            }
        }
    }
}

ValueHookAPI = function(that,e,key) {
    if(ie()>8){
        Object.defineProperty(e,key,{
            set:function (val){
                that.data[key] = val;
                DataSet(that);
            }
        });
    }
}
//$ 文本转节点
function $(text,Parent){
    var h = text.substr(0,1);
    var t = text.substr(1,text.length - 1);
    var pt = (Parent?Parent:document);
    var el;
    switch(h){
        case "#":
            el = pt.getElementById(t);
            break;
        case ".":
            el = pt.getElementsByClassName(t);
            break;
    }
    if(!el)el = pt.getElementsByTagName(text);
    return (!el.length?el:el.length==1?el[0]:el);
}

Worm = function (op){
    var that = this;
    that = {
        el:"body",
        onclick:null,
        onmouseover:null,
        onmouseout:null,
        data:null
    }
 
    for(var i in op)that[i] = op[i];

    that.el = $(that.el);
    this.el = that.el;


    for(var data in that.data) {
        new ValueHookAPI(that,this,data)
    }

    //初始化Text
    DataSet(that);

    //执行事件
    if(!that.el.length){
        //针对 ID 单个类型
        //按下事件
        that.onclick?that.el.onclick=function(e){that.onclick(e)}:null;
        that.onmouseover?that.el.onmouseover=function(e){that.onmouseover(e)}:null;
        that.onmouseout?that.el.onmouseout=function(e){that.onmouseout(e)}:null;
    }else{
        for(var i=0;i<this.el.length;i++){
            //针对 Class or Tag 的单个类型
            //按下事件
            that.onclick?that.el[i].onclick=function(e){that.onclick(e)}:null;
            that.onmouseover?that.el[i].onmouseover=function(e){that.onmouseover(e)}:null;
            that.onmouseout?that.el[i].onmouseout=function(e){that.onmouseout(e)}:null;
        }
    }
}

