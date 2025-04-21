<?php
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['subject']) || !isset($data['email']) || !isset($data['message'])) {
    echo json_encode([
        "success" => false,
        "message" => "缺少必要欄位"
    ]);
    exit;
}

$subject = trim($data['subject']);
$email = trim($data['email']);
$message = trim($data['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "電子郵件格式不正確"
    ]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "teahouse";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "資料庫連線失敗：" . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

$stmt = $conn->prepare("INSERT INTO messages (email, subject, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $subject, $message);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "您的訊息已成功送出，我們會盡快回覆您！"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "訊息送出失敗：" . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
