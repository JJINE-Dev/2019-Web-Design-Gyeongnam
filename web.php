<?php

use Jine\App\Router;

Router::get("/", "MainController@index");
Router::get("/library", "MainController@library");
Router::get("/queue", "MainController@queue");
Router::get("/playlist", "MainController@playlist");

Router::post("/login", "UserController@loginProcess");

//유지
Router::post("/member", "UserController@members");
Router::post("/playlists", "MainController@playlists");
Router::post("/music_list", "MainController@music_list");
// Router::post("/login", "UserController@members");
Router::post("/logout", "UserController@logoutProcess");
Router::get("/add", "MainController@addPlaylist");
Router::get("/update", "MainController@updatePlaylist");
Router::get("/delete", "MainController@deletePlaylist");
Router::get("/recommend", "MainController@recommend");

Router::get("/search", "MainController@searchProcess");

