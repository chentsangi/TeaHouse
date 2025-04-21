<?php
$config = [
    'host' => 'localhost',
    'dbname' => 'teahouse',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('HTTP/1.0 400 Bad Request');
    die('無效的請求');
}

$logoId = (int)$_GET['id'];

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    header('HTTP/1.0 500 Internal Server Error');
    die('資料庫連接失敗');
}

try {
    $stmt = $pdo->prepare("SELECT imagedata, filetype FROM site_logos WHERE picid = ?");
    $stmt->execute([$logoId]);
    $logo = $stmt->fetch();
    
    if (!$logo) {
        header('HTTP/1.0 404 Not Found');
        die('找不到指定的LOGO');
    }
    
    header('Content-Type: ' . $logo['filetype']);
    ob_clean();
    flush();
    echo $logo['imagedata'];
    exit;
    
} catch (PDOException $e) {
    header('HTTP/1.0 500 Internal Server Error');
    die('無法獲取LOGO數據');
}