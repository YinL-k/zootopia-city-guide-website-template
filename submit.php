<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$team    = $data["team"]    ?? null;
$email   = $data["email"]   ?? null;
$message = $data["message"] ?? null;
$source  = $data["source"]  ?? "inline_form";

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Email is required"]);
    exit;
}

$DB_HOST = "localhost";
$DB_NAME = "final_project";
$DB_USER = "root";
$DB_PASS = "123456";

$dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $stmt = $pdo->prepare("
        INSERT INTO leads (team, email, message, source)
        VALUES (:team, :email, :message, :source)
    ");

    $stmt->execute([
        ":team"    => $team,
        ":email"   => $email,
        ":message" => $message,
        ":source"  => $source
    ]);

    echo json_encode(["status" => "success"]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
