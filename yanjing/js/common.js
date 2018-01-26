//导航菜单浮动
window.onscroll = function(){
    var top =  windostop();
    var el = $("#menu");
    el.style.background = (ie()>8?top/55/2<=0.8?"rgba(255,255,255,"+top/55/2+")":"rgba(255,255,255,0.8)":top>55?"#fff":"");

    if(top >= 55){
        el.style.position = "fixed";
    }else{
        el.style.position = "";
    }
};
//分享按钮
var share = new Worm({
    el: "#head_right",
    data: {
        over: function (e) {
            e.style.color = "#f24853";
            $("div", e).style.display = "block";
        },
        out: function (e) {
            e.style.color = "";
            $("div", e).style.display = "";
        }
    }
});
//menu菜单导航
var menu = new Worm({
    el:"#poster_bg",
    data:{
        menu1:"官网首页",
        menu2:"新闻资讯",
        menu3:"产品资料",
        menu4:"合作加盟",
        menu5:"联系我们",
        menu6:"关于我们"
    }
});