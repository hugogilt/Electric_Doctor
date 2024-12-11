<?php
session_start(); // Asegúrate de que la sesión esté iniciada
ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../config/conexion.php';

header('Content-Type: application/json; charset=utf-8'); // Cabecera para la respuesta en JSON

$response = array();

if (!isset($_SESSION['id_usuario'])) {
    $response['status'] = 'error';
    $response['message'] = 'No se encontró el id de usuario.';
    echo json_encode($response);
    exit;
}

$id = $_SESSION['id_usuario']; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $contraseñaActual = $_POST['contraseña_actual'] ?? null;
    $nuevaContraseña = $_POST['nueva_contraseña'] ?? null;
    $confirmarContraseña = $_POST['confirmar_contraseña'] ?? null;

    if (!$contraseñaActual || !$nuevaContraseña || !$confirmarContraseña) {
        $response['status'] = 'error';
        $response['message'] = 'Faltan datos necesarios';
        echo json_encode($response);
        exit;
    }

    try {
        // Verificar la contraseña actual
        $sql = "SELECT Contrasena FROM Usuarios WHERE ID_Usuario = :id";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (password_verify($contraseñaActual, $user['Contrasena'])) {
                $nuevaContraseñaHash = password_hash($nuevaContraseña, PASSWORD_DEFAULT);

                // Actualizar la contraseña en la base de datos
                $updateSql = "UPDATE Usuarios SET Contrasena = :nueva_contrasena WHERE ID_Usuario = :id";
                $updateStmt = $conexion->prepare($updateSql);
                $updateStmt->bindParam(':nueva_contrasena', $nuevaContraseñaHash);
                $updateStmt->bindParam(':id', $id, PDO::PARAM_INT);
                $updateStmt->execute();

                if ($updateStmt->rowCount() > 0) {
                    $response['status'] = 'success';
                    $response['message'] = 'Contraseña actualizada correctamente';
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'No se pudo actualizar la contraseña. Inténtalo más tarde.';
                }
            } else {
                $response['status'] = 'false-password';
                $response['message'] = 'La contraseña actual es incorrecta';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Usuario no encontrado';
        }
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Error en la consulta: ' . $e->getMessage();
    }

    echo json_encode($response);
    exit;
} else {
    $response['status'] = 'error';
    $response['message'] = 'Método no permitido';
    echo json_encode($response);
    exit;
}
?>
