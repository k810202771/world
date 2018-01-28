<?php

error_reporting(0);

// 设置返回json格式数据
header('content-type:application/json;charset=utf8');

// 获取分页参数
$page = 1 ;
$pageSize = 8;
$type = 0;
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
$file = "save/list_".$type."_".$page.".json";
if(file_exists($file)){
	if(@trim($_SERVER['HTTP_IF_NONE_MATCH']) == md5_file($file)){
		header("HTTP/1.1 304 Not Modified");
		exit();
	};
};

//中断操作
if($_GET["type"]==null){
	die("未定义数据类型！");	
}
//连接数据库
require_once('root.php');

// 总记录数
$sql = "SELECT * FROM article where type='".$type."'";
$result = mysql_query($sql,$link);
$pageMax = ceil(mysql_num_rows($result) / $pageSize);
// 分页数据
$sql = "SELECT * FROM article where type='".$type."' order by id desc limit ".(($page-1)*$pageSize).",".($pageSize);
$result = mysql_query($sql,$link);
//初始化数据
$text = "{\"type\":".$type.",\"page\":\"".$page."\",\"pageMax\":\"".$pageMax."\",\"text\":[";
$i=0;

//循环出数据
while($row = mysql_fetch_array($result))
{
	$i++;
	$text = $text."{\"Uid\":".$i.",\"id\":".$row["Id"].",\"img\":[".$row["cover"]."],\"title\":\"".$row["title"]."\",\"subTitle\":\"".$row["subTitle"]."\",\"time\":\"".$row["time"]."\"}";
	if($i!=mysql_num_rows($result)){
		$text=$text.",";
	}
}

$text=$text."]}";

//关闭数据库
mysql_close($link);


//写入文件
$myfile = fopen($file, "w") or die("写入失败！");
fwrite($myfile, $text);
fclose($myfile);

//发送MD5
header("Etag: ".md5_file($file));
echo $text;
?>