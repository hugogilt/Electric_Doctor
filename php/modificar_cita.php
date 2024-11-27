<?php
session_start();

// Incluir archivo de conexión a la base de datos
include_once('../config/conexion.php');

// Leer los datos JSON del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si se ha recibido el id_cita y los demás datos
if (!isset($data['id_cita']) || !isset($data['nombre']) || !isset($data['apellidos']) || !isset($data['telefono']) || !isset($data['correo']) || !isset($data['modelo']) || !isset($data['anio']) || !isset($data['problema'])) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos.']);
    exit;
}

// Obtener los valores recibidos
$id_cita = $data['id_cita'];
$nombre = $data['nombre'];
$apellidos = $data['apellidos'];
$telefono = $data['telefono'];
$correo = $data['correo'];
$modelo = $data['modelo'];
$anio = $data['anio'];
$motivo = $data['problema'];

// Iniciar transacción para asegurar consistencia
$conexion->beginTransaction();

try {
    // Preparar la consulta para obtener el ID_Usuario y ID_Cliente de la cita
    $stmt = $conexion->prepare("SELECT ID_Usuario, ID_Cliente FROM Citas WHERE ID_Cita = :id_cita");
    $stmt->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar si la cita existe
    if ($stmt->rowCount() > 0) {
        $cita = $stmt->fetch(PDO::FETCH_ASSOC);
        $id_usuario = $cita['ID_Usuario'];
        $id_cliente = $cita['ID_Cliente'];

        // Actualizar los campos de la cita
        $updateCitaStmt = $conexion->prepare("UPDATE Citas SET Modelo_Vehiculo = :modelo, Ano_Matriculacion = :anio, Motivo = :motivo WHERE ID_Cita = :id_cita");
        $updateCitaStmt->bindParam(':modelo', $modelo, PDO::PARAM_STR);
        $updateCitaStmt->bindParam(':anio', $anio, PDO::PARAM_INT);
        $updateCitaStmt->bindParam(':motivo', $motivo, PDO::PARAM_STR);
        $updateCitaStmt->bindParam(':id_cita', $id_cita, PDO::PARAM_INT);
        $updateCitaStmt->execute();

        // Comprobar si se debe actualizar la tabla Usuarios o Clientes
        if ($id_usuario !== null) {
            // Si ID_Usuario no es nulo, actualizar los datos del usuario
            $updateUsuarioStmt = $conexion->prepare("UPDATE Usuarios SET Nombre = :nombre, Apellidos = :apellidos, Telefono = :telefono, Correo_Electronico = :correo WHERE ID_Usuario = :id_usuario");
            $updateUsuarioStmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $updateUsuarioStmt->bindParam(':apellidos', $apellidos, PDO::PARAM_STR);
            $updateUsuarioStmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
            $updateUsuarioStmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $updateUsuarioStmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $updateUsuarioStmt->execute();
        } elseif ($id_cliente !== null) {
            // Si ID_Usuario es nulo pero ID_Cliente no lo es, actualizar los datos del cliente
            $updateClienteStmt = $conexion->prepare("UPDATE Clientes SET Nombre = :nombre, Apellidos = :apellidos, Telefono = :telefono, Correo_Electronico = :correo WHERE ID_Cliente = :id_cliente");
            $updateClienteStmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $updateClienteStmt->bindParam(':apellidos', $apellidos, PDO::PARAM_STR);
            $updateClienteStmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
            $updateClienteStmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $updateClienteStmt->bindParam(':id_cliente', $id_cliente, PDO::PARAM_INT);
            $updateClienteStmt->execute();
        } else {
            // Si ambos ID_Usuario e ID_Cliente son nulos, no se puede actualizar
            throw new Exception('Error: No se puede modificar la cita porque no hay un usuario ni un cliente asociado.');
        }

        // Confirmar la transacción
        $conexion->commit();
        
        // Respuesta exitosa
        echo json_encode(['status' => 'success', 'message' => 'Cita modificada correctamente.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Cita no encontrada.']);
    }
} catch (Exception $e) {
    // En caso de error, deshacer los cambios y devolver el error
    $conexion->rollBack();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
