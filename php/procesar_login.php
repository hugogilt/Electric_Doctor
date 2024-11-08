<?php
require '../config/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'];
    $password = $_POST['password'];

    // Verificar si la conexión a la base de datos está activa
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    // Buscar el usuario en la base de datos
    $sql = "SELECT ID_Usuario, Contraseña FROM Usuarios WHERE Correo = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["status" => "error", "message" => "Error al preparar la consulta de inicio de sesión: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id_usuario, $hashedPassword);

    if ($stmt->num_rows > 0) {
        $stmt->fetch();
        if (password_verify($password, $hashedPassword)) {
            echo json_encode(["status" => "success", "message" => "Inicio de sesión exitoso"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Correo no encontrado"]);
    }

    $stmt->close();
    $conn->close();
}
?>
