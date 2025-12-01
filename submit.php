<?php
// Backend endpoint for handling JSON form submissions
// Configure database connection
$host = 'localhost';
$db   = 'final_project';
$user = 'root';
$pass = '123456';
$charset = 'utf8mb4';

// Basic CORS and content headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Read and decode the incoming JSON payload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

// Keep only fields that exist in the leads table
$allowedFields = [
    'team',      // inline form
    'email',
    'message',
    'source',
    'company',   // modal form
    'name',
    'phone',
    'product',
    'quantity',
    'samples'
];

$filtered = array_intersect_key($data, array_flip($allowedFields));
if (empty($filtered)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No valid fields provided']);
    exit;
}

$columns = array_keys($filtered);
$placeholders = array_map(fn($col) => ':' . $col, $columns);

// Prepare DSN and PDO options
$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $sql = sprintf(
        'INSERT INTO leads (%s) VALUES (%s)',
        implode(', ', $columns),
        implode(', ', $placeholders)
    );

    $stmt = $pdo->prepare($sql);
    foreach ($filtered as $field => $value) {
        // Bind values, using null for empty strings to keep database flexible
        $stmt->bindValue(':' . $field, $value === '' ? null : $value, PDO::PARAM_STR);
    }

    $stmt->execute();

    echo json_encode([
        'success' => true,
        'id' => $pdo->lastInsertId(),
        'message' => 'Lead stored successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'details' => $e->getMessage(),
    ]);
}
