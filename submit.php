<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$team     = $data["team"]     ?? null;
$name     = $data["name"]     ?? null;
$email    = $data["email"]    ?? null;
$phone    = $data["phone"]    ?? null;
$product  = $data["product"]  ?? null;
$quantity = $data["quantity"] ?? null;
$samples  = $data["samples"]  ?? null;
$message  = $data["message"]  ?? null;
$source   = $data["source"]   ?? "unknown";

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
        INSERT INTO leads 
        (team, name, email, phone, product, quantity, samples, message, source)
        VALUES
        (:team, :name, :email, :phone, :product, :quantity, :samples, :message, :source)
    ");

    $stmt->execute([
        ":team"     => $team,
        ":name"     => $name,
        ":email"    => $email,
        ":phone"    => $phone,
        ":product"  => $product,
        ":quantity" => $quantity,
        ":samples"  => $samples,
        ":message"  => $message,
        ":source"   => $source
    ]);

    echo json_encode(["status" => "success"]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
