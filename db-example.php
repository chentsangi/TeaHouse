// 請將此檔案重新命名為 db.php 並填入自己的資料庫設定
<?php
$servername = "your_host"; 
$username = "your_username"; 
$password = ""; 
$dbname = "teahouse"; 

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "資料庫連線失敗：" . $conn->connect_error]));
}
?>
