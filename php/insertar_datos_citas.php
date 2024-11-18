<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Incluir el archivo de conexión
include '../config/conexion.php';

// Definir una respuesta en formato JSON
$response = array();

// Comprobar que es una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario que vienen en formato JSON
    $data = json_decode(file_get_contents("php://input"));

    // Verificar que los datos necesarios estén presentes
    if (
        isset($data->nombre) && isset($data->apellidos) && isset($data->telefono) &&
        isset($data->correo) && isset($data->marca) && isset($data->anio) &&
        isset($data->problema) && isset($data->fechaHora)
    ) {
        // Asignar los datos a variables
        $nombre = $data->nombre;
        $apellidos = $data->apellidos;
        $telefono = $data->telefono;
        $correo = $data->correo;
        $marca = $data->marca;
        $anio = $data->anio;
        $problema = $data->problema;
        $fechaHora = $data->fechaHora;

        try {
            // Insertar datos del cliente en la tabla Clientes
            $sql_cliente = "INSERT INTO Clientes (Nombre, Apellidos, Telefono, Correo_electronico) 
                            VALUES (:nombre, :apellidos, :telefono, :correo_electronico)";
            
            // Preparar la declaración
            $stmt_cliente = $conexion->prepare($sql_cliente);

            // Vincular los parámetros con los valores
            $stmt_cliente->bindParam(':nombre', $nombre);
            $stmt_cliente->bindParam(':apellidos', $apellidos);
            $stmt_cliente->bindParam(':telefono', $telefono);
            $stmt_cliente->bindParam(':correo_electronico', $correo);

            // Ejecutar la consulta para insertar en Clientes
            $stmt_cliente->execute();

            // Obtener el ID del cliente recién insertado
            $id_cliente = $conexion->lastInsertId();

            // Insertar datos de la cita en la tabla Citas
            $sql_cita = "INSERT INTO Citas (ID_Cliente, Modelo_Vehiculo, Ano_Matriculacion, Motivo, Fecha_Hora) 
                         VALUES (:id_cliente, :marca_vehiculo, :anio_matriculacion, :problema, :fecha_cita)";
            
            // Preparar la declaración
            $stmt_cita = $conexion->prepare($sql_cita);

            // Vincular los parámetros con los valores
            $stmt_cita->bindParam(':id_cliente', $id_cliente);
            $stmt_cita->bindParam(':marca_vehiculo', $marca);
            $stmt_cita->bindParam(':anio_matriculacion', $anio);
            $stmt_cita->bindParam(':problema', $problema);
            $stmt_cita->bindParam(':fecha_cita', $fechaHora);

            // Ejecutar la consulta para insertar en Citas
            $stmt_cita->execute();

            // Si la inserción fue exitosa
            $response['status'] = 'success';
            $response['message'] = 'Cita registrada exitosamente!';
        } catch (PDOException $e) {
            // Si hay un error en la inserción
            $response['status'] = 'error';
            $response['message'] = 'Error: ' . $e->getMessage();
        }
    } else {
        // Si faltan datos
        $response['status'] = 'error';
        $response['message'] = 'Faltan datos en la solicitud.';
    }

    // Enviar la respuesta como JSON
    echo json_encode($response);
}
?>
