<?php
error_reporting(0);

// 设置返回json格式数据
header('content-type:application/json;charset=utf8');
//连接数据库
require_once('root.php');
$data = json_decode(stripslashes($_POST["data"]));
$text = "";

$sql = "SELECT * FROM article order by id desc limit 0,1";
$result = mysql_query($sql,$link);
$row = mysql_fetch_array($result);
if(mysql_num_rows($result)==0){
	$Uid = 1;
}else{
	$Uid = $row["Uid"]+1;
}

if(mysql_query("INSERT INTO article (title, subTitle, cover, time, type,Uid) 
VALUES ('".$data->title."', '".$data->subTitle."', '\"".implode("\",\"",$data->cover)."\"','".date('y-m-d h:i:s',time())."',".$data->type.",'".$Uid."')")){
	//判断是否插入成功
	mysql_query("INSERT INTO content (text,Uid) 
	VALUES ('".$_POST["text"]."','".$Uid."')");

	$text = '{"type":"'.$data->type.'","Uid":"1","id":"'.$Uid.'"}';
	echo $text;

	//删除缓存文件
	deldir("save");
};

//关闭数据库
mysql_close($link);

function deldir($dir) {
  //先删除目录下的文件：
  $dh=opendir($dir);
  while ($file=readdir($dh)) {
    if($file!="." && $file!="..") {
      $fullpath=$dir."/".$file;
      if(!is_dir($fullpath)) {
          unlink($fullpath);
      } else {
          deldir($fullpath);
      }
    }
  }
  
  closedir($dh);
  //删除当前文件夹：
  if(rmdir($dir)) {
    return true;
  } else {
    return false;
  }
}
?>