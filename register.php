<?php
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "無法解析請求"]);
    exit;
}

$email = isset($data["email"]) ? trim($data["email"]) : "";
$username = isset($data["username"]) ? trim($data["username"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";

if (empty($email) || empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "請輸入完整資訊"]);
    exit;
}

$servername = "localhost";
$username_db = "root";  
$password_db = "";   
$dbname = "teahouse"; 

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "資料庫連線失敗"]);
    exit;
}

$sql_check = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql_check);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "電子郵件已被註冊"]);
    exit;
}

$sql_check_username = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql_check_username);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "用戶名稱已被使用"]);
    exit;
}

$sql_insert = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql_insert);
$stmt->bind_param("sss", $email, $username, $password);

if ($stmt->execute()) {
    $new_uid = $conn->insert_id;
    echo json_encode([
        "success" => true, 
        "message" => "註冊成功",
        "uid" => $new_uid  
    ]);
} else {
    echo json_encode(["success" => false, "message" => "註冊失敗，請稍後再試"]);
}

$stmt->close();
$conn->close();
?>