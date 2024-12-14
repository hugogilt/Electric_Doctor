<?php
session_start();

// Incluir los archivos necesarios
require '../config/conexion.php';

$response = [
    'status' => 'error',
    'message' => '',
];

// Verificar si el token está presente en la URL
if (!isset($_GET['token'])) {
    $response['message'] = 'Token no proporcionado.';
    die($response['message']);
}

$token = $_GET['token'];

try {
    // Verificar si el token es válido
    $query = "SELECT ID_Usuario FROM Usuarios WHERE Token = ?";
    $stmt = $conexion->prepare($query);
    $stmt->execute([$token]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        $response['message'] = 'Token no válido o expirado.';
        die($response['message']);
    }

    // Verificar si se ha enviado el formulario con la nueva contraseña
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (empty($_POST['nueva_contraseña']) || strlen($_POST['nueva_contraseña']) < 8) {
            $response['message'] = 'La contraseña debe tener al menos 8 caracteres.';
        } else {
            // Encriptar la nueva contraseña
            $nueva_contraseña = password_hash($_POST['nueva_contraseña'], PASSWORD_DEFAULT);

            // Actualizar la contraseña en la base de datos
            $query = "UPDATE Usuarios SET Contrasena = ?, Token = NULL WHERE Token = ?";
            $stmt = $conexion->prepare($query);
            $stmt->execute([$nueva_contraseña, $token]);

            if ($stmt->rowCount() > 0) {
                $response['status'] = 'success';
                $response['message'] = 'Contraseña restablecida con éxito.';
            } else {
                $response['message'] = 'Hubo un error al actualizar la contraseña.';
            }
        }
    }
} catch (Exception $e) {
    $response['message'] = 'Error al procesar la solicitud: ' . $e->getMessage();
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 50px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            color: #333;
        }
        input[type="password"] {
            width: 100%;
            padding: 10px 0;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        .alert {
            color: red;
            text-align: center;
        }
        .success {
            color: green;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Restablecer Contraseña</h2>

    <?php if ($response['status'] == 'success'): ?>
        <p class="success"><?= $response['message']; ?></p>
        <a href="https://electric-doctor.infinityfreeapp.com">Volver a la web</a>
    <?php else: ?>
        <p class="alert"><?= $response['message']; ?></p>
    <?php endif; ?>

    <?php if ($response['status'] !== 'success'): ?>
        <!-- Si el token es válido, mostrar el formulario de nueva contraseña -->
        <form method="POST" action="reset_password.php?token=<?= $token ?>">
            <input type="password" name="nueva_contraseña" placeholder="Nueva contraseña" required>
            <button type="submit">Restablecer contraseña</button>
        </form>
    <?php endif; ?>

</div>

</body>
</html>
