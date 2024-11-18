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
            // Preparar la consulta SQL para insertar los datos en la tabla de Clientes
            $sql = "INSERT INTO Clientes (nombre, apellidos, telefono, correo_electronico, marca_vehiculo, anio_matriculacion, problema, fecha_cita) 
                    VALUES (:nombre, :apellidos, :telefono, :correo_electronico, :marca_vehiculo, :anio_matriculacion, :problema, :fecha_cita)";
            
            // Preparar la declaración
            $stmt = $conexion->prepare($sql);

            // Vincular los parámetros con los valores
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellidos', $apellidos);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':correo_electronico', $correo);
            $stmt->bindParam(':marca_vehiculo', $marca);
            $stmt->bindParam(':anio_matriculacion', $anio);
            $stmt->bindParam(':problema', $problema);
            $stmt->bindParam(':fecha_cita', $fechaHora);

            // Ejecutar la consulta
            $stmt->execute();

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
