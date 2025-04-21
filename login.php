<?php
header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "teahouse";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "資料庫連線失敗"], JSON_UNESCAPED_UNICODE));
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "請求格式錯誤"], JSON_UNESCAPED_UNICODE);
    exit;
}

$email = isset($data["email"]) ? trim($data["email"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";


if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "電子郵件與密碼不能為空"], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("SELECT uid, email, username, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || $user["password"] !== $password) {
    echo json_encode(["success" => false, "message" => "帳號或密碼錯誤"], JSON_UNESCAPED_UNICODE);
    exit;
}

$_SESSION['user'] = $user["username"] ?? $email;
$_SESSION['uid'] = $user["uid"]; 
$_SESSION['email'] = $user["email"]; 
$_SESSION['login_time'] = time();

error_log("用戶登入成功: {$_SESSION['user']}, UID: {$_SESSION['uid']}");

echo json_encode([
    "success" => true,
    "message" => "登入成功",
    "name" => $_SESSION['user'],
    "uid" => $_SESSION['uid'], 
    "redirect" => "teahouse.html" 
], JSON_UNESCAPED_UNICODE);
exit;