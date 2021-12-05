<?php

namespace Jine\App;

class Router {
    private static $actions = [];  
    public static function route() 
    {
        $path = explode("?", $_SERVER['REQUEST_URI'])[0];
        foreach(self::$actions as $action) {
            $url = preg_replace('/\//', '\/', $action[0]);  
            $url = preg_replace('/\{([^{}]+)\}/', '([^\/]+)', $url);
            

            if(preg_match("/^{$url}$/", $path, $result)) {
                unset($result[0]);
                $urlAction = explode("@", $action[1]); 
                $controllerClass = "\\Jine\\Controller\\{$urlAction[0]}"; 
                $controller = new $controllerClass();
                $controller->{$urlAction[1]}(...$result);
                return;
            }
        }
        echo "404 NotFound";
    }

    public static function __callStatic($name, $args) 
    {
        $req = strtolower($_SERVER['REQUEST_METHOD']); 
        if($req == $name) {
            self::$actions[] = $args;
        }
    }
}