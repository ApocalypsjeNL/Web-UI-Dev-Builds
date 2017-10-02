/*
 * Copyright (C) 2017 Mindgamesnl
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

function getSoundcloud(Url, callback) {
    console.info("[Soundcloud] Attempting api call!");
    $.getScript("https://craftmend.com/api_SSL/soundcloud/js.php?file=" + Url, function() {
        setTimeout(function() {
            var data = lastSoundCloud;
            if (data === "") {
                console.info("[Soundcloud] Failed to get sound.");
            } else {
                var api = data;
                callback("https://api.soundcloud.com/tracks/" + api.id + "/stream?client_id=a0bc8bd86e876335802cfbb2a7b35dd2");
                OpenAudioAPI.songNotification({
                    songTitle: api.title,
                    songURL: api.permalink_url,
                    songImage: api.artwork_url
                });
                console.info("[Soundcloud] Successfull api call!");
            }
        });
    });
}

// YouTube Integration
function getYoutbe(youtubeId) {
    $.get("https://oayt-delivery.snowdns.de/ytdata.php?name=" + mcname + "&server=" + clientID + "&v=" + youtubeId, function(data) {
        let json = JSON.parse(data);
        OpenAudioAPI.songNotification({
            songTitle: json["title"],
            songURL: 'https://www.youtube.com/watch?v=' + youtubeId,
            songImage: json["thumbnail"]
        });
    });
    return "https://oayt-delivery.snowdns.de/?name=" + mcname + "&server=" + clientID + "&v=" + youtubeId
}

// YouTube Playlist Integration
// Warning: This will only work with /oa playlist
function getYouTubePlaylist(playlistID) {
    $.ajax({
        url: 'https://apocalypsje.ga/YouTubePlayList.php?playlistId=' + playlistID,
        type: 'get',
        async: false,
        success: function (data) {
            var ids = data;
            $.each(ids, function(key, value) {
                AutoDj.AddSong("https://oayt-delivery.snowdns.de/?name=" + mcname + "&server=" + clientID + "&v=" + value);
            });
        }
    });
}

var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio

soundManager.setup({
    defaultOptions: {
        onfinish: function() {
            handleSoundEnd(this.id);
            soundManager.destroySound(this.id);
            if (this.id != "oa_back_" + randomID) {
                onSoundEnd();
            }
        },
        onplay: function() {
            if (this.id != "oa_back_" + randomID) {
                onSoundPlay();
            }
        },
        onstop: function() {
            if (this.id != "oa_back_" + randomID) {
                onSoundEnd();
            }
        },
        onerror: function(code, description) {
            if (this.id != "oa_back_" + randomID) {
                soundManager._writeDebug("[SoundManager2] oa_back_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopBackground("oa_back_" + randomID);
                    soundManager.destroySound("oa_back_" + randomID);
                } else {
                    soundManager._writeDebug("Unable to decode oa_back_" + randomID + ". Well shit.", 3);
                }
            }
        }
    }
});

function onSoundPlay() {
    if (listSounds().includes("oa_back_" + randomID) && ambiance != "") {
        openaudio.stopBackground();
    }
    try {
        clearTimeout(ambtimer);
    } catch(e) {}
}

function onSoundEnd() {
    ambtimer = setTimeout(function() {
        if (listSounds().length == 0 && ambiance != "") {
            if (ambiance.includes("soundcloud.com")) {
                var scurl = ambiance;
                getSoundcloud(scurl, function(newurl) {
                    openaudio.sartBackground(newurl);
                });
            } else {
                openaudio.sartBackground(ambiance);
            }
        }
    }, ambdelay);
}



function handleSoundEnd(fullId) {
    var id = fullId.split("_")[2];
    if (id != "undefined") {
        var whisper = {};
        whisper.command = "SoundEnded";
        whisper.id = id;
        openaudio.whisper(JSON.stringify(whisper));
    }
}

langpack = {};
langpack.hue = {};
langpack.message = {};
langpack.notification = {};


langpack.message.devbuild = "This server is using a Development Build! Some functions may or may not work.";
langpack.message.welcome = "Connected as %name%! Welcome!";
langpack.message.notconnected = "You're not connected to the server...";
langpack.message.server_is_offline = "Server is offline.";
langpack.message.inavlid_url = "Invalid url.";
langpack.message.invalid_connection = "Invalid connection!";
langpack.message.reconnect_prompt = "Sorry but your url is not valid  Please request a new url via <b>/audio</b> or <b>/connect</b>.";
langpack.message.socket_closed = "Disconnected from the server, please wait";
langpack.message.mobile_qr = "Qr code for mobile client";
langpack.message.listen_on_soundcloud = "Listen on soundcloud!";
langpack.message.clypit_url = "<h2>Uh oh</h2> <h3>Clyp.it is no longer supported! <b>Do not ask for support.</b></h3>";
langpack.message.spotify_url = "<h2>Uh oh</h2> <h3>Spotify links do not currently work. <b>Support is coming soon™</b></h3>";
langpack.message.minime_disabled = "<h2>Minimi is disabled by the server admin.</h2>";
langpack.message.debugger_off = "<h2>Debugger is only available on development builds.</h2>";
langpack.message.easter_egg = "<h2>You found an EasterEgg.</h2><h3>Now listen to the torture >:)</h3>";

langpack.notification.header = "OpenAudioMc | %username%";
langpack.notification.img = 'files/images/footer_logo.png';

langpack.hue.disabled = "philips hue lights are disabled by the server admin!";
langpack.hue.please_link = "<h2>Philips HUE bridge detected!</h2><h3>Please press the link button!</h3>";
langpack.hue.connecting = "<h2>Connecting to hue bridge...</h2>";
langpack.hue.re_search_bridge = "<h2>No philips hue bridge found</h2><h4>Searching for a hue bridge in your network...</h4>";
langpack.hue.cant_connect = "<h2>Could not connect to hue bridge</h2>";
langpack.hue.not_found = "<h2>No philips hue bridge found</h2>";
langpack.hue.connected_with_bridge = "<h3>You are now connected with your %bridgename% bridge. Have fun!</h3>";
langpack.hue.ssl_error = "<h2>There is no support over a secure connection :(</h2><h4>Phillips HUE support is automatically disabled.</h4>";
langpack.hue.direct_ip_prompt = "<h2>Please input your bridge IP</h2>";
langpack.hue.direct_ip_prompt_empty = "<h2>Please enter a Bridge IP</h2>";
langpack.hue.direct_ip_lookup = "<h2>Attempting to connect to bridge IP %ip%...</h2>";
langpack.hue.direct_ip_lookup_success = "<h2>Found bridge IP %ip%</h2><h3>Connecting...</h3>";
langpack.hue.direct_ip_lookup_failed = "<h2>Failed to connect to bridge IP %ip%...</h2>";
langpack.hue.light_data_fail = "<h2>Unable to retrieve Light Data.</h2><h3>Press <b>F5</b> to refresh</h3>";


var openaudio = {};
var socketIo = {};
var apijson = {"ver":"1.0","clientJS":"https://craftmendserver.eu:3000/socket.io/socket.io.js","socket":"https://craftmendserver.eu:3000/","secureSocket":"https://craftmendserver.eu:3000/"};
var ui = {};
var fadingData = {};
var stopFading = {};
var isFading = {};
var volume = 20;
var FadeEnabled = true;
var hue_connected = {};
var MyHue = new huepi();
var HueDefaultColor = "rgba(255	,255,255,150)";
var isHueOn = true;
var HueTestTry = 0;
var hue_lights = {};
var hue_enabled = false;
var StopHueLoop = false;
var hue_start_animation = true;
var audio = [];
var ambiance = "";
var twitter = "";
var youtube = "";
var website = "";
var iconcolor = "#242424";
var ambtimer = 0;
var ambdelay = 800;
var minimeon = false;
var lastSpeakerVolume = 0;
var development = true;
var hue_set = false;
var direct = true;
var connecting = true;
var loop = false;
setTimeout(keyfix, 1000);

openaudio.color = function(code) {
    $("#footer").animate({
        "background-color": code
    }, {
        duration: 1000
    });
    $("#box").animate({
        "background-color": code
    }, {
        duration: 500
    });
};

openaudio.decode = function(msg) {

    if (msg.includes("clyp.it")) {
        soundManager._writeDebug("Clyp.it is no longer supported! Do not ask for support.", 2);
        swal(langpack.message.clypit_url, "error");
        return;
    }

    if (msg.includes("spotify.com")) {
        soundManager._writeDebug("Spotify links do not work. Support is coming soon™.", 2);
        swal(langpack.message.spotify_url, "error");
        return;
    }

    request = JSON.parse(msg);
    if (request.command == "play_normal") {
        if (request.src.includes("soundcloud.com")) {
            var scurl = request.src;
            getSoundcloud(scurl, function(newurl) {
                request.src = newurl;
                openaudio.play(request.src);
            });
        } else if (request.src.includes("youtube.com")) {
            var youtubeId = request.src.split("?v=");
            openaudio.play(getYoutbe(youtubeId[1]));
        } else {
            openaudio.play(request.src);
        }
    } else if (request.command == "stop") {
        openaudio.playAction("stop");
        try {
            openaudio.stopPlay();
        } catch (e) {}
        try {
            openaudio.stopLoop('loop');
        } catch (e) {}
        try {
            AutoDj.stopPlaylist('AutoDj');
        } catch (e) {}
        try {
            loadedsound.stop();
        } catch (e) {}
    } else if (request.command == "custom") {
        var str = request.string;
        console.log("Custom json for developers: " + str);
    } else if (request.command == "loadmod") {
        if (request.type == "css") {
            addCss(request.src);
        } else if (request.type == "js") {
            addJs(request.src);
        }
    } else if (request.command == "playlist") {
        try {
            AutoDj.stopPlaylist();
        } catch (e) {}
        var myStringArray = request.array;
        var arrayLength = myStringArray.length;
        PlayList_songs = {};
        for (var i = 0; i < arrayLength; i++) {
            var song = myStringArray[i];
            if (song.includes("soundcloud.com")) {
                var scurl2 = request.src;
                AutoDj.AddSong(getSoundcloud(scurl2, song));
            }
            // YouTube Integration
            if (song.includes("youtube.com")) {
                if (song.includes("?list=")) {
                    curl = song.toString().split('list=')[1];
                    getYouTubePlaylist(curl);
                } else {
                    curl = song.toString().split('?v=')[1];
                    AutoDj.AddSong(AutoDj.AddSong(curl));
                }
            } else {
                AutoDj.AddSong(song);
            }
            AutoDj.AddedCount = 1;
            AutoDj.IdOfNowPlaying = 0;
            AutoDj.LoadAll();
            AutoDj.PlayNext();
        }
    } else if (request.command == "message") {
        //Browser messages
        openaudio.message(request.string);
    } else if (request.command == "speaker") {
        if (request.type == "add") {
            if (request.src.includes("soundcloud.com")) {
                var scurl = request.src;
                getSoundcloud(scurl, function (newurl) {
                    openaudio.newspeaker(newurl, request.time, request.volume);
                });
            } else if (request.src.includes("youtube.com")) {
                var youtubeId = request.src.split("?v=");
                openaudio.newspeaker(getYoutbe(youtubeId[1]), request.time, request.volume);
        	} else if (request.src.includes("youtu.be")) {
                var youtubeId = request.src.split("/");
                openaudio.newspeaker(getYoutbe(youtubeId[3]), request.time, request.volume);
			}
        	else {
                openaudio.newspeaker(request.src, request.time, request.volume);
            }
        } else if (request.type == "volume") {
            for (var i = 0; i < listSpeakerSounds().split(',').length; i++) {
                listSpeakerSounds().split(',')[i] = listSpeakerSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
                if ((listSpeakerSounds().split(',')[i].indexOf("speaker_") !== -1)) {
                    fadeSpeaker2(listSpeakerSounds().split(',')[i], request.volume);
                    lastSpeakerVolume = request.volume;
                }
            }
        } else if (request.type == "stop") {
            openaudio.removeSpeaker("speaker");
        } else if (request.type == "stopall") {
            openaudio.removeSpeaker("speaker");
        }
    } else if (request.command == "skipto") {
        //skip to
        openaudio.skipTo(request.id, request.timeStamp);
    } else if (request.command == "setvolumeid") {
        openaudio.set_directed_volume(request.id, request.volume);
    } else if (request.command == "forcevolume") {
        openaudio.set_volume(request.volume);
    } else if (request.command == "play_normal_id") {
        if (request.src.includes("soundcloud.com")) {
            var scurl = request.src;
            getSoundcloud(scurl, function(newurl) {
                openaudio.play(newurl, request.id, request.time);
            });
        } // YouTube Integration Start
        else if (request.src.includes("youtube.com")) {
            var youtubeId = request.src.split("?v=");
        	openaudio.play(getYoutbe(youtubeId[1]), request.id, request.time);
		} else if (request.src.includes("youtu.be")) {
            var youtubeId = request.src.split("/");
            openaudio.play(getYoutbe(youtubeId[1]), request.id, request.time);
        } // YouTube Integration End
        else {
            openaudio.play(request.src, request.id, request.time);
        }
    } else if (request.command == "stop_id") {
        openaudio.stop_id(request.id);
    } else if (request.command == "toggle") {
        //I KNOW TOOGLE IS A TYPO
        openaudio.toogle_id(request.id);
    } else if (request.command == "loop") {
        if (request.src.includes("soundcloud.com")) {
            var scurl = request.src;
            getSoundcloud(scurl, function(newurl) {
                openaudio.loop(newurl);
            });
        } // YouTube Integration Start
         else if (request.src.includes("youtube.com")) {
            var youtubeId = request.src.split("?v=");
            openaudio.loop(getYoutbe(youtubeId[1]));
		} else if (request.src.includes("youtu.be")) {
            var youtubeId = request.src.split("/");
            openaudio.loop(getYoutbe(youtubeId[1]));
		} // YouTube Integration End
		else {
            openaudio.loop(request.src);
        }
    } else if (request.type == "region") {

        //TODO: REGION HANDLER

        if (request.command == "startRegion") {

            if (request.src.includes("soundcloud.com")) {
                var scurl = request.src;
                getSoundcloud(scurl, function(newurl) {
                    request.src = newurl;
                    openaudio.playRegion(request.src, request.time, request.id);
                });
            } // YouTube Integration Start
            else if (request.src.includes("youtube.com")) {
                var youtubeId = request.src.split("?v=");
                openaudio.playRegion(getYoutbe(youtubeId[1]), request.time, request.id);
			} else if (request.src.includes("youtu.be")) {
                var youtubeId = request.src.split("/");
                openaudio.playRegion(getYoutbe(youtubeId[1]), request.time, request.id);
			} // YouTube Integration End
			else {
                openaudio.playRegion(request.src, request.time, request.id);
            }
        } else if (request.command == "stopOldRegion") {
            openaudio.stopRegion(request.id);
        } else {
            openaudio.regionsStop();
        }
    } else if (request.command == "volume") {
        fadeAllTarget(request.volume);
    } else if (request.type == "buffer") {
        if (request.command == "play") {
            openaudio.playbuffer();
        } else if (request.command == "create") {

            if (request.src.includes("soundcloud.com")) {
                var scurl = request.src;
                getSoundcloud(scurl, function(newurl) {
                    openaudio.createBuffer(newurl);
                });
            } // YouTube Integration Start
            else if (request.src.includes("youtube.com")) {
                var youtubeId = request.src.split("?v=");
                openaudio.createBuffer(getYoutbe(youtubeId[1]));
			} else if (request.src.includes("youtu.be")) {
                var youtubeId = request.src.split("/");
            	openaudio.createBuffer(getYoutbe(youtubeId[1]));
			} // YouTube Integration End
			else {
                openaudio.createBuffer(request.src);
            }
        }
    } else if (request.command == "hue") {
        if (request.type == "set") {
            var values = request.target.split(':');
            var colorcode = values[0];
            try {
                //light is specified
                var light = values[1];
                hue_set_color(colorcode, light);
            } catch (e) {
                //no light code
                hue_set_color(colorcode);
            }
        } else if (request.type == "reset") {
            hue_set_color(HueDefaultColor);
        } else if (request.type == "blink") {
            for (var key in MyHue.Lights) {
                if (MyHue.Lights.hasOwnProperty(key)) {
                    if (hue_lights[key].enabled) {
                        MyHue.LightAlertLSelect(key);
                    }
                }
            }
        } else if (request.type == "cyclecolors") {
            for (var key in MyHue.Lights) {
                if (MyHue.Lights.hasOwnProperty(key)) {
                    if (hue_lights[key].enabled) {
                        MyHue.LightEffectColorloop(key);
                    }
                }
            }
        } else if (request.type == "stop") {
            for (var key in MyHue.Lights) {
                if (MyHue.Lights.hasOwnProperty(key)) {
                    if (hue_lights[key].enabled) {
                        MyHue.LightAlertNone(key);
                        MyHue.LightEffectNone(key);
                    }
                }
            }
        }
    } else if (request.command == "setbg") {
        if (request.type == "set") {
            document.body.background = request.target;
        } else if (request.type == "reset") {
            document.body.background = "";
        }
    }
};

openaudio.play = function(src_fo_file, soundID, defaultTime) {
    if (soundID === null) {
        soundID = 'default';
    }

    if (defaultTime === null) {
        defaultTime = 0;
    }

    var soundId = "play";
    if (isFading[soundId] === true) {
        stopFading[soundId] = true;
    }
    var mySoundObject = soundManager.createSound({
        id: "play_" + randomID + soundID,
        url: src_fo_file,
        volume: volume,
        from: defaultTime,
        autoPlay: true
    });
};

openaudio.stopPlay = function(soundID) {
    fadeIdOut("play_" + randomID + soundID);
    soundManager.destroySound("play_" + randomID + soundID);
}

openaudio.sartBackground = function(url) {
    soundManager.stop("oa_region_" + randomID);
    soundManager.destroySound("oa_back_" + randomID);
    var regionsound = soundManager.createSound({
        id: "oa_back_" + randomID,
        volume: volume,
        url: url
    });

    function loopSound(sound) {
        sound.play({
            onfinish: function() {
                loopSound(sound);
            },
            onerror: function(code, description) {
                soundManager._writeDebug("oa_back_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopBackground();
                } else {
                    soundManager._writeDebug("Unable to decode oa_back_" + randomID + ". Well shit.", 3);
                }
            }
        });
    }
    fadeIdTarget("oa_back_" + randomID);
    loopSound(regionsound);
};

openaudio.stopBackground = function() {
    fadeIdOut("oa_back_" + randomID);
    soundManager.destroySound("oa_back_" + randomID);
};

openaudio.whisper = function(message) {
    socket.emit("whisperToServer", message);
    console.info("[Socket.io] Whisper send.");
};

socketIo.log = function(data) {
    console.info("[Socket.Io] " + data);
};

openaudio.skipTo = function(id, timeInS) {
    openaudio.setIdAtribute(id, function(fullID) {
        var s = parseInt(timeInS);
        var t = s * 1000;
        soundManager.setPosition(fullID, t);
    });
};

openaudio.playRegion = function(url, defaultTime) {
    soundManager.stop("oa_region_" + randomID);
    soundManager.destroySound("oa_region_" + randomID);
    var regionsounds = soundManager.createSound({
        id: "oa_region_" + randomID,
        url: url,
        volume: volume,
        from: defaultTime * 1000,
        stream: true,
        onplay: function() {
            soundManager.getSoundById("oa_region_" + randomID ).metadata.region = true;
        }
    });
    function loopSound(sound) {
        sound.play({
            onfinish: function() {
                loopSound(sound);
            },
            onerror: function(code, description) {
                soundManager._writeDebug("oa_region_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopRegion();
                } else {
                    soundManager._writeDebug("Unable to decode oa_region_" + randomID + ". Well shit.", 3);
                }
            }
        });
    }
    loopSound(regionsounds);
};

openaudio.stopRegion = function() {
    fadeIdOut("oa_region_" + randomID );
    soundManager.destroySound("oa_region_" + randomID );
};

openaudio.regionsStop = function() {
    for (var i = 0; i < listSounds().split(',').length; i++) {
        listSounds().split(',')[i] = listSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
        if (listSounds().split(',')[i].indexOf("oa_region_" + randomID) !== -1) {
            fadeIdOut(listSounds().split(',')[i]);
        }
    }
};

openaudio.playAction = function(action_is_fnc) {
    for (var i = 0; i < listSounds().split(',').length; i++) {
        listSounds().split(',')[i] = listSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
        if (listSounds().split(',')[i].indexOf("play_") !== -1) {
            if (action_is_fnc === "stop") {
                fadeIdOut(listSounds().split(',')[i]);
            }
        }
    }
};


openaudio.setGlobalVolume = function(volumeNew) {
    for (var i = 0; i < listSounds().split(',').length; i++) {
        listSounds().split(',')[i] = listSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
        try {
            soundManager.getSoundById(listSounds().split(',')[i]).setVolume(volumeNew);
        } catch (e) {
            //no sounds avalible
        }

    }

    for (var i = 0; i < listSpeakerSounds().split(',').length; i++) {
        listSpeakerSounds().split(',')[i] = listSpeakerSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
        if ((listSpeakerSounds().split(',')[i].indexOf("speaker_") !== -1)) {
            var volumeTarget = (lastSpeakerVolume / 100) * volumeNew;
            soundManager.setVolume(listSpeakerSounds().split(',')[i], volumeTarget);
        }
    }
};

openaudio.newspeaker = function(url, defaultTime, requestvol) {
    soundManager.stop("speaker_ding_" + randomID);
    soundManager.destroySound("speaker_ding_" + randomID);
    var speakersound = soundManager.createSound({
        id: "speaker_ding_" + randomID,
        url: url,
        volume: 0,
        autoPlay: true,
        from: defaultTime * 1000,
        onplay: function() {
            soundManager.getSoundById("speaker_ding_" + randomID, volume).metadata.speaker = true;
            fadeSpeaker2("speaker_ding_" + randomID, ((requestvol / 100) * volume))
        }, onfinish: function() {
            this.stream = true;
            this.from = 0;
            this.play();
        }, onerror: function(code, description) {
            soundManager._writeDebug("speaker_ding_" + randomID + " failed?", 3, code, description);
            if (this.loaded) {
                openaudio.removeSpeaker();
            } else {
                soundManager._writeDebug("Unable to decode speaker_ding_" + randomID + ". Well shit.", 3);
            }
        }
    });
};

openaudio.removeSpeaker = function(id) {
    fadeSpeakerOut("speaker_ding_" + randomID);
    soundManager.destroySound("speaker_ding_" + randomID);
};

openaudio.setIdAtribute = function(ID, callback) {
    if (!ID.includes("/")) {
        for (var i = 0; i < listSounds().split(',').length; i++) {
            listSounds().split(',')[i] = listSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
            if (listSounds().split(',')[i].indexOf(ID) !== -1 && (listSounds().split(',')[i].indexOf("play_") !== -1 || listSounds().split(',')[i].indexOf("oa_region_") !== -1)) {
                callback(listSounds().split(',')[i])
            }
        }
    } else {
        var string = ID;
        string = string.split("/");
        var stringArray = [];
        for (var loopids = 0; loopids < string.length; loopids++) {
            stringArray.push(string[loopids]);
        }
        stringArray.forEach(function(entry) {
            for (var i = 0; i < listSounds().split(',').length; i++) {
                listSounds().split(',')[i] = listSounds().split(',')[i].replace(/^\s*/, "").replace(/\s*$/, "");
                if (listSounds().split(',')[i].indexOf(entry) !== -1 && (listSounds().split(',')[i].indexOf("play_") !== -1 || listSounds().split(',')[i].indexOf("oa_region_") !== -1)) {
                    callback(listSounds().split(',')[i])
                }

            }
        });
    }
};


openaudio.set_directed_volume = function(volume, ID) {
    var volume = parseInt(volume);
    if (volume > 100) {
        openaudio.setIdAtribute(ID, function(fullID) {
            soundManager.setVolume(fullID, 100);
        });
    } else if (volume < 0) {
        openaudio.setIdAtribute(ID, function(fullID) {
            soundManager.setVolume(fullID, 0);
        });
    } else {
        openaudio.setIdAtribute(ID, function(fullID) {
            soundManager.setVolume(fullID, volume);
        });
    }
};



openaudio.stop_id = function(ID) {
    openaudio.setIdAtribute(ID, function(fullID) {
        fadeIdOut(fullID);
    });
};



openaudio.toogle_id = function(id) {
    openaudio.setIdAtribute(id, function(fullID) {
        soundManager.togglePause(fullID);
    });
};



openaudio.set_volume = function(volume_var) {
    volume_text = document.getElementById("volume");
    if (volume_var > 100) {
        document.getElementById("slider").value = 100;
        openaudio.setGlobalVolume(100);
        volume = 100;
    } else if (volume_var < 0) {
        document.getElementById("slider").value = 0;
        openaudio.setGlobalVolume(0);
        volume = 0;
    } else {
        document.getElementById("slider").value = volume_var;
        volume = volume_var;
        openaudio.setGlobalVolume(volume_var);
    }
};



openaudio.set_volume2 = function(volume_var) {
    if (volume_var > 100) {
        document.getElementById("slider").value = 100;
        openaudio.setGlobalVolume(100);
        volume = 100;
    } else if (volume_var < 0) {
        document.getElementById("slider").value = 0;
        openaudio.setGlobalVolume(0);
        volume = 0;
    } else {
        document.getElementById("slider").value = volume_var;
        volume = volume_var;
        openaudio.setGlobalVolume(volume_var);
    }
};



openaudio.playbuffer = function() {
    try {
        loadedsound.play({
            volume: volume
        });
    } catch (e) {

    }
};



openaudio.createBuffer = function(file_to_load) {
    loadedsound = soundManager.createSound({
        id: 'loader',
        url: file_to_load
    });
    soundManager.load('loader');
    loadedsound.load();
};

openaudio.message = function(text) {
    if (window.location.protocol == "https:") {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        } else {
            var notification = new Notification(langpack.notification.header.replace(/%username%/g, mcname), {
                icon: langpack.notification.img,
                body: text,
            });
        }
    } else {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: 'To ' + mcname + ': ' + text,
            timeout: 10000
        };
        notification.MaterialSnackbar.showSnackbar(data);
    }
};

openaudio.loop = function(url, defaultTime) {
    soundManager.stop("loop_" + randomID);
    soundManager.destroySound("loop_" + randomID);
    var loopnu = soundManager.createSound({
        id: "loop_" + randomID,
        volume: volume,
        url: url,
        from: defaultTime * 1000,
        stream: true
    });

    function loopSound(sound) {
        sound.play({
            onfinish: function() {
                loopSound(sound);
            },
            onerror: function(code, description) {
                soundManager._writeDebug("loop_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopLoop();
                } else {
                    soundManager._writeDebug("Unable to decode loop_" + randomID + ". Well shit.", 3);
                }
            }
        });
    }
    loopSound(loopnu);
};

openaudio.stopLoop = function() {
    fadeIdOut("loop_" + randomID);
    soundManager.destroySound("loop_" + randomID);
};

//all the fading c
$(document).ready(function() {
    window.fadeIdOut = function(soundId) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = soundId + "_Slider";
        x.min = 0;
        x.max = 100;
        x.value = volume;
        x.style = "display:none;";
        var backAudio = $('#' + soundId + "_Slider");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading[soundId] = true;
            backAudio.animate({
                value: 0
            }, {
                duration: 1000,
                step: function(currentLeft, animProperties) {
                    //call event when a sound started
                    if (stopFading[soundId] !== true) {
                        try {
                            soundManager.setVolume(soundId, currentLeft);
                        } catch (e) {}
                    }
                },
                done: function() {
                    if (stopFading[soundId] !== true) {
                        try {
                            soundManager.stop(soundId);
                            soundManager.destroySound(soundId);
                        } catch (e) {}
                    }
                    isFading[soundId] = false;
                    stopFading[soundId] = false;
                    x.remove();
                }
            });
        } else {
            try {
                soundManager.stop(soundId);
                soundManager.destroySound(soundId);
            } catch (e) {}
            x.remove();
        }
    };

    window.fadeSpeakerOut = function(soundId) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = soundId + "_Slider";
        x.min = 0;
        x.max = 100;
        x.value = soundManager.getSoundById(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/')).volume;
        x.style = "display:none;";
        var backAudio = $('#' + soundId + "_Slider");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading[soundId] = true;
            backAudio.animate({
                value: 0
            }, {
                duration: 1000,
                step: function(currentLeft, animProperties) {
                    //call event when a sound started
                    if (stopFading[soundId] !== true) {
                        try {
                            soundManager.setVolume(soundId, currentLeft);
                        } catch (e) {}
                    }
                },
                done: function() {
                    if (stopFading[soundId] !== true) {
                        try {
                            soundManager.stop(soundId);
                            soundManager.destroySound(soundId);
                        } catch (e) {}
                    }
                    isFading[soundId] = false;
                    stopFading[soundId] = false;
                    x.remove();
                }
            });
        } else {
            try {
                soundManager.stop(soundId);
                soundManager.destroySound(soundId);
            } catch (e) {}
            x.remove();
        }
    };

    window.fadeSpeaker2 = function(soundId, vt) {

        var volumeTarget = (vt / 100) * volume;
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2";
        x.min = 0;
        x.max = 100;
        x.value = soundManager.getSoundById("speaker_ding_" + randomID).volume;
        x.style = "display:none;";
        var backAudio = $('#' + soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading[soundId] = true;
            backAudio.animate({
                value: volumeTarget
            }, {
                duration: 400,
                step: function(currentLeft, animProperties) {
                    if (stopFading[soundId + "_Slider_type_2"] !== true) {
                        soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), currentLeft);
                    }
                },
                done: function() {
                    isFading[soundId] = false;
                    stopFading[soundId] = false;
                    soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), volumeTarget);
                    x.remove();
                }
            });
        } else {
            soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), volumeTarget);
            x.remove();
        }
    };


    window.fadeIdTarget = function(soundId, volumeTarget) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2";
        x.min = 0;
        x.max = 100;
        x.value = volume;
        x.style = "display:none;";
        var backAudio = $('#' + soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading[soundId] = true;
            backAudio.animate({
                value: volumeTarget
            }, {
                duration: 1000,
                step: function(currentLeft, animProperties) {
                    if (stopFading[soundId + "_Slider_type_2"] !== true) {
                        soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), currentLeft);
                    }
                },
                done: function() {
                    isFading[soundId] = false;
                    stopFading[soundId] = false;
                    soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), volumeTarget);
                    x.remove();
                }
            });
        } else {
            soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), volumeTarget);
            x.remove();
        }
    };

    window.fadeIdOutWithSpeaker = function(soundId) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2";
        x.min = 0;
        x.max = 100;
        x.value = volume;
        x.style = "display:none;";
        var backAudio = $('#' + soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading[soundId] = true;
            backAudio.animate({
                value: 0
            }, {
                duration: 100,
                step: function(currentLeft, animProperties) {
                    //call event when a sound started
                    if (stopFading[soundId] !== true) {
                        try {
                            soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), currentLeft);
                        } catch (e) {}
                    }
                },
                done: function() {
                    if (stopFading[soundId] !== true) {
                        try {
                            soundManager.stop(soundId);
                            soundManager.destroySound(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'));
                        } catch (e) {}
                    }
                    isFading[soundId] = false;
                    stopFading[soundId] = false;
                    x.remove();
                }
            });
        } else {
            try {
                soundManager.stop(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'));
                soundManager.destroySound(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'));
            } catch (e) {}
            x.remove();
        }
    };


    window.fadeIdTargetSpeaker = function(soundId, volumeTarget) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2";
        x.min = 0;
        x.max = 100;
        x.value = soundManager.getSoundById(soundId).volume;
        x.style = "display:none;";
        var backAudio = $('#' + soundId.replace(/\./g, 'oapoint').replace(/\:/g, 'oadubblepoint').replace(/\//g, 'oaslash') + "_Slider_type_2");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading[soundId] = true;
            backAudio.animate({
                value: volumeTarget
            }, {
                duration: 500,
                step: function(currentLeft, animProperties) {
                    if (stopFading[soundId + "_Slider_type_2"] !== true) {
                        soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), currentLeft);
                    }
                },
                done: function() {
                    isFading[soundId] = false;
                    stopFading[soundId] = false;
                    soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), volumeTarget);
                    x.remove();
                }
            });
        } else {
            soundManager.setVolume(soundId.replace(/\oapoint/g, '.').replace(/\oadubblepoint/g, ':').replace(/\oaslas/g, '/'), volumeTarget);
            x.remove();
        }
    };



    window.fadeAllTarget = function(volumeTarget) {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "range");
        document.body.appendChild(x);
        x.id = "global_Slider_type_2";
        x.min = 0;
        x.max = 100;
        x.value = volume;
        x.style = "display:none;";
        var backAudio = $('#' + "global_Slider_type_2");
        document.getElementById('faders').appendChild(x);

        if (FadeEnabled) {
            isFading["global_Slider_type_2"] = true;
            backAudio.animate({
                value: volumeTarget
            }, {
                duration: 1000,
                step: function(currentLeft, animProperties) {
                    if (stopFading["global_Slider_type_2"] !== true) {
                        openaudio.set_volume2(currentLeft);
                    }
                },
                done: function() {
                    isFading["global_Slider_type_2"] = false;
                    stopFading["global_Slider_type_2"] = false;
                    openaudio.set_volume(volumeTarget);
                    x.remove();
                }
            });
        } else {
            openaudio.set_volume(volumeTarget);
            x.remove();
        }
    }
});


/*
AUTO DJ SCRIPT FROM
https://github.com/Mindgamesnl/SM2_Playlist_Thingy
*/
var AutoDj = {};
AutoDj.AddedCount = 1;
AutoDj.IdOfNowPlaying = 0;
AutoDj.AddSong = function(File) {
    PlayList_songs["_" + AutoDj.AddedCount] = {
        "File": File
    };
    this.AddedCount++;
    PlayList_songs["_" + AutoDj.AddedCount] = "end";
};
AutoDj.LoadAll = function() {
    var thiscount = 1;
    while (PlayList_songs["_" + thiscount] != "end") {
        var this_item = PlayList_songs["_" + thiscount];
        AutoDj["SongData_" + thiscount] = {
            "File": this_item.File,
            "CanBePlayed": true
        };
        console.log("AutoDj: Song loaded with ID:" + thiscount);
        thiscount++
    }
    if (PlayList_songs["_" + thiscount] == "end") {
        var loadedcount = thiscount - 1;
        console.log("AutoDj: Loading done (loaded a total of " + loadedcount + " songs.)");
    }
};
AutoDj.Check = function(song_id) {
    if (AutoDj["SongData_" + song_id] != null) {
        var thisdata = AutoDj["SongData_" + song_id];
        if (thisdata.CanBePlayed === true) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
AutoDj.Play = function(FNC_ID) {
    if (this.Check(FNC_ID) === true) {
        var thisdata = AutoDj["SongData_" + FNC_ID];
        AutoDj.SoundManager_Play(thisdata.File, FNC_ID)
    } else {
        console.warn("AutoDj: " + FNC_ID + " not playing due to an error. Try rerunning the command again in game");
        AutoDj.PlayNext();
    }
};
AutoDj.SoundManager_Play = function(fnc_file, id) {
    var mySoundObject = soundManager.createSound({
        id: "AutoDj_" + id,
        url: fnc_file,
        volume: volume,
        autoplay: true
    });

    function playSound(sound) {
        sound.play({
            onfinish: function() {
                AutoDj.PlayNext();
            },
            onerror: function() {
                console.error("AutoDj: An error occured while playing ID: " + id + ". Check the URL in playlist.yml. Playing next song in playlist");
                soundManager.destroySound("AutoDj_" + id);
                AutoDj.PlayNext();
            }
        });
    }

    playSound(mySoundObject);

    AutoDj.stopPlaylist = function() {
        fadeIdOut("AutoDj_" + id);
        soundManager.destroySound("AutoDj_" + id);
    }
};
AutoDj.PlayNext = function() {
    var VolgendeLiedje = AutoDj.IdOfNowPlaying + 1;
    if (AutoDj.Check(VolgendeLiedje) === true) {
        AutoDj.Play(VolgendeLiedje);
        AutoDj.IdOfNowPlaying++
    } else {
        AutoDj.IdOfNowPlaying = 1;
        AutoDj.Play(AutoDj.IdOfNowPlaying);

    }
};

//goto

function openSmallWindow() {
    swal({
        title: 'Are you sure?',
        text: "Current sounds may stop!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Open mini-audio'
    }).then(function () {
        minime = window.open(document.URL+"&tinyWindow=true", "OpenAudioMc-Mini", "width=561,height=566");
        minime.onload = function() {
            window.location.href = "http://closeme.openaudiomc.net/";
        }
    })
}

function showPlus() {
    console.error("[OpenAudio] [removedMethodError] showPlus() is no longer supported. You will get redirected instead due to an annoying bug in OpenAudio 2.x.");
}

window.onresize = function() {
    if (tinyWindow != "(none)") {
        window.resizeTo(566, 681);
    }

};
window.onclick = function() {
    if (tinyWindow != "(none)") {
        window.resizeTo(566, 681);
    }
};

function openSite() {
    window.open(website);
}

function openYt() {
    window.open(youtube);
}

function openTwitter() {
    window.open(twitter);
}

function dev() {
    if (!(development != true)) {
        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: langpack.message.devbuild,
            timeout: 10000
        };
        notification.MaterialSnackbar.showSnackbar(data);
    }
}

function soundmanager2_debugger() {
    var dialog = document.querySelector('#dialog-soundmanager2');
    dialog.showModal();
    dialog.querySelector('#dialog-close-sm').addEventListener('click', function () {
        dialog.close();
    });
}

function SetDesignColor(code) {
    document.getElementById("box").style = "background-color: " + code + ";";
}

function keyfix() {
    document.body.onkeydown = function(data) {

        if (data.key == "ArrowDown" || data.key == "ArrowLeft") {
            var slider = document.getElementById("slider");
            slider.value = slider.value - 1;
            openaudio.set_volume(slider.value);
            sliderValue(slider.value);
        }

        if (data.key == "h") {
            if (!(hue_enabled) !== true) {
                openhue();
            }
            else {
                OpenAudioAPI.generateDialog({
                    textTitle: 'MiniMe',
                    htmlContent: langpack.hue.disabled
                });
            }
        }

        if (data.key == "m") {
            if (!(minimeon) !== true) {
                openSmallWindow();
            } else {
                OpenAudioAPI.generateDialog({
                    textTitle: 'MiniMe',
                    htmlContent: langpack.message.minime_disabled
                });
            }
        }

        if (data.key == "d") {
            if (!(development !== true)) {
                soundmanager2_debugger();
            } else {
                OpenAudioAPI.generateDialog({
                    textTitle: 'Soundmanager2 Debugger',
                    htmlContent: langpack.message.debugger_off
                });
            }
        }

        if (data.key == "l") {
            OpenAudioAPI.generateDialog({
                textTitle: 'Easter Egg',
                htmlContent: langpack.message.easter_egg
            });
            soundManager.createSound({
                id: "oa_easteregg",
                volume: volume,
                url: "https://oayt-delivery.snowdns.de/?v=m7SNzJx05IE",
                autoPlay: true
            });
        }

        if (data.key == "i") {
            var dialog = document.querySelector('#dialog-mods');
            dialog.showModal();
            dialog.querySelector('#dialog-close-mods').addEventListener('click', function () {
                dialog.close();
            });
        }

        if (data.key == "ArrowUp" || data.key == "ArrowRight") {
            var slider = document.getElementById("slider");
            var val = ++slider.value;
            slider.value = val;
            openaudio.set_volume(slider.value);
            sliderValue(slider.value);
        }
    }
}

function loadAllFromJson(pack) {
    var json = JSON.parse(pack);
    var jsfiles = json.js;
    var cssfiles = json.css;
    for (var i = 0; i < jsfiles.length; i++) {
        addJs(jsfiles[i]);
    }
    for (var i2 = 0; i2 < cssfiles.length; i2++) {
        addCss(cssfiles[i2]);
    }
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



function listSounds() {
    var obj = soundManager.sounds;
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (soundManager.getSoundById(p).metadata.speaker !== true) {
                str += p + ",";
            }
        }
    }
    return str;
}

function listSpeakerSounds() {
    var obj = soundManager.sounds;
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (soundManager.getSoundById(p).metadata.speaker !== false) {
                str += p + ",";
            }
        }
    }
    return str;
}


function openhue() {
    if (hue_enabled != false) {
        hue_menu();
    } else {
        OpenAudioAPI.generateDialog({
            dialogWidth: '70%',
            textTitle: 'Philips HUE',
            htmlContent: 'langpack.hue.disabled'
        });
    }
}

//thanks to chrome bugs we need to detect if the browser is actife
var vis = (function() {
    var stateKey,
        eventKey,
        keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

vis(function() {
    if (vis()) {
        setTimeout(function() {
            FadeEnabled = true;
        }, 300);
    } else {
        openaudio.whisper("eventMinni");
        openaudio.whisper(JSON.stringify("eventMinni"));
        FadeEnabled = false;
    }
});

var notIE = (document.documentMode === undefined),
    isChromium = window.chrome;
if (notIE && !isChromium) {
    $(window).on("focusin", function() {
        setTimeout(function() {
            FadeEnabled = true;
        }, 300);
    }).on("focusout", function() {
        FadeEnabled = false;
    });
} else {
    if (window.addEventListener) {} else {
        window.attachEvent("focus", function(event) {
            setTimeout(function() {
                FadeEnabled = true;
            }, 300);
        });
        window.attachEvent("blur", function(event) {
            FadeEnabled = false;
        });
    }
}

function showqr() {
    swal({
        title: langpack.message.mobile_qr,
        text: '<center><div id="qrcode"></div></center>',
        CancelButton: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        showConfirmButton: true,
        html: '<center><div id="qrcode"></div></center>'
    }, function() {});
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: document.URL,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

function addJs(url) {
    console.info("[ModManager] Attempting to add js file from " + url + ".");
    var extension = url.substr((url.lastIndexOf('.') +1));
    if (!/(js)$/ig.test(extension)) {
        console.error("[ModManager] [Idiot Proof Detection] File is not a JavaScript (.js) file. Not appending to the client.");
        OpenAudioAPI.loadMod(url, "Disabled", "JSMod");
    } else {
        $.getScript(url, function() {
            $('head').append('<script src="' + url + '" type="text/javascript"></script>');
            console.info("[ModManager] Added js file from " + url + " successfully.");
            OpenAudioAPI.loadMod(url, "Enabled", "JSMod");
        });
    }
}

/**
 * @deprecated Since build 1.8 for 3.0. Recommend loading as a JavaScript Web Mod
 */
function addCss(url) {
    console.warn("[ModManager] addCss has been deprecated as of Development Build 1.8. Use OpenAudioAPI.getCSS instead.");
    console.info("[ModManager] Attempting to add css file from " + url + ".");
    var extension = url.substr((url.lastIndexOf('.') +1));
    if (!/(css)$/ig.test(extension)) {
        console.error("[ModManager] [Idiot Proof Detection] File is not a Cascade Style Sheet (.css) file. Not appending to the client.");
        OpenAudioAPI.loadMod(url, "Disabled", "CSSMod");
    } else {
        $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css" />');
        console.info("[ModManager] Added css file from location " + url + " successfully");
        OpenAudioAPI.loadMod(url, "Enabled", "CSSMod");
    }
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

function enable() {
    //setup vars
    status_span = document.getElementById("status-span");
    volume_text = document.getElementById("volume");

    if (getCookie("volume") != null) {
        openaudio.set_volume(getCookie("volume"));
    }

    //setup session data
    var [a, b] = session.split(':');
    clientID = a;
    clientTOKEN = b;

    document.getElementById("skull").src = "https://crafatar.com/avatars/" + mcname + "?overlay";

    // Since its deprecated to use on an insecure connection, we will use Material's version as a workaround fix for it ;)
    if (window.location.protocol == "https:") {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    } else if (window.location.protocol == "http:") {
        console.warn("[OpenAudioMC] [illegalException] Notifications only works on secure connection. Using Material's Own Notifications instead.");
    } else {
        console.warn("[OpenAudioMC] [illegalException] Notifications only works on secure connection. Using Material's Own Notifications instead.");
    }

    //connect to the craftmend server
    socketIo.connect();
}