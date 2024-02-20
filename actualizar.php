<?php
$servidor = "localhost"; // Por ejemplo, "localhost" si está en el mismo servidor
$usuario = "root";
$contrasena = "";
$basedatos = "games";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $contrasena, $basedatos);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
$sql = "SELECT * FROM puntajes order by puntaje desc limit 6";

$result = $conn->query($sql);

$conn->close();
?>

<?php if ($result->num_rows > 0) : ?>
    <table class='table'>
        <thead>
            <tr>
                <th>Player</th>
                <th>Puntuacion</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = $result->fetch_assoc()) : ?>
                <tr scope='row'>
                    <td><?php echo $row["player"]; ?></td>
                    <td><?php echo $row["puntaje"]; ?></td>
                    <td><?php echo $row["fecha"]; ?></td>
                </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
<?php else : ?>
    <table class='table'>
        <thead>
            <tr>
                <th>Player</th>
                <th>Puntuacion</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            <tr scope='row'>
                <td colspan='3' class='no-data'>Sin Puntución</td>
            </tr>
        </tbody>
    </table>
<?php endif; ?>