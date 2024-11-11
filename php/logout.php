<?php
session_start(); // Iniciar la sesión si no se ha hecho antes

// Eliminar todas las variables de sesión
session_unset();

// Destruir la sesión
session_destroy();

// Responder con un estado de éxito para que JS lo maneje
echo json_encode(['status' => 'success']);
?>
