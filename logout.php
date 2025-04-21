<?php
header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

session_unset();
session_destroy();

session_write_close();

echo json_encode(["success" => true, "message" => "登出成功"]);
exit;
