<?php
// Datos de conexión (estos datos los tomas de FreeMySQL)
$host = "sql103.infinityfree.com"; // Reemplaza con el host de tu base de datos
$dbname = "if0_37672260_electric_doctor"; // Reemplaza con el nombre de tu base de datos
$user = "if0_37672260"; // Reemplaza con tu usuario
$password = "f43Xvg8mKF"; // Reemplaza con tu contraseña

try {
    // Conexión a la base de datos usando PDO
    $conexion = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    // Establecer el modo de error para que PDO lance excepciones si ocurre algún error
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si hay un error de conexión, lo mostramos
    echo "Error en la conexión: " . $e->getMessage();
}
?>
