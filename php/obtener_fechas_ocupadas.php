<?php
include('../config/conexion.php');

// Consultar las fechas ocupadas
$query = "SELECT Fecha_Hora FROM Disponibilidad_Citas WHERE Estado = 'ocupada'";
$result = mysqli_query($conn, $query);

// Crear un array con las fechas ocupadas
$ocupadas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $ocupadas[] = $row['Fecha_Hora'];
}

// Devolver las fechas ocupadas como JSON
echo json_encode($ocupadas);
?>
