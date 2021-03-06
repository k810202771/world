<?php
error_reporting(0); 

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
//取数据MD5
$file = "save/article/article_".$type."_".$id.".json";
if(file_exists($file)){
	//发送MD5
	header("Etag: ".md5_file($file));
	if(@trim($_SERVER['HTTP_IF_NONE_MATCH']) == md5_file($file)){
		header("HTTP/1.1 304 Not Modified");
		exit();
	}else{
		$myfile = fopen($file, "r") or die("读入文件错误！");
		echo fread($myfile,filesize($file));
		fclose($myfile);
		exit();
	};
};

//连接数据库
require_once('root.php');


// 获取数据
$sql = "SELECT * FROM article where Uid='".$id."'";
$result = mysql_query($sql,$link);
$row = mysql_fetch_array($result);
// 上一条数据
$type = $row["type"];
$sql = "SELECT * FROM article where type='".$type."' and type>0 and uid > ".$id." order by id asc limit 1";
$result = mysql_query($sql,$link);
$last = mysql_fetch_array($result);
// 下一条数据
$sql = "SELECT * FROM article where type='".$type."' and type>0 and uid < ".$id." order by id desc limit 1";
$result = mysql_query($sql,$link);
$next = mysql_fetch_array($result);
$sql = "SELECT * FROM content where Uid='".$id."'";
$result = mysql_query($sql,$link);
$text = mysql_fetch_array($result);
mysql_close($link);
$jsonData = "{\"uid\":\"".$uid."\",\"last\":{\"title\":\"".$last["title"]."\",\"id\":\"".$last["Uid"]."\"},\"next\":{\"title\":\"".$next["title"]."\",\"id\":\"".$next["Uid"]."\"},\"title\":\"".$row["title"]."\",\"time\":\"".$row["time"]."\",\"text\":\"".htmlspecialchars($text["text"])."\"}";

//写入文件
mkdir ("save/article",0777,true);
$myfile = fopen($file, "w") or die("写入失败！");
fwrite($myfile, $jsonData);
fclose($myfile);
//发送MD5
header("Etag: ".md5_file($file));
echo $jsonData;
?>