<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    try {
        // Incluir la configuración de conexión
        include '../../../config/conexion.php';
        
        // Preparar la consulta para buscar al usuario por el token de verificación
        $sql = "SELECT * FROM usuarios WHERE verification_token = :token LIMIT 1";
        $query = $pdo->prepare($sql);

        // Vincular el parámetro :token
        $query->bindParam(':token', $token);
        
        // Ejecutar la consulta
        $query->execute();
        
        // Obtener el usuario
        $usuario = $query->fetch();

        if ($usuario) {
            // Preparar la consulta para actualizar el estado de verificación
            $update = $pdo->prepare("UPDATE usuarios SET Verificado = 1, verification_token = NULL WHERE id = :id");
            
            // Vincular el parámetro :id
            $update->bindParam(':id', $usuario['id']);
            
            // Ejecutar la actualización
            $update->execute();
            
            echo "Correo verificado correctamente.";
        } else {
            echo "Token inválido o ya utilizado.";
        }

    } catch (PDOException $e) {
        // Si hay un error en la consulta o la conexión
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "No tengo token";
}
?>
