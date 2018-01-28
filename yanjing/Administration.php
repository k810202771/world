<?php
// 设置页面编码
header('content-type:application/json;charset=utf8');

$path = "/ueditor/php/upload/";
$type = $_GET["type"];
switch ($type) {
	case 'image':
		$path = $path."image";
		$type = [".png",".jpg",".jpeg",".gif",".bmp"];
		break;
	case 'file':
		$path = $path."file";
		$type = [".*"];
		break;
	default:
		die("警告：错误的type！");
		break;
}

$path = $_SERVER['DOCUMENT_ROOT'] . (substr($path, 0, 1) == "/" ? "":"/") . $path;
$result = array();

traversing($path, $result, $type);
print_r($result);

function traversing($path, &$result, $type){
    $curr = glob($path."/*");
    if($curr){
        foreach($curr as $f){
            if(is_dir($f)){
                array_push($result, $f);
                traversing($f, $result,$type);
            }else{
            	for ($i=0; $i < count($type); $i++) { 
            		if(strtolower(substr($f, -4))==$type[$i]){
                		array_push($result, $f);
            		}elseif ($type[$i] == ".*") {
            			array_push($result, $f);
            		}
            	}
            }
        }
    }
}
?>