<?php
header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$timeout = 600;

if (isset($_SESSION['user']) && isset($_SESSION['login_time'])) {
    if (time() - $_SESSION['login_time'] > $timeout) {
        session_unset();
        session_destroy();
        echo json_encode(["loggedIn" => false], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $userId = isset($_SESSION['uid']) ? $_SESSION['uid'] : 1;
    
    echo json_encode([
        "loggedIn" => true,
        "name" => $_SESSION['user'],
        "id" => $userId 
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(["loggedIn" => false], JSON_UNESCAPED_UNICODE);
exit;