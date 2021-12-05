<?php
namespace Jine\Controller;

use Jine\App\{DB, Lib};

class UserController 
{
    public function members() {
        extract($_POST);

        $json_string = file_get_contents("members.json"); // 파일 내용 읽기 
        $queries = json_decode($json_string, true); //json 객체를 php 연관 배열로 변환 
        $qu = $queries['members'];
    
        foreach($qu as $query) {
            $id = $query['id'];
            $pw = $query['password'];
            $salt = randString(30);
            $password = hash("SHA256", $pw.$salt);
            $sql = "INSERT INTO `users` (`user_id`, `password`, `salt`) VALUES (?, ?, ?)";
            $cnt = DB::fetchAll($sql, [$id, $password, $salt]);
        }
    }

    public function loginProcess() {
        extract($_POST);
        
        if(trim($user_id) == "") {
            message("아이디는 공백일 수가 없습니다.");
            return;
        }

        if(trim($password) == "") {
            message("비밀번호는 공백일 수가 없습니다.");
            return;
        }

        $user = user()->login($user_id, $password);
         
        $sql = "SELECT * FROM `users` WHERE `user_id` = ? AND `password` ";
        $user = DB::fetch($sql, [$user_id, $password]);

        var_dump($user);
        if($user == null) {
            message("아이디와 패스워드가 일치하지 않습니다.");
            return;
        }

        session()->set("user", $user);
    }

    public function logoutProcess() {      
        user()->logout(); // unset($_SESSION['user']);
        message("로그아웃이 되었습니다.");
    }
}