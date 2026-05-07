<?php
session_start();

$database = 'kino_programma';

$connections = array(
    array('host' => 'localhost', 'username' => 'root', 'password' => ''),
    array('host' => 'localhost', 'username' => 'root', 'password' => 'root'),
    array('host' => '127.0.0.1', 'username' => 'root', 'password' => ''),
    array('host' => '127.0.0.1', 'username' => 'root', 'password' => 'root')
);

try {
    $pdo = null;

    foreach ($connections as $connection) {
        try {
            $pdo = new PDO(
                "mysql:host=" . $connection['host'] . ";dbname=$database;charset=utf8mb4",
                $connection['username'],
                $connection['password']
            );
            break;
        } catch (PDOException $e) {
            $pdo = null;
        }
    }

    if (!$pdo) {
        throw new PDOException('Database connection failed');
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => 'Database connection failed'));
    exit;
}
?>
