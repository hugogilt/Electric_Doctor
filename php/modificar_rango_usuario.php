<?php
// Habilitar la visualización de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Incluir el archivo de conexión
require '../config/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener el ID del usuario
        $id_usuario = isset($_POST['id_usuario']) ? $_POST['id_usuario'] : null;

        if (!$id_usuario) {
            echo json_encode(['status' => 'error', 'message' => 'ID de usuario no proporcionado.']);
            exit;
        }

        // Obtener el rol actual del usuario
        $query = "SELECT Rol FROM Usuarios WHERE ID_Usuario = ?";
        $stmt = $conexion->prepare($query);
        $stmt->execute([$id_usuario]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado.']);
            exit;
        }

        // Cambiar el rol
        $nuevo_rol = ($usuario['Rol'] === 'cliente') ? 'admin' : 'cliente';

        // Actualizar el rol del usuario
        $updateQuery = "UPDATE Usuarios SET Rol = ? WHERE ID_Usuario = ?";
        $updateStmt = $conexion->prepare($updateQuery);
        $updateStmt->execute([$nuevo_rol, $id_usuario]);

        echo json_encode(['status' => 'success', 'message' => 'Rol de usuario actualizado correctamente.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
