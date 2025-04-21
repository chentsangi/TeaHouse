<?php
$servername = "localhost";       
$username = "root";              
$password = "";                  
$dbname = "teahouse";            

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "資料庫連線失敗：" . $conn->connect_error]));
}
?>