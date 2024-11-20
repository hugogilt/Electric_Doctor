<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir el archivo de configuración de PHPMailer
include './configurar_phpmailer.php';
include '../../../config/conexion.php';

function generarToken($longitud = 32) {
    return bin2hex(random_bytes($longitud)); // Genera un token seguro
}

// Obtener el correo electrónico del formulario
if (isset($_POST['email'])) {
    $emailUsuario = $_POST['email']; // El correo enviado desde el formulario
    $token = generarToken(); // Generar el token
} else {
    echo "No se ha proporcionado un email.";
    exit;
}

// Conectar a la base de datos (usando PDO)
try {
    // Preparar la consulta SQL para actualizar el token en la tabla de usuarios
    $sql = "UPDATE Usuarios SET Token = :token WHERE correo_electronico = :email";

    // Preparar la declaración
    $stmt = $conexion->prepare($sql);

    // Vincular los parámetros con los valores
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':email', $emailUsuario);

    // Ejecutar la consulta
    $stmt->execute();

    // Si la actualización fue exitosa
    echo "Token insertado correctamente en la base de datos.";

} catch (PDOException $e) {
    // Si hay un error en la actualización
    echo "Error al insertar el token: " . $e->getMessage();
    exit;
}

// Función para enviar un correo
function enviarCorreo($destinatario, $asunto, $cuerpo) {
    // Configurar PHPMailer
    $mail = configurarPHPMailer();
    if (!$mail) {
        echo "Error al configurar PHPMailer.";
        return;
    }

    try {
        // Añadir destinatario
        $mail->addAddress($destinatario); // Dirección de correo a la que se enviará el correo
        $mail->Subject = $asunto; // Asunto del correo
        $mail->Body    = $cuerpo; // Cuerpo del mensaje (puede ser HTML o texto)

        // Enviar el correo
        if ($mail->send()) {
            echo 'Correo enviado correctamente.';
        } else {
            echo 'Error al enviar el correo: ' . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Error al enviar el correo: {$mail->ErrorInfo}";
    }
}

$destinatario = 'torsudo@gmail.com';
$asunto = "Verifica tu cuenta";
$verification_link = "https://electric-doctor.infinityfreeapp.com/php/PHPMailer-master/src/verificar.php?token=$token";
$cuerpo = "
<html>
<head>
  <title>Verifica tu cuenta</title>
</head>
<body>
  <p>Haz clic en el enlace para verificar tu correo:</p>
  <a href='$verification_link'>Verificar mi cuenta</a>
</body>
</html>
";

enviarCorreo($destinatario, $asunto, $cuerpo);
