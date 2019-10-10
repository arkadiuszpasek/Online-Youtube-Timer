let player;
let interval;
const timer = document.getElementById('timer-txt');
const audio = new Audio('https://raw.githubusercontent.com/arkadiuszpasek/Online-Youtube-Timer/master/res/w3QuestSound.mp3');
// audio.volume = 0.5;
let minutes, seconds;

document.querySelector("#urlInp").value = getCookie("yturl");
console.log(player);
function onYouTubeIframeAPIReady(){

}

document.getElementById('startBtn').addEventListener('click', () => {
    timer.innerText = document.getElementById('timeInp').value;
    minutes = timer.innerText;
    seconds = 0;

    startTimer();

    if(player == undefined)
        startPlayer();

    else if(getCookie("yturl") !=  document.querySelector("#urlInp").value)
        loadVideo();

});
 
function startTimer(){
    clearInterval(interval);
    interval = setInterval(decreaseTimer, 1000);
}

function decreaseTimer(){
    if(minutes <= 0 && seconds <= 1){
        clearInterval(interval);
        timer.innerText = "";
    
        console.log('should play audio')
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
        timer.innerText = `${minutes}:0${seconds}`
}

function loadVideo(){
    const url = document.getElementById('urlInp').value;

    if(url != "" && getCookie("yturl") != url)
        document.cookie = `yturl=${url}`
    
    let videoId_ = getPlaylistId(url);
    if(videoId_)
    {
        player.loadPlaylist({
            list: videoId_,
            listType: 'playlist',
            index: 0,
            startSeconds: 0
        })
    }
    else
    {
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

    if(url != "" && getCookie("yturl") != url)
        document.cookie = `yturl=${url}`
    
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
        console.log('videoID')
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

function getCookie(c_name) {
    var c_value = " " + document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function getPlaylistId(ytUrl){
    const playlistExp = /^.*(?:youtu.*\/*list=)(.*?)(?:(?=&|$))/;
    const match = ytUrl.match(playlistExp);
    return match ? match[1] : "";
}

function getVideoId(ytUrl){
    const idExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    match = ytUrl.match(idExp);
    return (match && match[2].length == 11)? match[2] : "";
}