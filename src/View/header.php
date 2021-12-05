
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="bootstrap-4.4.1-dist/css/bootstrap.min.css">
    <script src="https://kit.fontawesome.com/3abda6768c.js" crossorigin="anonymous"></script>
    <script src="js/script.js"></script>
    <script src="js/jquery-3.3.1.js"></script>
    <title>부산 국제 뮤직 페스티벌 뮤직 플레이어</title>
</head>
<body>
    <div class="popup" id="pop1">  
        <div class="title-box">
            <a href="/"><i class="fa fa-times"></i></a>
            <h4>Log in</h4>
            <div class="icon-box">
                <i class="fab fa-facebook-f"></i>
                <i class="fab fa-twitter"></i>
                <i class="fab fa-google-plus-g"></i>
            </div>
            <div class="form-box">
                <input class="id" type="text" name="id" placeholder="아이디">
                <input class="password" type="password" name="password" placeholder="비밀번호">
                <p>Forgot <b>Password?</b></p>
                <button class="login_btn">LOGIN</button>
                <span>Don't have an account? <b>Sign up</b></span>
            </div>
        </div>
    </div>
    <div class="dim"></div>
<div class="wrap">
    <div class="main-wrapper">
        <div class="player">
            <div class="play-img-box">
                <img class="logo" src="image/logo2.png" alt="">
            </div>
            <div class="play-list-box">
                <li><a data-href="/" class="link">Home</a></li>
                <li><a data-href="/library" class="link">Library</a></li>
                <li><a data-href="/queue" class="link">Queue</a></li>
                <?php if(user()-> checkLogin()): ?>
                    <li class="logout_btn">Logout</li>
                <?php else: ?>
                <li><a href="#pop1">Login</a></li>
                <?php endif; ?>
            </div>
            <div>
                <div class="cover">
                    <div id="lyric">
                        <div class="info">
                            <h6 class="title mb-1"></h6>
                        </div>
                        <div class="lyrics">
                        </div>
                    </div>
                 </div>
                <div class="title"></div>
            </div>
        
            </div> 
        </div>
        <header>
            <div class="header-wrapper">
               
                <div class="search">
                    <form action="">
                        <input type="text" placeholder="음악을 검색하세요.">
                        <button class="sc-btn"><i class="fa fa-search"></i></button>
                    </form>
                </div>
                <div class="right-nav">
                    <nav>
                        <ul class="nav">
                        </ul>   
                    </nav>
                </div>
            </div>
        </header>