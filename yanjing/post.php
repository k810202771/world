<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

// 设置返回json格式数据
header('content-type:application/json;charset=utf8');

//中断操作
if($_GET["type"]==null){
	die("未定义数据类型！");	
}

//连接数据库
require_once('root.php');

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


echo $text;
//关闭数据库
mysql_close($link);
?>