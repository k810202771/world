<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

// 设置返回json格式数据
header('content-type:application/json;charset=utf8');

//中断操作
if($_GET["id"]==null || $_GET["type"]==null || $_GET["uid"]==null){
	die("未定义数据类型！");	
}
//初始化数据
$id = $_GET["id"];
$uid = $_GET["uid"];
$type = $_GET["type"];

//连接数据库
require_once('root.php');

// 上一条数据
$sql = "SELECT * FROM article where type='".$type."' order by id desc limit ".($uid-2).",1";
$result = mysql_query($sql,$link);
$last = mysql_fetch_array($result);
// 下一条数据
$sql = "SELECT * FROM article where type='".$type."' order by id desc limit ".$uid.",1";
$result = mysql_query($sql,$link);
$next = mysql_fetch_array($result);
// 获取数据
$sql = "SELECT * FROM article where id='".$id."'";
$result = mysql_query($sql,$link);
$row = mysql_fetch_array($result);
$sql = "SELECT * FROM content where id='".$id."'";
$result = mysql_query($sql,$link);
$text = mysql_fetch_array($result);
echo "{\"uid\":\"".$uid."\",\"last\":{\"title\":\"".$last["title"]."\",\"id\":\"".$last["Id"]."\"},\"next\":{\"title\":\"".$next["title"]."\",\"id\":\"".$next["Id"]."\"},\"title\":\"".$row["title"]."\",\"time\":\"".$row["time"]."\",\"text\":\"".htmlspecialchars($text["text"])."\"}";
mysql_close($link);
?>