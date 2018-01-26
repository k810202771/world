<?php

//连接数据库
$link = mysql_connect("localhost", "root", "k13994201035");
if (!$link)
{
  die('Could not connect: ' . mysql_error());
}

mysql_query("SET NAMES 'UTF8'");

mysql_select_db("webyanjing", $link);
?>