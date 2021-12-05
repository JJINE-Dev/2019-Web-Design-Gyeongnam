<?php 

namespace Jine\App;

class Lib {
    public static function redirect(string $url, string $msg = "") 
    {
        $s = new Session();
        $s->set("msg", $msg);
        
        header("location: {$url}");
        exit;
    }

    public static function json($value = []) 
    {
        header("Content-Type","application/json");
        echo json_encode($value);
        exit;
    }
}