<?php
header("Content-Type: application/json");

// Incluir archivo de conexión a la base de datos
include_once('../config/conexion.php');

try {
    // Obtener el identificador del usuario desde el cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        throw new Exception("Debe proporcionar un ID para verificar.");
    }

    // Preparar la consulta para buscar al usuario por ID
    $stmt = $conexion->prepare("SELECT Verificado FROM Usuarios WHERE ID_Usuario = :id");
    $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);

    // Ejecutar la consulta
    $stmt->execute();
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        switch ($resultado['Verificado']) {
            case 0:
                echo json_encode(["status" => "non-verified"]);
                break;
            case 1:
                echo json_encode(["status" => "verified"]);
                break;
            default:
                echo json_encode(["status" => "unknown", "message" => "Valor de verificado no reconocido"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
