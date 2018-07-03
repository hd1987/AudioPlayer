(function ($) {

  // inner variables
  var song,
    $audioPlayer = $('.audio-player'),
    $progress = $audioPlayer.find('.progress'),
    $volume = $audioPlayer.find('.volume'),
    $passed = $audioPlayer.find('.passed'),
    $remain = $audioPlayer.find('.remain'),
    $play = $audioPlayer.find('.play'),
    $pause = $audioPlayer.find('.pause'),
    $next = $audioPlayer.find('.next'),
    $prev = $audioPlayer.find('.prev'),
    $playlist = $audioPlayer.find('.playlist'),
    $btnList = $audioPlayer.find('.btn-list'),
    $btnVolume = $audioPlayer.find('.btn-volume');

  function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  function secToMinute(sec) {
    return parseInt(sec / 60) + ':' + PrefixInteger((sec % 60), 2);
  }

  function iconVolume(icon) {
    $btnVolume.removeClass('icon-volume-empty icon-volume-tiny icon-volume-min icon-volume-large')
      .addClass('icon-volume-' + icon);
  }

  // init audio
  function initAudio(ele) {
    var url = ele.attr('audiourl'),
      title = ele.text();

    song = new Audio(url);

    // timeupdate event listener
    song.addEventListener('timeupdate', function () {
      var curTime = parseInt(song.currentTime, 10);
      var curRemain = parseInt((song.duration - song.currentTime), 10);

      $progress.slider('value', curTime);
      // curTime ? $passed.text(secToMinute(curTime)) : $passed.text('');
      $passed.text(secToMinute(curTime));
      curRemain ? $remain.text(secToMinute(curRemain)) : $remain.text('');

      if (song.ended) {
        $play.removeClass('hidden');
        $pause.addClass('hidden');
      }
    });

    // add title
    $('.player .title').text(title);

    // playlist active
    ele.addClass('active').siblings().removeClass('active');
  }

  // play
  function playAudio() {
    song.play();

    $progress.slider("option", "max", song.duration);

    $play.addClass('hidden');
    $pause.removeClass('hidden');
  }

  // stop
  function stopAudio() {
    song.pause();

    $play.removeClass('hidden');
    $pause.addClass('hidden');
  }

  // play click
  $play.on('click', function () {
    playAudio();
  });

  // pause click
  $pause.on('click', function () {
    stopAudio();
  });

  // next click
  $next.on('click', function () {
    stopAudio();

    var next = $playlist.find('li.active').next();
    if (next.length == 0) {
      next = $playlist.find('li:eq(0)');
    }
    initAudio(next);
    setTimeout(playAudio, 1000);
  });

  // prev click
  $prev.on('click', function () {
    stopAudio();

    var prev = $playlist.find('li.active').prev();
    if (prev.length == 0) {
      prev = $playlist.find('li:eq(-1)');
    }
    initAudio(prev);
    playAudio();
    setTimeout(playAudio, 1000);
  });

  // show playlist
  $btnList.on('click', function () {
    var $this = $(this);

    if ($this.hasClass('active')) {
      $this.removeClass('active');
      $playlist.addClass('hidden');
    } else {
      $this.addClass('active');
      $playlist.removeClass('hidden');
    }
  });

  // show volume
  $btnVolume.on('click', function (event) {
    $volume.removeClass('hidden');
    event.stopPropagation();
  })

  $(document).on('click', function () {
    $volume.addClass('hidden');
  })

  // playlist elements - click
  $playlist.on('click', 'li', function () {
    var $this = $(this);

    if ($this.hasClass('active')) {
      $pause.hasClass('hidden') ? playAudio() : stopAudio();

    } else {
      stopAudio();
      initAudio($this);
      setTimeout(playAudio, 1000);
    }

  });

  // initialization - first element in playlist
  initAudio($playlist.find('li:eq(0)'));

  // set volume
  song.volume = 0.8;

  // initialize the volume slider
  $volume.slider({
    range: 'min',
    orientation: 'vertical',
    min: 1,
    max: 100,
    value: 80,
    slide: function (event, ui) {
      song.volume = ui.value / 100;

      if (song.volume <= .01) {
        iconVolume('empty');

      } else if (song.volume <= .2) {
        iconVolume('tiny');

      } else if (song.volume > .9) {
        iconVolume('large');

      } else {
        iconVolume('min');
      }
    }
  });

  // empty progress slider
  $progress.slider({
    range: 'min',
    min: 0,
    max: 100,
    slide: function (event, ui) {
      song.currentTime = ui.value;
    }
  });
})(jQuery);
