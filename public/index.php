<?php 
ob_start();
session_start();

function session() {
    return new \Jine\App\Session();
}

function user() {
    return new \Jine\App\User();
}

define("__ROOT", dirname(__DIR__));
define("__SRC", __ROOT . "/src");

include_once __ROOT . "/autoload.php";
include_once __ROOT . "/helper.php";
include_once __ROOT . "/web.php";

Jine\App\Router::route();