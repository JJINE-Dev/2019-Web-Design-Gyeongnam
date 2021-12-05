<?php

namespace Jine\Controller;

use Jine\App\{DB,Lib};
class MainController extends MasterController{
    public function index() {
        $this->view("index");
    }

    public function library() {
        $this->view("library");
    }

    public function queue() {
        $this->view("queue");
    }

    public function playlist() {
        $this->view("playlist");
    }

    public function searchProcess() {
        // $k = $_GET['k'];
        // $music = DB::fe
    }

    //유지
    public function playlists() {
        extract($_POST);

        $json_string = file_get_contents("playlists.json");
        $queries = json_decode($json_string, true);
        $qu = $queries['list'];
        
        foreach($qu as $query) {
            $maker = $query['maker'];
            $list = $query['list'];

            $sql = "INSERT INTO `playlist` (`maker`, `list`, `name`) VALUES (?,?,?)";
            $cnt = DB::fetchAll($sql, [$maker, $name, $list]);
        }
    } 

    public function music_list() {
        extract($_POST);

        $json_string = file_get_contents("music_list.json");
        $queries = json_decode($json_string, true);
   
        foreach($queries as $query) {
            $name = $query['name'];
            $upload = $query['release'];
            $albumName = $query['albumName'];
            $albumImage = $query['albumImage'];
            $artist = $query['artist'];
            $url = $query['url'];
            $lyrics = $query['lyrics'];
            $genre = $query['genre'];
   
            $sql = "INSERT INTO `music` (`name`, `upload`,`albumName`, `albumImage`, `artist`, `url`, `lyrics`, `genre`) VALUES (?,?,?,?,?,?,?,?)";
            $cnt = DB::fetchAll($sql, [$name, $upload, $albumName, $albumImage, $artist, $url, $lyrics, $genre]);
        }
    }
    public function addPlaylist() {
        extract($_GET);

        $sql = "INSERT INTO `playlist` (`u_id`, `name`, `list`) VALUES (?,?,?)"; 
        $cnt = DB::execute($sql, [$u_id, $name, []]);
    }

    public function updatePlaylist() {
        
    }

    public function deletePlaylist() {

    }

}