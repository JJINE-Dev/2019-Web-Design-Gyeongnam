<?php 

namespace Jine\Controller;

class MasterController 
{
    public function view($page, $data = []) {
        extract($data);
        $page = __SRC."/view/$page.php";
        include_once __SRC."/view/header.php";
        include_once $page;
        include_once __SRC."/view/footer.php";
    }
}

