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

            // Ejecutar la consulta
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
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
