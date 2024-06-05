// we are going to vring some songs
// make a global variable which will be updated
let currsong = new Audio();
let songs;
let crrfolder;
async function getsongs(folder){
    crrfolder = folder
    let a  = await fetch(`http://127.0.0.1:3000/Project%202%20-%20Spotify%20Clone/${folder}`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs =[];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        
        console.log(element);
        if(element.href.endsWith(".flac")){
            songs.push(element.href.split(`${folder}`)[1]);
        }
    }

    // addding songs to songlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const s of songs) {
        // s.replaceAll("%20", " ");
        // s.split(0.s.length);
        ;
        // console.log(s.slice(0,s.length-5));
        // (s);
        songul.innerHTML  = songul.innerHTML + `<li> 
                            <img src="logo/playlist_play.svg" alt="">
                            <div class="info">
                                <div>${s.replaceAll("%20"," ")}</div>
                                <div>Tame Impala</div>
                            </div>
                            <!-- <div>Play now</div> -->
                            <img src="logo/playbar.svg" alt=""> </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        e.addEventListener("click",() => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })
    return songs;
}

const playmusic = (track) => {
//   let audio = new Audio("/Project 2 - Spotify Clone/songs_db/"+track);
    currsong.src = `${crrfolder}`+track;
//   audio.play();
    currsong.play()
    // console.log();
    play.src = 'logo/pause.svg';
    // track.replaceAll("%20"," ");
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20"," ").replaceAll(".flac","");
    // document.querySelector(".songinfo").innerHTML = track.replaceAll(".flac","");
    document.querySelector(".songtime").innerHTML;
    
    // document.querySelector(".songinfo").innerHTML +=currsong.innerText;

    
}

// convert seconds to minutes:seconds
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds)){
        return `00:00`;
    }
    // Calculate the minutes
    const minutes = Math.floor(seconds / 60);
    
    // Calculate the remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure the formatted minutes always have two digits
    const formattedMinutes = minutes < 10 ? minutes : minutes;
    
    // Ensure the formatted seconds always have two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return the formatted string
    return formattedMinutes + ':' + formattedSeconds;
}

// display all the albums onthe page
async function displayalbums(){
    let a  = await fetch(`http://127.0.0.1:3000/Project%202%20-%20Spotify%20Clone/songs_db/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let containercards = document.querySelector(".containercards");
    // console.log(anchors);
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if(e.href.includes("/songs_db")){
            let folder = (e.href.split("/").slice(-2)[0]);
            // get metadata
            let a  = await fetch(`http://127.0.0.1:3000/Project%202%20-%20Spotify%20Clone/songs_db/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            containercards.innerHTML = containercards.innerHTML+ `<div data-folder="${folder}" class="playlistcard">
            <div class="play"><img src="logo/play.svg" alt="play"></div>                     
            <img aria-hidden="false" draggable="false" loading="lazy" width="207px" src="songs_db/${folder}/cover.jpg" data-testid="card-image" alt="" class="mMx2LUixlnN_Fu45JpFB yMQTWVwLJ5bV8VGiaqU3 Yn2Ei5QZn19gria6LjZj">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
            

        }
        

    Array.from(document.getElementsByClassName("playlistcard")).forEach(e=>{
        e.addEventListener("click", async (item) => {
            console.log(item);
            songs  = await getsongs(`songs_db/${item.currentTarget.dataset.folder}/`);
        }
        )
        
    })
    
}


async function main(){
    songs  =  getsongs("/songs_db/");
    // console.log(songs)
    //display albums
    displayalbums()
    
    // event listener for the play next and prev
    play.addEventListener("click", () => {
      if(currsong.paused){
        currsong.play();
        play.src = 'logo/pause.svg'
    }
    else{
        currsong.pause();
        play.src = 'logo/playbar.svg'
    }  
    })

    // time update
    currsong.addEventListener("timeupdate",(a) => {
      console.log(currsong.currentTime, currsong.duration);
      document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currsong.currentTime)} / ${convertSecondsToMinutes(currsong.duration)}`;
      document.querySelector(".circle").style.left = (currsong.currentTime /currsong.duration)*100+"%";
    }
    )

    // gotta select the seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
      console.log(e.target.getBoundingClientRect().width
      ,e.offsetX);
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
      document.querySelector(".circle").style.left = percent + "%";
      currsong.currentTime =  (percent*currsong.duration)/100;   
    }
    )

    // hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
      document.querySelector(".left").style.left= '0%';
    }
    )
    // close 
    document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left= '-100%';
    }
    )

    // prev and next
    previous.addEventListener("click", () => {
    //   console.log('previous clicked');
    console.log(currsong);
    
      let index = songs.indexOf((currsong.src.split("/").slice(-1)[0]));
        console.log(index);
        if(index-1 >= 0){
            playmusic(songs[index-1])
        }
    }
    )
    next.addEventListener("click", () => {
        console.log(currsong);
        console.log(songs);
        
    //   console.log('previous clicked');
      let index = songs.indexOf((currsong.src.split("/").slice(-1)[0]));
        console.log(index);
        if(index+1 < songs.length){
            playmusic(songs[index+1]);
        }
        
    }
    )
   
}

main()