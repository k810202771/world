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
    //data赋值
    var value={html:"",className:"",id:""};
    var text=value;
    var el = that.el.getElementsByTagName("*");
    var p = /\{\{(.*?)\}\}/g;
    for(var c=0;c<el.length;c++){
        for(var e=0;e<that.sel.length;e++){
            if(el[c] == that.sel[e]){
                value.html = text.html = that.selhtml[e];
                for(var i in that.data){
                    //静态属性
                    onEvent("class",that,i,e,"",p,true);
                    //动态属性
                    onEvent("@click",that,i,e,"onclick",p,false);
                    onEvent("@mouseover",that,i,e,"onmouseover",p,false);
                    onEvent("@mouseout",that,i,e,"onmouseout",p,false);
                    //内容
                    value.html = results(i,value.html,text.html,that,p);
                }
                if(value.html)el[c].innerHTML = value.html;
            }
        }
    }
    for(var i in that.data) {
        value.html = text.html = that.HTML;
        value.html = results(i,value.html,text.html,that,p);
    }
    if(value.html)that.el.innerHTML = value.html;
}
results = function(i,value,text,that,p){
    var result;
    var c = /\<.*\>/g;
    var t;
    while((t = c.exec(text)) != null){
        if(t)text=text.replace(t[0],"&~worm~&");value=text;
        while ((result = p.exec(text)) != null)  {
            if(result[1].replace(/\s/g,"") == i){
                value=value.replace(result[0],that.data[i]);
            }
        }
        value=value.replace("&~worm~&",t);
    }

    return value;
};

onEvent = function(text,that,i,e,event,p,quiet){
    var result;
    var value = that.sel[e].getAttribute(text);
    var att=p.exec(value);
    if(att){result = att[1].replace(/\s/g,"")
        if(result == i){
            if(quiet){
                value=value.replace(att[0],that.data[i]);
                that.sel[e].setAttribute(text,value);
            }else{
                that.sel[e].removeAttribute(text);
                that.sel[e][event] = function(){that.data[i](this)};
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
        data:null,
        sel:[],
        selhtml:[],
        HTML:null
    }
 
    for(var i in op)that[i] = op[i];

    that.el = $(that.el);
    this.el = that.el;

    that.sel = that.el.getElementsByTagName("*");
    that.HTML = that.el.innerHTML;
    for(var i =0;i<that.sel.length;i++){
        that.selhtml[i] = that.sel[i].innerHTML;
    }

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

