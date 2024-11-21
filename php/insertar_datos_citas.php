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
        $dataRespuesta = $data->dataRespuesta;

        // Primero, comprobar si ya existe una cita con la misma fecha y hora
        try {
            $sql_check_cita = "SELECT COUNT(*) FROM Citas WHERE Fecha_Hora = :fecha_cita";
            $stmt_check_cita = $conexion->prepare($sql_check_cita);
            $stmt_check_cita->bindParam(':fecha_cita', $fechaHora);
            $stmt_check_cita->execute();
            $count_citas = $stmt_check_cita->fetchColumn();

            if ($count_citas > 0) {
                // Si ya existe una cita, devolver un mensaje de error
                $response['status'] = 'error';
                $response['message'] = 'Ya existe una cita en esa fecha y hora.';
            } else {
                // Si no existe una cita, verificar si es un usuario
                if ($dataRespuesta->status == 'exists') { // si es usuario
                    $id_usuario = $dataRespuesta->id_usuario;

                    // Verificar si el usuario está verificado
                    $sql_check_verificado = "SELECT Verificado FROM Usuarios WHERE ID_Usuario = :id_usuario";
                    $stmt_check_verificado = $conexion->prepare($sql_check_verificado);
                    $stmt_check_verificado->bindParam(':id_usuario', $id_usuario);
                    $stmt_check_verificado->execute();

                    $verificado = $stmt_check_verificado->fetchColumn();

                    if ($verificado == 1) {
                        // Si el usuario está verificado, registrar la cita
                        $sql_cita = "INSERT INTO Citas (ID_Usuario, Modelo_Vehiculo, Ano_Matriculacion, Motivo, Fecha_Hora) 
                                     VALUES (:id_usuario, :marca_vehiculo, :anio_matriculacion, :problema, :fecha_cita)";
                        
                        // Preparar la declaración
                        $stmt_cita = $conexion->prepare($sql_cita);

                        // Vincular los parámetros con los valores
                        $stmt_cita->bindParam(':id_usuario', $id_usuario);
                        $stmt_cita->bindParam(':marca_vehiculo', $marca);
                        $stmt_cita->bindParam(':anio_matriculacion', $anio);
                        $stmt_cita->bindParam(':problema', $problema);
                        $stmt_cita->bindParam(':fecha_cita', $fechaHora);

                        // Ejecutar la consulta para insertar en Citas
                        $stmt_cita->execute();

                        // Si la inserción fue exitosa
                        $response['status'] = 'success';
                        $response['message'] = 'Cita registrada exitosamente!';
                    } else {
                        // Si no está verificado
                        $response['status'] = 'not-verified-user';
                        $response['message'] = 'Por favor, verifica tu correo electrónico antes de realizar la cita.';
                        $response['correo'] = $correo;
                    }
                } else { // Si no es usuario, comprobar en Clientes
                    try {
                        // Verificar si el correo electrónico ya está registrado en la tabla Clientes
                        $sql_check_cliente = "SELECT ID_Cliente, Verificado FROM Clientes WHERE Correo_electronico = :correo";
                        $stmt_check_cliente = $conexion->prepare($sql_check_cliente);
                        $stmt_check_cliente->bindParam(':correo', $correo);
                        $stmt_check_cliente->execute();

                        // Si el correo ya existe en la tabla Clientes, verificar si está verificado
                        if ($stmt_check_cliente->rowCount() > 0) {
                            $cliente = $stmt_check_cliente->fetch(PDO::FETCH_ASSOC);
                            $id_cliente = $cliente['ID_Cliente'];
                            $verificado_cliente = $cliente['Verificado'];

                            if ($verificado_cliente == 1) {
                                // Si el cliente está verificado, registrar la cita
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
                            } else {
                                // Si el cliente no está verificado
                                $response['status'] = 'not-verified-client';
                                $response['correo'] = $correo;
                            }
                        } else {
                            // Si el correo no está registrado en la tabla Clientes
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
                            // Datos del cliente guardados correctamente
                            $response['status'] = 'not-verified-client';
                            $response['correo'] = $correo;

                            }
                    } catch (PDOException $e) {
                        // Si hay un error al verificar el correo o insertar el cliente
                        $response['status'] = 'error';
                        $response['message'] = 'Error: ' . $e->getMessage();
                    }
                }
            }
        } catch (PDOException $e) {
            // Si hay un error en la consulta
            $response['status'] = 'error';
            $response['message'] = 'Error al verificar la cita: ' . $e->getMessage();
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


