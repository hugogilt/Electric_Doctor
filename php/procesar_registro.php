<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Incluir el archivo de conexión
include '../config/conexion.php';

// Definir una respuesta en formato JSON
$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los valores del formulario
    $nombre = $_POST['nombre'];
    $apellidos = $_POST['apellidos'];
    $correo = $_POST['correo'];
    $telefono = $_POST['telefono'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Validar que las contraseñas coinciden
    if ($password !== $confirmPassword) {
        $response['status'] = 'error';
        $response['message'] = 'Las contraseñas no coinciden.';
        echo json_encode($response);
        exit;
    }

    // Encriptar la contraseña antes de guardarla
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Preparar la consulta SQL para insertar los datos en la tabla de usuarios
        $sql = "INSERT INTO Usuarios (nombre, apellidos, correo_electronico, telefono, contrasena) 
                VALUES (:nombre, :apellidos, :correo_electronico, :telefono, :contrasena)";
        
        // Preparar la declaración
        $stmt = $conexion->prepare($sql);

        // Vincular los parámetros con los valores
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellidos', $apellidos);
        $stmt->bindParam(':correo_electronico', $correo);
        $stmt->bindParam(':telefono', $telefono);
        $stmt->bindParam(':contrasena', $passwordHash);

        // Ejecutar la consulta
        $stmt->execute();

        // Si la inserción fue exitosa
        $_SESSION['nombre'] = $_POST['nombre'];  // Guardamos el nombre del usuario
        $_SESSION['apellidos'] = $_POST['apellidos'];  // Guardamos los apellidos del usuario
        $_SESSION['correo'] = $_POST['correo'];  // Guardamos el correo del usuario
        $_SESSION['telefono'] = $_POST['telefono'];  // Guardamos el telefono del usuario
        $response['status'] = 'success';
        $response['message'] = 'Usuario registrado exitosamente!';
    } catch (PDOException $e) {
        // Si hay un error en la inserción
        $response['status'] = 'error';
        $response['message'] = 'Error: ' . $e->getMessage();
    }

    // Enviar la respuesta como JSON
    echo json_encode($response);
}
?>
