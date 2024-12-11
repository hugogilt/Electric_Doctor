<?php

require_once '../config/conexion.php'; 

header("Content-Type: application/json");

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer los datos enviados en el cuerpo de la solicitud
    $input = json_decode(file_get_contents('php://input'), true);

    // Validar que todos los datos requeridos estén presentes
    if (
        isset($input['id']) &&
        isset($input['nombre']) &&
        isset($input['apellidos']) &&
        isset($input['telefono']) &&
        isset($input['correo'])
    ) {
        $id = $input['id'];
        $nombre = $input['nombre'];
        $apellidos = $input['apellidos'];
        $telefono = $input['telefono'];
        $correo = $input['correo'];

        try {
            // Consultar el correo actual del usuario
            $queryCorreo = "SELECT Correo_Electronico FROM Usuarios WHERE ID_Usuario = :id";
            $stmtCorreo = $conexion->prepare($queryCorreo);
            $stmtCorreo->bindParam(':id', $id);
            $stmtCorreo->execute();
            $correoActual = $stmtCorreo->fetchColumn();

            if ($correoActual === false) {
                echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
                exit;
            }

            // Comprobar si el correo ha sido modificado
            $correoModificado = $correoActual !== $correo;

            // Preparar la consulta SQL para actualizar el usuario
            $query = "UPDATE Usuarios 
                      SET Nombre = :nombre, Apellidos = :apellidos, Telefono = :telefono, Correo_Electronico = :correo 
                      WHERE ID_Usuario = :id";

            $stmt = $conexion->prepare($query);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellidos', $apellidos);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':correo', $correo);
            $stmt->bindParam(':id', $id);

            // Ejecutar la consulta de actualización principal
            if ($stmt->execute()) {
                // Si el correo ha sido modificado, actualizar la columna Verificado a 0
                if ($correoModificado) {
                    $queryVerificado = "UPDATE Usuarios SET Verificado = 0 WHERE ID_Usuario = :id";
                    $stmtVerificado = $conexion->prepare($queryVerificado);
                    $stmtVerificado->bindParam(':id', $id);
                    $stmtVerificado->execute();
                }

                echo json_encode([
                    "success" => true,
                    "message" => "Usuario actualizado correctamente",
                    "correoModificado" => $correoModificado
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al actualizar el usuario"]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Error del servidor: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
