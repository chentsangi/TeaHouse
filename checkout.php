<?php
header("Content-Type: application/json");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['uid'])) {
    echo json_encode(["success" => false, "message" => "請先登入再進行結帳"]);
    exit;
}

$servername = "localhost";
$username = "root";  
$password = "";  
$dbname = "teahouse";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "資料庫連線失敗：" . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "無法解析 JSON，請檢查請求格式"]);
    exit;
}

$uid = $_SESSION['uid'];
$total_price = $data['total_price'] ?? 0;
$items = $data['items'] ?? [];

if (empty($items)) {
    echo json_encode(["success" => false, "message" => "購物車是空的，無法建立訂單"]);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO orders (uid, total_price, created_at) VALUES (?, ?, NOW())");
    $stmt->bind_param("id", $uid, $total_price);
    
    if (!$stmt->execute()) {
        throw new Exception("訂單建立失敗：" . $stmt->error);
    }
    
    $oid = $conn->insert_id;
    $stmt->close();
    
    echo json_encode([
        "success" => true, 
        "message" => "訂單已成功送出", 
        "order_id" => $oid
    ]);
    
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>