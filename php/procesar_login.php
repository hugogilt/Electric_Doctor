<?php
session_start();  // Inicia la sesión
ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../config/conexion.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $password = $_POST['password'];

    try {
        $sql = "SELECT nombre, contrasena FROM Usuarios WHERE correo_electronico = :correo";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verificamos la contraseña
            if (password_verify($password, $user['contrasena'])) {
                // Guardamos la información del usuario en la sesión
                $_SESSION['nombre'] = $user['nombre'];  // Guardamos el nombre del usuario
                $_SESSION['correo'] = $correo;  // Guardamos el nombre del usuario
                $_SESSION['is_logged_in'] = true;           // Marcamos como logueado

                // Respuesta de éxito
                $response['status'] = 'success';
                $response['message'] = 'Inicio de sesión exitoso';
                $response['nombre'] = $user['nombre'];
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Contraseña incorrecta';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Correo electrónico no encontrado';
        }
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Error en la consulta: ' . $e->getMessage();
    }
    echo json_encode($response);
}
?>
