/*
* */
//Ajax
function loadXMLDoc(url,type,func)
{
    var xmlhttp=null;
    if (window.XMLHttpRequest)
    {// code for IE7, Firefox, Opera, etc.
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null)
    {

        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                func(xmlhttp.responseText);
            }
        }

        xmlhttp.open(type,url,true);
        xmlhttp.send(null);
    }
    else
    {
        alert("您的浏览器不支持AJAX请更换浏览器！");
    }
}

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
//解决IE8之类不支持getElementsByClassName
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}

function DataSet(that) {
    var p = /\{\{(.*?)\}\}/g;
    if (!that.el.length) {
        for(var s in that.SATT){
            that.elSATT[s]?that.el.setAttribute(that.SATT[s],that.elSATT[s]):null;
        }
        var el = that.el.getElementsByTagName("*");
        for(var b=0;b<el.length;b++){
            for(var s in that.SATT){
                that.selSATT[b][s]?el[b].setAttribute(that.SATT[s],that.selSATT[b][s]):null;
            }
        }
        for(var c=0;c<that.sel.length;c++){
            if(that.sel[c].innerHTML)el[c].innerHTML = that.sel[c].innerHTML;
        }
        topLevel(that.el,that,p);
        replace(el,that,p);
    } else {
        for(var i=0;i<that.el.length;i++) {
            for(var s in that.SATT){
                that.elSATT[i][s]?that.el[i].setAttribute(that.SATT[s],that.elSATT[i][s]):null;
            }
            var el = that.el[i].getElementsByTagName("*");
            for(var b=0;b<el.length;b++){
                for(var s in that.SATT){
                    that.selSATT[i][b][s]?el[b].setAttribute(that.SATT[s],that.selSATT[i][b][s]):null;
                }
            }
            for(var e=0;e<that.sel.length;e++){
                if(that.sel[e] == el){
                    for(var b=0;b<that.sel[i].length;b++){
                        if(that.sel[i][b].innerHTML)el[b].innerHTML = that.sel[i][b].innerHTML;
                    }
                }
            }
            topLevel(that.el[i],that,p);
            replace(el,that,p);
        }
    }
}

function topLevel(el,that,p) {
    var value = {html: ""};
    var text = value;
    value.html = text.html = el.innerHTML;
    for(var s=0;s<that.SATT.length;s++) {
        for(var i in that.data) {
            onEvent(that.SATT[s],that,el,i,"",p,true);
        }
    }
    for(var i in that.data) {
        value.html = results(i,el,value.html,text.html,that,p);
    }
    if(value.html)el .innerHTML = value.html;
}
replace = function (element,that,p) {
    var value = {html: ""};
    var text = value;
    var el = element;
    //静态属性
    var SATT = that.SATT;
    //动态属性
    var DATT = that.DATT;

    for(var c=0;c<el.length;c++){
        value.html = text.html = el[c].innerHTML;
        for(var i in that.data){
            for(var s=0;s<SATT.length;s++){
                onEvent(SATT[s],that,el[c],i,"",p,true);
            }
            for(var d=0;d<DATT.length;d++){
                onEvent("@"+DATT[d],that,el[c],i,"on"+DATT[d],p,false);
            }
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
IeValueHookAPI =function(I,att,value){
    I.data[att] = value;
    DataSet(I);
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
function $(text,Parent,judge){
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

Worm = function (op){
    var that = this;
    that = {
        el:"body",
        data:null,
        ElHtml:null,
        sel:[],
        elSATT:[],
        selSATT:[],
        SATT:["id","class","src"],
        DATT:["click","mouseover","mouseout"]
    };
 
    for(var i in op)that[i] = op[i];

    that.el = $(that.el);
    this.el = that.el;
    that.ElHtml = that.el.innerHTML;
    if (!that.el.length) {
        for(var s in that.SATT) {
            that.elSATT[s] = that.el.getAttribute(that.SATT[s]);
        }
        var el = that.el.getElementsByTagName("*");
        for(var i=0;i<el.length;i++){
            that.sel[i] = el[i];
            //
            that.selSATT[i] = [];
            for(var s in that.SATT){
                that.selSATT[i][s] = el[i].getAttribute(that.SATT[s]);
            }
        }
    }else{
        for(var e=0;e<that.el.length;e++){
            that.sel[e] = [];
            that.selSATT[e] = [];
            that.elSATT[e] = [];
            var el = that.el[e].getElementsByTagName("*");
            for(var s in that.SATT) {
                that.elSATT[e][s] = that.el[e].getAttribute(that.SATT[s]);
            }
            for(var i=0;i<el.length;i++){
                that.sel[e][i] = el[i];
            }

            for(var v=0;v<el.length;v++){
                that.selSATT[e][v] = [];
                for(var i in that.SATT){
                    that.selSATT[e][v][i] = el[v].getAttribute(that.SATT[i]);
                }
            }
        }
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
        that.load?that.el.load=that.load():null;
    }else{
        for(var i=0;i<this.el.length;i++){
            //针对 Class or Tag 的单个类型
            //按下事件
            that.onclick?that.el[i].onclick=function(e){that.onclick(e)}:null;
            that.onmouseover?that.el[i].onmouseover=function(e){that.onmouseover(e)}:null;
            that.onmouseout?that.el[i].onmouseout=function(e){that.onmouseout(e)}:null;
            that.load?that.el[i].load=that.load():null;
        }
    }
    for(var i in that)this[i] = that[i];
}

