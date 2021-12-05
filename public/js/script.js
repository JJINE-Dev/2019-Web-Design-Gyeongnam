let app;
let player;
const ls = localStorage;

function ls_get(name){
    return ls.getItem(name) || false;
}

function ls_set(name, value){
    return ls.setItem(name, JSON.stringify(value));
}

function classToggle(value, target, className){
    if(value) target.classList.add(className)
    else target.classList.remove(className);  
}

location.getValue = function(){  
    let v = this.search;
    let result = {};
    while(/(?<key>[^?&=]+)=(?<value>[^?&=]+)/ig.test(v)){
        let matches = /(?<key>[^?&=]+)=(?<value>[^?&=]+)/ig.exec(v);
        let {key, value} = matches.groups;
        result[key] = value;
        v = v.substr(v.indexOf(matches[0]) + matches[0].length);
    }
    return result;
}

String.prototype.toClockNumber = function(){
    if( /(?<hour>[0-9]{2}):(?<min>[0-9]{2}):(?<sec>[0-9]{2}),(?<ms>[0-9]{3})/.test(this) == false) return 0;

    let matches = /(?<hour>[0-9]{2}):(?<min>[0-9]{2}):(?<sec>[0-9]{2}),(?<ms>[0-9]{3})/.exec(this).groups;
    return parseInt(matches.hour) * 3600 + parseInt(matches.min) * 60 + parseInt(matches.sec) + parseFloat(`0.${matches.ms}`);
}

Number.prototype.toClockTime = function(){
    let min = parseInt(this / 60);
    let sec = parseInt(this % 60);
    if(sec < 10) sec = "0" + sec;

    return `${min}:${sec}`;
};

const actions = {
    index: () => {
        let musicList = app.musicList;
        let rows = [];
        let $mainRow = document.querySelector(".content-box");
        $mainRow.innerHTML = "";

        let $popularBox = document.createElement("div");
        $popularBox.classList.add("recom-box")
        $popularBox.innerHTML = `   
                                    <h3>추천 음악</h3>
                                    <p>당신이 원하는 음악 컨텐츠를 즐겨주세요.</p>
                                    <div class="rem-grid">

                                    </div> `;
        
        let _musicList = musicList.slice(0);
        for(let i = 0; i < 7; i++) {
            let item = _musicList.splice(Math.floor(Math.random() * _musicList.length), 1)[0];
            let element = document.createElement("div");
            element.innerHTML = `<div class="item item0 has-context" data-context="openPlaylist nextPlay addQueue">
                                        <div class="mask">
                                            <i class="fa fa-play"></i>
                                        </div>
                                        <img src="covers/${item.albumImage}" alt="">
                                        <div class="text-box">
                                            <div class="title">${item.name}</div>
                                            <p class="art-name">${item.artist}</p>
                                        </div>
                                    </div>`;
            element.firstChild.dataset.idx = item.idx;
            element.querySelector(".mask").addEventListener("click", ()=> indexPlay(item));
            $popularBox.querySelector(".rem-grid").append(element.firstElementChild);
  
        }
        rows.push($popularBox);
        

        musicList.forEach(item => {
            let exist = rows.find(x => x.dataset.genre === item.genre);
            let element = document.createElement("div");
            
            if(!exist){
                element.dataset.genre = item.genre;
                element.classList.add("flex-box");
                element.innerHTML = `<div class="flex">
                                        <h5>${item.genre}</h5>
                                        <div class="flex-grid">
                                            <div class="item item1 has-context" data-context="openPlaylist nextPlay addQueue" data-idx=${item.idx}>
                                                <i class="fa fa-play"></i>
                                                <img src="covers/${item.albumImage}" alt="">
                                                <div class="text-box">
                                                    <div class="title">${item.name}</div>
                                                    <p class="art-name">${item.artist}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                rows.push(element);
               
            }
            else {
                let $albumList = exist.querySelector(".flex-grid");
                element.classList.add("item", "item1", "has-context");
                element.dataset.context = "openPlaylist nextPlay addQueue";

                element.innerHTML = `<i class="fa fa-play"></i>
                                        <img src="covers/${item.albumImage}" alt="">
                                        <div class="text-box">
                                            <div class="title">${item.name}</div>
                                            <p class="art-name">${item.artist}</p>
                                        </div>`;
                $albumList.append(element);
                element.dataset.idx = item.idx;
            }
            element.querySelector(".fa-play").addEventListener("click", () => indexPlay(item));
        });
        rows.forEach((x, i) => {
            $mainRow.append(x);
        });

        setTimeout(() => {
            app.$loading.remove();
        }, 500);

        function indexPlay(item){
            player.queue = [item];
            player.playIndex = 0;
            player.$audio.src = "/music/" + item.url;
            player.$audio.currentTime = 0;
        }
    },
    library: () => {
        let $history = document.querySelector(".lib-grid");
        $history.innerHTML = "";
  
        if(player.history.length === 0) $history.innerHTML = "<div>아직 재생된 곡이 없습니다</div>";
   
        player.history.forEach(h => {
            let element = document.createElement("div");
            element.innerHTML =     `<div class="item item4 has-context" data-context="removeHistory openPlaylist playNext addQueue">
                                            <img src="./covers/${h.albumImage}" alt="">
                                            <div class="title">${h.name}</div>
                                            <p>${h.artist}</p>
                                            </div>
                                    </div>`;
            $history.append(element.firstChild);
        });

        let $container = document.querySelector(".play-grid");
        $container.innerHTML = "";
        if(Player.playList.length === 0) $container.innerHTML = "<div>아직 추가된 리스트가 없습니다</div>";
      
        console.log(Player.playList)
        Player.playList.forEach(playList => {   
                let firstItem = playList.list.length === 0 ? null : app.musicList.find(x => x.idx == playList.list[0]);
                let element = document.createElement("div");
                element.classList.add("item","item6", "link", "has-context");
                element.dataset.lcontext= "setPlaylist openPlaylist nextPlay addQueue removePlaylist";
                element.dataset.ldx = playList.idx;
                element.dataset.href="playlist.html?playlist="+playList.idx;
                element.innerHTML = `       <div class="mask">
                                                <i class="fa fa-play"></i>
                                            </div>
                                            <div class="img" ${firstItem ? "style=\"background-image: url('covers/"+ firstItem.albumImage +"')\"": ""} alt=""></div>
                                            <div class="text-box">
                                                <div class="title">${playList.name}</div>
                                                <p>노래 ${playList.list.length}곡</p>
                                            </div>
                                        `; 
                $container.append(element);
             
            });
    
            setTimeout(()=> {
                app.$loading.remove();
            }, 500);
    },
    queue: () => {
        let styleimage = document.querySelector(".que-play .play-img");
        // styleimage.style.backgroundImage()
        let queue = player.queue;
        let $container = document.querySelector(".list-grid");
        $container.innerHTML = "";

        console.log($container)
        if(queue.length === 0) $container.innerHTML = "<div class='play-m'>재생중인 음악이 없습니다.</div>";
        queue.forEach((q, i)=> {
            let element = document.createElement("div");
            element.innerHTML = `<div class="item item3 has-context ${player.playIndex === i ? "active": ""}" data-idx="${q.idx}" data-context="openPlaylist removeQueue" >
                                    <i class="fa fa-play"></i>
                                    <img src="./covers/${q.albumImage}" alt="">
                                    <p class="a">${q.name}</p>
                                    <p>${q.artist}</p>
                                    <p>●●●</p>
                                    <p>${q.duration.toClockTime()}</p>
                                </div>`;
            element.firstChild.addEventListener("click", e => {
                console.log("click");
                player.playIndex = i;
                player.$audio.src = "/music/" + q.url;
                player.$audio.currentTime = 0;
            });
            $container.append(element.firstChild);
            $container;
        });

        setTimeout(()=> {
            app.$loading.remove();
        }, 500);
    },
    playlist:() => {
        let search = location.getValue();
        console.log(Player.playList)
        let playList = Player.playList.find(({idx}) => idx == search.playlist);
        console.log(playList);
        if(!playList) {
            alert("해당 플레이리스트는 존재하지 않습니다");
            history.pushState({path: "index.html"}, null, "index.html");
            app.route("index.html");
        }

        document.querySelector("#btn-playall").addEventListener("click", ()=> player.setPlaylist({listIdx: playList.idx}));

        let $container = document.querySelector(".play-wrapper");

        $container.querySelector("h2").innerText = playList.name;
        $container.querySelector("span").innerText = playList.list.length;
    
        let $list = $container.querySelector(".artis-grid");
        $list.innerHTML = playList.list.length === 0 ? "<div>플레이리스트에 추가된 음악이 없습니다</div>" : "";
        console.log(playList.list)
        playList.list.forEach(itemIdx => {
            let item = app.musicList.find(({idx})=> itemIdx == idx);
            let element = document.createElement("div");
            element.classList.add("item", "item5", "has-context");
            element.dataset.lcontext = "openPlaylist nextPlay addQueue removePlayItem";
            element.dataset.idx = itemIdx;
            console.log(itemIdx)
            element.dataset.ldx = playList.idx;
            console.log(playList.idx)
            element.innerHTML = ` 
                                    <i class="fa fa-play"></i>
                                    <img src="./covers/${item.albumImage}" alt="">
                                    <p class="a">${item.name}</p>
                                    <p class="art-name">${item.artist}</p>
                                    <i class="fa fa-heart"></i>
                                    <i class="fa fa-share"></i>
                                    <i class="fa fa-ellipsis-h"></i>
                                `;
            element.querySelector(".fa-ellipsis-h").addEventListener("click", ()=> player.addQueue({data: item}));
            $list.append(element);
            console.log($list);
            console.log(playList.list)
        });

        setTimeout(()=> {
            app.$loading.remove();
        }, 500);
    }
}

class App {
    constructor(){
        this.list();
        this.init();
    }

    async list() {
        $.ajax({
            url: "/member",
            method: "post",
        });

        $.ajax({
            url: "/playlists",
            method: "post",
        });

        $.ajax ({
            url: "/music_list",
            method: "post"
        })

        $.ajax({
            url: "/music",
            method: "post"
        })
    }

    async init() {
        this.$container = document.querySelector(".wrap");
        this.$loading = document.createElement("div");
        this.$loading.id = "loading";
        this.$loading.innerHTML = "<div class='circle'></div>";
        document.body.append(this.$loading);

        this.musicList = await this.loadMusic();
        this.memberList = this.loadList();
        player = new Player();

        
        this.Login();
        this.loading();
        // this.search();
        this.addEvent();
    }
    
    Login() {
      
    }
    addEvent() {
        window.addEventListener("popstate", e => {
            this.route(e.state.path);
        });
     

        document.body.addEventListener("mouseup", e => {
            let exist = document.querySelector(".context-menu");
            exist && exist.remove();
        })

        document.querySelector(".login_btn").addEventListener("click", e => {
            let id = $(".id").val();
            let pw = $(".password").val();
            $.ajax({
                url: "/login",
                method: "post",
                data: {
                    "user_id" : id,
                    "password" : pw,  
                },
                success:(data)=>{
                    console.log(data);
                }
            });
        })

        document.querySelector(".logout_btn").addEventListener("click", () => {
            $.ajax({
                url: "/logout",
                method: "post",
                success:(data)=> {
                    console.log(data);
                }
            });
        })

        document.querySelector(".link-login").addEventListener("")
        document.querySelector(".fa-times").addEventListener("click", () => {

        })
    }

    loading(){
        document.body.append(this.$loading);
        this.current_page = location.pathname !== "/" ? /\/(.+)/.exec(location.pathname)[1] : "index";
        console.log(location.pathname)
        
        actions[this.current_page]();

       

        document.querySelectorAll(".has-context").forEach(item => {
            item.addEventListener("contextmenu", e => {
                e.preventDefault();
                this.openContext({e, item});
            });
        });
      

        document.querySelectorAll(".link").forEach(item => {
            item.dataset.event !== "true" && item.addEventListener("click", e => {
                let href = e.currentTarget.dataset.href;
                history.pushState({path: href}, null, href);
                this.route(href);
            });
            item.dataset.event = true;
        });
    }

    route(pathName){        
        let exist;
        exist = document.querySelector(".context-menu");
        exist && exist.remove();
        exist = document.querySelector(".playlist-context");
        exist && exist.remove();

        fetch(pathName)
        .then(v => v.text())
        .then(v => {
            console.log(pathName)
            let exist = document.querySelector(".data-wrapper");
            console.log(exist)
            let element = document.createElement("div");
            element.innerHTML = /(<div class="data-wrapper[^]*<\/div>)/.exec(v);
            this.$container.insertBefore(element.firstChild, exist);
            exist.remove();
            this.loading();
        });
    }    
    
    openContext({e, item}){
        const menuNames = {
            "nextPlay": "다음 곡으로 재생",
            "setPlaylist": "플레이리스트 재생",
            "openPlaylist": "플레이리스트에 추가",
            "removePlayItem": "플레이리스트에서 삭제",
            "removePlaylist": "플레이리스트 삭제",
            "addQueue": "대기열에 추가",
            "removeQueue" : "대기열에서 삭제"
        };
        
        let exist = document.querySelector(".context-menu");
        exist && exist.remove();
        exist = document.querySelector(".playlist-context");
        exist && exist.remove();

        let data = this.musicList.find(x => x.idx == item.dataset.idx);
        let listIdx = e.currentTarget.dataset.lcontext ? item.dataset.ldx : null; 
        console.log(e.currentTarget.dataset.lcontext)
        console.log(listIdx);
        let menuList = (e.currentTarget.dataset.context || e.currentTarget.dataset.lcontext || "").split(" ");
        let element = document.createElement("div");
        element.classList.add("context-menu");
        element.style.left = e.pageX + "px";
        element.style.top = e.pageY + "px";
        
 
        menuList.forEach(menu => {
            let menuElement = document.createElement("div");
            menuElement.classList.add("item");
            menuElement.addEventListener("mousedown", event => player[menu]({event, data, listIdx}));
            console.log(listIdx)
            menuElement.innerHTML = menuNames[menu];
            element.append(menuElement)
        });
        document.body.append(element);
   
    }

    loadMusic(){
        return new Promise(res => {
            let data = ls_get("data");
         
            if(data) res(JSON.parse(data));
            else {
                fetch("music_list.json")
                .then(data => data.json())
                .then(async data => {
                    this.musicList = await Promise.all(data.map(async x => {
                                        x.duration = await this.getDuration(x.url);
                                        return x;
                                    }));
                    ls_set("data", data);
                    res(data);
       
                });
            }
        
        });
    }
    
    loadList() {
        return new Promise(res => {
            fetch("members.json", {
                method: "POST" ,
                url: "/login",
            })
            .then(data=>data.json())
            .then(data=>console.log(data))
        })
    }

    getDuration(filename){
        return new Promise(res => {
            fetch("/music/"+filename)
            .then(data => data.arrayBuffer())
            .then(data => {
                new AudioContext().decodeAudioData(data).then(value => res(value.duration));
            });
        });
    }

}

class Player {
    static playList = [];
    constructor(){
        this.playIndex = -1;
        this.history = [];
        this.playListAi = 0;
        this.queue = [];
        this.$audio = document.createElement("audio");
        this.$audio.volume = 0.5;
        this.canPlay = false;
        this.lyric = false;
        this.l_data = [];
        this.repeat = "queue";
        this.$info = document.querySelector(".play-nav")
        this.$lyrics = document.querySelector("#lyric");
        this.$currentTime = document.querySelector(".left");
        this.$duration = document.querySelector(".right");
        this.$i_process = document.querySelector(".slider");
        this.$volume = document.querySelector(".vol");
      
        this.$i_volume = this.$volume.querySelector("input");
       
        this.$repeatBtn = document.querySelector(".state");
        this.$playBtn = document.querySelector(".player-btn .fa-play");
        this.$quePlay = document.querySelector(".que-play");

        this.addEvent();
        this.update();
        this.frame();
     
    }

    addEvent(){
        this.$audio.addEventListener("loadedmetadata", () => {
            let currentItem = this.queue[this.playIndex];
            let idx = this.history.unshift(currentItem);
            if(idx === 6) this.history.pop();
            this.$audio.pause();
            this.$audio.currentTime = 0;
            this.canPlay = true;
            this.update();
            this.$playBtn.click();

            app.current_page !== "index" && app.loading();
        });

        this.$audio.addEventListener("ended", () => {
            switch(this.repeat){
                case "current":
                    this.$audio.currentTime = 0;
                    this.$playBtn.click();
                    break;
                case "queue":
                    this.next();
                    break;
                case "none":
                    break;
            }
        });

        this.$playBtn.addEventListener("click", (e) => {
            if(this.canPlay){
                this.$audio.paused ? this.$audio.play() : this.$audio.pause();
                console.log(e.target)
                classToggle(this.$audio.paused, e.target, "fa-play")
                classToggle(!this.$audio.paused, e.target, "fa-pause")
            }
  
        });

        this.$repeatBtn.addEventListener("click", e => {
            if(this.repeat === "queue") this.repeat = "none";
            else if(this.repeat === "none") this.repeat = "current";
            else if(this.repeat === "current") this.repeat = "queue";

            this.$repeatBtn.classList.value = "fa fa-repeat state mr-3 " + this.repeat;
        });

        let volumeTime;
        this.$i_volume.addEventListener("input", e => {
            console.log("!")
            this.$audio.volume = this.$i_volume.value;
            console.log(this.$i_volume.value)
           
            this.$volume.dataset.preview = parseInt(100 * this.$i_volume.value) + "%";

            if(volumeTime) clearTimeout(volumeTime);
            volumeTime = setTimeout(() => {
                this.$volume.dataset.preview = "";
            }, 500);
        });

        let $btnLyric = document.querySelector(".fa-cc");
        $btnLyric.addEventListener("click", () => {
            this.lyric = !this.lyric;
            classToggle(this.lyric, $btnLyric, "active");
            classToggle(!this.lyric, this.$lyrics, "hidden");
        });

        this.$i_process.addEventListener("mousedown", e => {
            this.$i_process.down = true;
        });

        this.$i_process.addEventListener("input", e => {
            if(!this.canPlay) return;
            this.$audio.currentTime = this.$i_process.value;
            this.$audio.paused && this.$audio.play();
        });

        this.$i_process.addEventListener("mouseup", e => {
            this.$i_process.down = false;
        });

        document.querySelector(".prev").addEventListener("click", e => {
            if(!this.canPlay) return;
            if(this.$audio.currentTime >= 5){
                this.$audio.currentTime = 0;
            }
            else {
                this.prev();   
            }
        });

        document.querySelector(".next").addEventListener("click", e => {
            if(!this.canPlay) return;
            this.next();
        });
    }

    async update() {
        this.$repeatBtn.classList.value = "fa fa-repeat state mr-3";
        this.$repeatBtn.classList.add(this.repeat);

        if(this.canPlay === false){
            // document.querySelector(".play-img").style.backgroundImage = "";
            this.$info.querySelector("span").innerText = "재생 중인 음악이 없습니다.";
            this.$info.querySelector("p").innerText =
                document.querySelector(".right").innerText = "";
    
        }

        else {
            let item = this.queue[this.playIndex];
            let lyrics = await this.loadLyric(item.lyrics);
            let $l_box = this.$lyrics.querySelector(".info");
            $l_box.innerHTML = "";
            if(lyrics.length === 0) $l_box.innerHTML = `<p data-start="0> data-end="${item.duration}">가사가 등록되지 않은 노래입니다.</p>`;
            lyrics.forEach(l => {
                $l_box.append(l);
            });
            this.l_data = lyrics;
            document.querySelector(".play-img").style.backgroundImage = `url('covers/${item.albumImage}')`;
            this.$info.querySelector(".play-img").style.backgroundImage = `url('covers/${item.albumImage}')`;
            this.$info.querySelector(".play-img").style.backgroundSize = "cover";
           
            this.$info.querySelector("span").innerText = item.name;
            this.$info.querySelector("p").innerText = item.artist;
            this.$i_process.max = this.$audio.duration;
            this.$i_process.step = 0.1;
        }
    }

    frame(){
        let {currentTime, duration} = this.$audio;
        this.$currentTime.innerText = currentTime.toClockTime();

        if(this.canPlay){
            if(!this.$i_process.down) this.$i_process.value = currentTime;
            this.$duration.innerText = duration.toClockTime();

            try {
                let l_item = this.l_data.find(x => x !== null && x.startTime <= currentTime && currentTime <= x.endTime || x.startTime <= currentTime && x.endTime === 0);
                if(l_item){
                    if(!l_item.classList.contains("active")){
                        let exist = this.$lyrics.querySelector("p.active");
                        exist && exist.classList.remove("active");
                        l_item.classList.add("active");
                        let half = this.$lyrics.offsetHeight / 2 ;
                        console.log(half)
                        let top = l_item.offsetTop < half ? 0 : l_item.offsetTop - half ;
                        console.log(top);
                        this.$lyrics.scrollTo(0, top);
                    }
                }
                else {
                    let exist = this.$lyrics.querySelector("p.active");
                    exist && exist.classList.remove("active");
                    this.$lyrics.querySelector(".info").scrollTop(0, top);
                }
            } catch {}
        }
        else {
            this.$i_process.value = 0;
            this.$duration.innerText = "0:00";
        }

        requestAnimationFrame(() => {
            this.frame();
        });
    }

    openPlaylist({event, data, listIdx}){
        console.log(listIdx)
        let list = listIdx ? Player.playList.find(({idx}) => idx == listIdx).list : [];
        console.log(list);
        const createItem = (idx, name, checked = false) => {
            let item = document.createElement("div");
            item.classList.add("item");
            item.dataset.idx = idx;
            item.innerHTML = `<input type="checkbox" id="checkbox-${idx}"><label for="checkbox-${idx}" class="name">${name}</label>`;
           
            let checkbox = item.querySelector("input");
            checkbox.checked = checked;  

            data = listIdx ? list : data;
            checkbox.addEventListener("change", e => e.currentTarget.checked ? this.addPlayItem({listIdx: idx, data}) : this.removePlayItem({listIdx: idx, data}));
            return item;
            
        }

        let exist = document.querySelector(".playlist-context");
        exist && exist.remove();

        let element = document.createElement("div");
        element.classList.add("playlist-context");
        element.innerHTML =`<div class="buttons">
                                <button class="btn-add">새 재생목록</button>
                                <button class="btn-close">닫기</button>
                            </div>`;
        
        Player.playList.forEach(playItem => {
            console.log(playItem);
             let {idx, name} = playItem;
             let checked = listIdx ? list.every(x => playItem.list.includes(x)) : playItem.list.some(v => v == data.idx);
             element.prepend(createItem(idx, name, checked));
        });
        
        element.style.left = event.pageX + "px";
        element.style.top = event.pageY + "px";
         
        element.querySelector(".btn-add").addEventListener("click", () => {
            let idx = ++ this.playListAi;
            console.log(idx)
            let name = prompt("새 재생목록의 이름을 설정하세요.");
            name = name === "" ? "재생목록 " + idx : name;
            if(name !== null){
                Player.playList.push({idx, name, list: []});
                element.prepend(createItem(idx, name));
            } else idx--;
            if(Player.playList.find(x=> x.name == name)) return alert("중복된 재생목록 입니다.");
        });

        element.querySelector(".btn-close").addEventListener("click", () => {
            element.remove();
        });
        document.body.append(element);
        console.log(element);
    }

    setPlaylist({listIdx}){
        console.log(listIdx)
        let list = Player.playList.find(({idx}) => idx == listIdx).list.map(idx => app.musicList.find(x => x.idx == idx));
        this.queue = list;
        this.playIndex = 0;
        this.$audio.src = "/music/" + this.queue[0].url;
        console.log(this.queue, this.$audio.src);
    }

    addPlayItem = ({listIdx, data}) => {
        console.log(listIdx)
        let playList = Player.playList.find(x => x.idx == listIdx);
        console.log(playList)
        data = (Array.isArray(data) ? data : [data.idx]).filter(x => !playList.list.includes(x));
        data.forEach(x => {
            playList.list.push(x);
        });
        console.log(playList.list)
        app.current_page !== "index" && app.loading();
    }

    removePlayItem = ({listIdx, data}) => {
        let playList = Player.playList.find(x => x.idx == listIdx);
        console.log(playList,Player.playList);
        if(Array.isArray(data)){
            data.filter(i => playList.list.includes(i)).forEach(x => {
                let dataIdx = playList.list.findIndex(x => x == data.idx);    
                playList.list.splice(dataIdx, 1);
            });
        }
        else {
            console.log(data.idx);
            console.log(playList);
            let dataIdx = playList.list.findIndex(x => x == data.idx);
            if(dataIdx < 0) return alert("재생목록에 해당 음악이 없습니다.");
            playList.list.splice(dataIdx, 1);
        }
        
        app.current_page !== "index" && app.loading();
    }

    removePlaylist = ({listIdx}) => {
        let idx = Player.playList.findIndex(x => x.idx == listIdx);
        Player.playList.splice(idx, 1);
        app.loading();
    }

    next = () => {
        this.playIndex = this.playIndex + 1 >= this.queue.length ? 0 : this.playIndex + 1;
        this.$audio.src = "/music/" + this.queue[this.playIndex].url;
    }

    prev = () => {
        this.playIndex = this.playIndex - 1 < 0 ? 0 : this.playIndex - 1;
        this.$audio.src = "/music/" + this.queue[this.playIndex].url;
        this.$audio.currentTime = 0;
    }

    nextPlay({listIdx, data}){
        if(listIdx) {
            let list = Player.playList.find(({idx}) => idx == listIdx).list.map(idx => app.musicList.find(x => x.idx == idx));
            this.queue.splice(this.playIndex + 1, 0, ...list);
        }

        else this.queue.splice(this.playIndex + 1, 0, data);
        if(this.playIndex < 0){
            this.playIndex = 0;
            this.$audio.src = "/music/" + this.queue[this.playIndex].url;
        }
    };
    addQueue({data, listIdx}){
        if(listIdx){    
            let list = Player.playList.find(({idx}) => idx == listIdx).list.map(idx => app.musicList.find(x => x.idx == idx));
            this.queue.push(...list); 
            console.log(...list)
        }
        
        else this.queue.push(data);
        console.log(data);
        if(this.playIndex < 0){
            this.playIndex = 0;
            this.$audio.src = "/music/" + this.queue[0].url;    
        }
        console.log(this.playIndex)
        console.log("addQueue", this.queue);
    }

    removeQueue = ({data}) => {
        let idx = this.queue.findIndex(x => x === data);
        this.queue.splice(idx, 1);

        if(idx !== this.playIndex) {
            idx < this.playIndex && this.playIndex--;
            app.loading();
        }

        else {
            console.log(this.playIndex, this.queue.length);
            if(this.queue.length === 0){   // 큐의 값이 없을 경우
                this.canPlay = false;
                this.$audio.src = "";
                app.loading();
                this.update();
            }   
            else { 
                if(this.playIndex === this.queue.length) this.playIndex = 0;
                this.$audio.src = "/music/" + this.queue[this.playIndex].url;
            }
        }        
        console.log("removeQueue", this.queue);
    };

    loadLyric(filename){
        return new Promise(res => {
            fetch("/lyrics/"+filename)
            .then(v => v.ok && v.text())
            .then(v => {
                if(!v) res([]);
                let regexr = /(?<no>[0-9]+)\s*(?<start>[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})\s*-->\s*(?<end>[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})\s*(?<lyric>[^\r\n]+)/
                let result = [];
                while(regexr.test(v)){
                    let groups = regexr.exec(v).groups;
                    v = v.substr(v.indexOf(groups.lyric) + groups.lyric.length);

                    let elem = document.createElement("p");
                    elem.startTime = groups.start.toClockNumber();
                    elem.endTime = groups.end.toClockNumber();
                    elem.innerText = groups.lyric;
                    result.push(elem);
                }
                res(result);
            });
        });
    }
}

window.addEventListener("load", () => {
    app = new App();
});