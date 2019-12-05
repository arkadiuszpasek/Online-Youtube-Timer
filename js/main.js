let player;
let interval;
const timer = document.getElementById('timer-txt');
const audio = new Audio('https://raw.githubusercontent.com/arkadiuszpasek/Online-Youtube-Timer/master/res/w3QuestSound.mp3');
const defaultTitle = 'Youtube Pomodoro Timer';
// audio.volume = 0.5;
let minutes, seconds;

document.querySelector("#urlInp").value = localStorage.getItem("yturl");

document.getElementById('startBtn').addEventListener('click', () => {
    timer.innerText = document.getElementById('timeInp').value;
    minutes = timer.innerText;
    seconds = 0;

    clearInterval(interval);
    interval = setInterval(decreaseTimer, 1000);

    if(player == undefined)
        startPlayer();
    else if(localStorage.getItem("yturl") !=  document.querySelector("#urlInp").value)
        loadVideo();
});

function decreaseTimer(){
    if(minutes <= 0 && seconds <= 1){
        clearInterval(interval);
        timer.innerText = "";
        document.title = defaultTitle;
    
        audio.play();
        return;
    }


    if(seconds <= 0){
        seconds = 60;
        --minutes;
    }
    --seconds;

    if(seconds > 9)
        timer.innerText = `${minutes}:${seconds}`;
    else
        timer.innerText = `${minutes}:0${seconds}`;

    document.title = `${timer.innerText} - ${defaultTitle}`;
}

function loadVideo(){
    const url = document.getElementById('urlInp').value;

    if(url != "" && localStorage.getItem("yturl") != url)
    localStorage.setItem("yturl",url);
    
    let videoId_ = getPlaylistId(url);
    if(videoId_){
        player.loadPlaylist({
            list: videoId_,
            listType: 'playlist',
            index: -1,
            startSeconds: 0
        })
    }
    else{
        videoId_ = getVideoId(url);
        videoId_ = videoId_ ? videoId_ : 'GdzrrWA8e7A';

        player.loadVideoById({
            videoId: videoId_,
            startSeconds: 0
        })
    }
    
}

function startPlayer(){
    let width_ = 426, height_ = 240;

    if(document.documentElement.clientWidth > 1280){
        width_ = 640;
        height_ = 360;
    }

    const url = document.getElementById('urlInp').value;

    localStorage.setItem("yturl",url);

    let videoId_ = getPlaylistId(url);

    if(videoId_){
        player = new YT.Player('player', {
            height: height_,
            width: width_,
            playerVars: 
            {
              listType:'playlist',
              list: videoId_
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onStateChange
            }
        });
    }
    else{
        videoId_ = getVideoId(url);
        videoId_ = videoId_ ? videoId_ : 'GdzrrWA8e7A';

        player = new YT.Player('player', {
            height: height_,
            width: width_,
            videoId: videoId_,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onStateChange
            },
        });
    }
}

function onStateChange(event){
    if(player.getPlayerState() == 0)
        player.playVideo();
}

function onPlayerReady(event) {
    player.seekTo(0, true); 
    player.setVolume(50);
    document.getElementById('player').style.visibility = 'visible';

    player.playVideo();
    player.setLoop(true);
}

function getPlaylistId(ytUrl){
    const match = ytUrl.match(/^.*(?:youtu.*\/*list=)(.*?)(?:(?=&|$))/);
    return match ? match[1] : "";
}

function getVideoId(ytUrl){
    match = ytUrl.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return (match && match[2].length == 11)? match[2] : "";
}