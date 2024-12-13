<?php
session_start();

$response = array();

if (isset($_SESSION['rol'])) {
    $response['rol'] = $_SESSION['rol'];
} else {
    $response['rol'] = 'not-rol';
}

echo json_encode($response);
?>
