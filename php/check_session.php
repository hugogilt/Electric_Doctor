<?php
session_start();

$response = array();

if (isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
    $response['status'] = 'logged_in';
    $response['nombre'] = $_SESSION['nombre'];  // Devuelve el nombre de usuario si está logueado
} else {
    $response['status'] = 'not_logged_in';
}

echo json_encode($response);
?>
