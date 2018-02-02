<?php

error_reporting(0);

// 设置返回json格式数据
header('content-type:application/json;charset=utf8');

// 获取分页参数
$page = 1 ;
$pageSize = 7;
$type = -1;
$typeText="where type > 0";
if(!is_null($_GET["page"])) {
	$page = $_GET["page"];
}
if(!is_null($_GET["pageSize"])) {
	$pageSize = $_GET["pageSize"];
}
if(!is_null($_GET["type"])) {
	$type = $_GET["type"];
}
//取数据MD5
$file = "save/list_".$type."_".$pageSize."_".$page.".json";
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
	}
};

//中断操作
if($_GET["type"]==null){
	die("未定义数据类型！");	
}
//连接数据库
require_once('root.php');

// 总记录数
if($type == 0){
	$sql = "SELECT * FROM article ".$typeText;
}else{
	$sql = "SELECT * FROM article where type='".$type."'";
}
$result = mysql_query($sql,$link);
$pageMax = ceil(mysql_num_rows($result) / $pageSize);

// 分页数据
$type>0 && ($typeText = "where type='".$type."'");
$sql = "SELECT * FROM article ".$typeText." order by id desc limit ".(($page-1)*$pageSize).",".($pageSize);
$result = mysql_query($sql,$link);
//初始化数据
if($type==0){
	$text = "{\"page\":\"".$page."\",\"pageMax\":\"".$pageMax."\",\"text\":[";
}else{
	$text = "{\"type\":".$type.",\"page\":\"".$page."\",\"pageMax\":\"".$pageMax."\",\"text\":[";
}
$i=0;

//循环出数据
while($row = mysql_fetch_array($result))
{
	$i++;
	if($type==0){
		$text = $text."{\"type\":".$row["type"].",";
	}else{
		$text = $text."{";
	}
	$text = $text."\"Uid\":".(($page-1)*$pageSize+$i).",\"id\":".$row["Uid"].",\"img\":[".$row["cover"]."],\"title\":\"".$row["title"]."\",\"subTitle\":\"".$row["subTitle"]."\",\"time\":\"".$row["time"]."\"}";
	if($i!=mysql_num_rows($result)){
		$text=$text.",";
	}
}

$text=$text."]}";

//关闭数据库
mysql_close($link);


//写入文件
mkdir ("save/article",0777,true);
$myfile = fopen($file, "w") or die("写入失败！");
fwrite($myfile, $text);
fclose($myfile);

//发送MD5
header("Etag: ".md5_file($file));
echo $text;
?>