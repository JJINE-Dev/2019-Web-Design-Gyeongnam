<?php

namespace Jine\App;

class DB {
    private static $db = null;
    private static function getDB() 
    {
        if(is_null(self::$db)) {
            self::$db = new \PDO("mysql:host=localhost;dbname=music_player;charset=utf8mb4", "root", "");
        }
        return self::$db;
    }

    public static function execute(string $sql, array $data = []) : int 
    {
        $q = self::getDB()->prepare($sql);
        return $q->execute($data);
    }

    public static function fetch($sql, $data = [], $mode = \PDO::FETCH_OBJ)
    {
        $q = self::getDB()->prepare($sql);
        $q->execute($data);
        return $q->fetch($mode);
    }

    public static function fetchAll($sql, $data = [], $mode = \PDO::FETCH_OBJ)
    {
        $q = self::getDB()->prepare($sql);
        $q->execute($data);
        return $q->fetchAll($mode);
    }

}