<?php
error_reporting(0);

// 设置返回json格式数据
header('content-type:application/json;charset=utf8');
//连接数据库
require_once('root.php');
$data = json_decode(stripslashes($_POST["data"]));

$sql = "SELECT * FROM article order by Uid desc limit 0,1";
$result = mysql_query($sql,$link);
$row = mysql_fetch_array($result);
if(mysql_num_rows($result)==0){
	$Uid = 1;
}else{
	$Uid = $row["Uid"]+1;
}
mysql_query("INSERT INTO article (title, subTitle, cover, time, type,Uid) 
VALUES ('".$data->title."', '".$data->subTitle."', '\"".implode("\",\"",$data->cover)."\"','".date('y-m-d h:i:s',time())."',".$data->type.",'".$Uid."')");

mysql_query("INSERT INTO content (text,Uid) 
VALUES ('".$_POST["text"]."','".$Uid."')");

mysql_close($link);
?>