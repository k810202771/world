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
                value.className = text.className = that.selclass[e];
                value.id = text.id = that.selid[e];
                for(var i in that.data){
                    while ((result = p.exec(text.html)) != null)  {
                        if(result[1].replace(/\s/g,"") == i){
                            value.html=value.html.replace(result[0],that.data[i]);
                        }
                    }
                    while ((result = p.exec(text.className)) != null)  {
                        if(result[1].replace(/\s/g,"") == i){
                            value.className=value.className.replace(result[0],that.data[i]);
                        }
                    }
                    while ((result = p.exec(text.id)) != null)  {
                        if(result[1].replace(/\s/g,"") == i){
                            value.id=value.id.replace(result[0],that.data[i]);
                        }
                    }
                }
                if(value.html)el[c].innerHTML = value.html;
                if(value.className)el[c].className = value.className;
                if(value.id)el[c].id = value.id;
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
//AccessNode 文本转节点
function AccessNode(text,Parent){
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
        data:null,
        OriginalHTML:null,
        sel:[],
        selhtml:[],
        selclass:[],
        selid:[]
    }
 
    for(var i in op)that[i] = op[i];

    that.el = AccessNode(that.el);
    this.el = that.el;
    that.OriginalHTML = that.el.innerHTML;
    that.sel = that.el.getElementsByTagName("*");
    for(var i =0;i<that.sel.length;i++){
        that.selhtml[i] = that.sel[i].innerHTML;
        that.selclass[i] = that.sel[i].className;
        that.selid[i] = that.sel[i].id;
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
    }else{
        for(var i=0;i<this.el.length;i++){
            //针对 Class or Tag 的单个类型
            //按下事件
            that.onclick?that.el[i].onclick=function(e){that.onclick(e)}:null;
        }
    }
}

