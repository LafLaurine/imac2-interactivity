window.onload = function() {
    function run_the_clock(){
      var date = new Date();
      let hr = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
    
      let hrPosition = hr*360/12 + ((min * 360/60)/12) ;
      let minPosition = (min * 360/60) + (sec* 360/60)/60;
      let secPosition = sec * 360/60;

      HOURHAND.style.transform = "rotate(" + hrPosition + "deg)";
      MINUTEHAND.style.transform = "rotate(" + minPosition + "deg)";
      SECONDHAND.style.transform = "rotate(" + secPosition + "deg)";
    }
    
    const HOURHAND = document.querySelector(".hour");
    const MINUTEHAND = document.querySelector(".minute");
    const SECONDHAND = document.querySelector(".second");
    
    var interval = setInterval(run_the_clock, 1000);
}

$(document.body).on('click', '#play', function () {
  const play = document.querySelector("#play");
  const audio = document.querySelector("#audio");
  if(play.getAttribute("playing")==='false'){
    console.log(audio);
    audio.play();
    play.setAttribute('src','img/stop.png');
    play.setAttribute('playing','true');
  }
  else{
    audio.pause();
    audio.currentTime =0;
    play.setAttribute('src','img/play.png');
    play.setAttribute('playing','false');
  }
});

$(document.body).on('click', '#more', function () {
  const info = document.querySelector("#info");
  info.classList.remove("invisible");
  info.classList.add("visible");
  const cover = document.querySelector("#cover");
    cover.classList.remove("invisible");
  cover.classList.add("visible");
});

$(document.body).on('click', '#close', function () {
  const info = document.querySelector("#info");
  info.classList.remove("visible");
  info.classList.add("invisible");
  const cover = document.querySelector("#cover");
  cover.classList.remove("visible");
  cover.classList.add("invisible");
});
$(document.body).on('click', '#redirection', function () {
  document.location.href="app.html"; 
});


