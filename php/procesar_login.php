<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../config/conexion.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $password = $_POST['password'];

    try {
        $sql = "SELECT contrasena FROM Usuarios WHERE correo_electronico = :correo_electronico";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':correo_electronico', $correo);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['contrasena'])) {
            $response['status'] = 'success';
            $response['message'] = 'Inicio de sesión exitoso';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Credenciales incorrectas';
        }
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Error: ' . $e->getMessage();
    }

    echo json_encode($response);
}
?>
