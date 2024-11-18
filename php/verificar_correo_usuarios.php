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

    // Verificar que el correo esté presente
    if (isset($data->correo)) {
        $correo = $data->correo;
        
        try {
            // Consulta para verificar si el correo ya existe y obtener el ID_Usuario
            $sql = "SELECT ID_Usuario FROM Usuarios WHERE Correo_Electronico = :correo";
            $stmt = $conexion->prepare($sql);

            // Vincular el parámetro
            $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $stmt->execute();

            // Obtener el resultado
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Si el correo existe
            if ($user) {
                $response['status'] = 'exists';
                $response['message'] = 'El correo ya está registrado.';
                $response['id_usuario'] = $user['ID_Usuario']; // Añadir el ID_Usuario al response
            } else {
                // Si el correo no existe
                $response['status'] = 'not_exists';
                $response['message'] = 'El correo no está registrado.';
            }
        } catch (PDOException $e) {
            // Si hay un error en la consulta
            $response['status'] = 'error';
            $response['message'] = 'Error: ' . $e->getMessage();
        }
    } else {
        // Si no se recibe el correo
        $response['status'] = 'error';
        $response['message'] = 'No se ha recibido el correo electrónico.';
    }

    // Enviar la respuesta como JSON
    echo json_encode($response);
}
?>
