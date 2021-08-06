<?php

$db = mysqli_connect('localhost','root','','appsalon'); 

if(!$db){
    echo "Error en la conexion";
    exit; //Si llega hasta aqui para el proceso de datos y detiene la aplicación
} 

//echo "Conexion correcta";
//echo "<br/>";