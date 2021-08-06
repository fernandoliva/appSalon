<?php

function obtenerServicios() : array{
    try{
        //Importar conexion
        require 'database.php';
        //Escribir SQL
        $sql = "SELECT * FROM servicios;";
        $consulta = mysqli_query($db, $sql);
        

        //Array vacio
        $servicios = [];
        $i = 0;

        //Obtener resultados

        //echo "<pre>";
        //var_dump(mysqli_fetch_assoc($consulta)); //mysqli_fetch_assoc convierte la consulta a un formato json, sin un bucle while solo devuelve el primer resultado
        //echo "</pre>";

        while ($row = mysqli_fetch_assoc($consulta)){
            //echo "<pre>";
            //var_dump($row);
            //echo "</pre>";

            $servicios[$i]['id'] = $row['id']; //[$i]['id'] Se le indica la posicion de columna en el $i
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];
            $i++;
        }

        //echo "<pre>";
        //var_dump($servicios);
        //echo "</pre>";

        return $servicios;
    } catch (\Throwable $th){
        //throw $th;
        var_dump($th);
    }
}

//obtenerServicios();