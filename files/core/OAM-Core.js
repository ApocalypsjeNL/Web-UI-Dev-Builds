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
                soundcloud_title = "-";
                soundcloud_icon = "files/images/sc-default.png";
                soundcloud_url = "https://soundcloud.com/stream";
                console.info("[Soundcloud] Failed to get sound.");
            } else {
                var api = data;
                soundcloud_title = api.title;
                soundcloud_icon = api.artwork_url;
                if (api.artwork_url == null) {
                    if (api.avatar_url != null) {
                        soundcloud_icon = api.avatar_url;
                    } else {
                        soundcloud_icon = "files/images/sc-default.png"
                    }
                }
                soundcloud_url = api.permalink_url;
                callback("https://api.soundcloud.com/tracks/" + api.id + "/stream?client_id=a0bc8bd86e876335802cfbb2a7b35dd2");
                document.getElementById("sc-cover").src = soundcloud_icon;
                document.getElementById("sc-title").innerHTML = soundcloud_title;
                document.getElementById("sc-cover").style.display = "";
                document.getElementById("sc-title").style.display = "";
                console.info("[Soundcloud] Successfull api call!");
            }
        });
    });
}

// YouTube Integration
function getYoutbe(youtubeId, callback) {
    return "https://oayt-delivery.snowdns.de/?name=" + mcname + "&server=" + clientID + ":" + clientTOKEN + "&v=" + youtubeId;
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
                    openaudio.stopBackground();
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

langpack.message.welcome = "Connected as %name%! Welcome! :)";
langpack.message.notconnected = "You're not connected to the server...";
langpack.message.server_is_offline = "Server is offline.";
langpack.message.inavlid_url = "Invalid url.";
langpack.message.invalid_connection = "Invalid connection!";
langpack.message.reconnect_prompt = "Sorry but your url is not valid :( Please request a new url via <b>/audio</b> or <b>/connect</b>.";
langpack.message.socket_closed = "Disconnected from the server, please wait";
langpack.message.mobile_qr = "Qr code for mobile client";
langpack.message.listen_on_soundcloud = "Listen on soundcloud!";

langpack.notification.header = "OpenAudioMc | %username%";
langpack.notification.img = 'files/images/footer_logo.png';

langpack.hue.disabled = "philips hue lights are disabled by the server admin!";
langpack.hue.please_link = "<h2>philips hue lights detected!</h2><h3>Please press the link button!</h3>";
langpack.hue.connecting = "<h2>Connecting to hue bridge...</h2>";
langpack.hue.re_search_bridge = "<h2>No philips hue bridge found :(</h2><h4>Searching for a hue bridge in your network...</h4>";
langpack.hue.cant_connect = "<h2>Could not connect to hue bridge :(</h2>";
langpack.hue.not_found = "<h2>No philips hue bridge found :(</h2>";
langpack.hue.connected_with_bridge = "<h3>You are now connected with your %bridgename% bridge.<br />have fun! :)</h3>";


var openaudio = {};
var socketIo = {};
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
var soundcloud_title = "-";
var soundcloud_icon = "files/images/soundcloud-2.png";
var regions = {};
var soundcloud_url = "https://soundcloud.com/stream";
var ambiance = "";
var twitter = "";
var DirectIP = false;
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
setTimeout(dev, 1000);
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
        swal("Uh oh", "Clyp.it is no longer supported! Do not ask for support.", "error");
        return;
    }

    if (msg.includes("spotify.com")) {
        soundManager._writeDebug("Spotify links do not work. Support is coming soon™.", 2);
        swal("Uh oh", "Spotify links do not work. Support is coming soon™", "error");
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
        } else if (request.src.includes("youtu.be")) {
            var youtubeId = request.src.split("/");
            openaudio.play(getYoutbe(youtubeId[3]));
        } else {
            openaudio.play(request.src);
        }
    } else if (request.command == "stop") {
        openaudio.playAction("stop");
        try {
            loadedsound.stop();
        } catch (e) {}
        try {
            openaudio.stopLoop('loop');
        } catch (e) {}
        try {
            soundManager.stop('AutoDj');
            soundManager.destroySound('AutoDj');
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
        var myStringArray = request.array;
        var arrayLength = myStringArray.length;
        PlayList_songs = {};
        for (var i = 0; i < arrayLength; i++) {
            var song = myStringArray[i];
            if (song.includes("soundcloud.com")) {
                var scurl2 = request.src;
                getSoundcloud(scurl2, function(newurl) {
                    song = newurl;
                });
            }
            if (song.includes("soundcloud.com")) {
                var scurl = request.src;
                getSoundcloud(scurl, function(newurl) {
                    AutoDj.AddSong(newurl);
                });
            }
            // YouTube Integration
            if (song.includes("youtube.com")) {
                var youtubeId2 = request.src.split("?v=");
                song = getYoutbe(youtubeId2[1]);
            }
            if (song.includes("youtube.com")) {
                var youtubeId = request.src.split("?v=");
                AutoDj.getYoutbe(youtubeId[1]);
            }
            if (song.includes("youtu.be")) {
                var youtubeId2 = request.src.split("/");
                song = getYoutbe(youtubeId2[3]);
            }
            if (song.includes("youtu.be")) {
                var youtubeId = request.src.split("/");
                AutoDj.getYoutbe(youtubeId[3]);
            }
            else {
                AutoDj.AddSong(song);
            }
            var valid = true;
        }
        if (valid) {
            AutoDj.AddedCount = 1;
            AutoDj.IdOfNowPlaying = 1;
            AutoDj.LoadAll();
            AutoDj.PlayNext();
        } else {
            soundManager._writeDebug("Error occured while loading AutoDj", 3);
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
            openaudio.play(getYoutbe(youtubeId[3]), request.id, request.time);
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
            openaudio.loop(getYoutbe(youtubeId[3]));
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
                openaudio.playRegion(getYoutbe(youtubeId[3]), request.time, request.id);
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
            	openaudio.createBuffer(getYoutbe(youtubeId[3]));
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
        var soundID = 'default';
    }

    if (defaultTime === null) {
        var defaultTime = 0;
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
                    fadeIdOut("oa_back_" + randomID);
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
                    fadeIdOut("oa_region_" + randomID );
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
                fadeSpeakerOut("speaker_ding_" + randomID)
            } else {
                soundManager._writeDebug("Unable to decode speaker_ding_" + randomID + ". Well shit.", 3);
            }
        }
    });
};

openaudio.removeSpeaker = function(id) {
    fadeSpeakerOut("speaker_ding_" + randomID);
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
        document.getElementById("volumevalue").innerHTML = 100;
        document.getElementById("volumevalue").style.left = 100 * 2.425 + 'px';
        volume = 100;
    } else if (volume_var < 0) {
        document.getElementById("slider").value = 0;
        openaudio.setGlobalVolume(0);
        volume = 0;
        document.getElementById("volumevalue").innerHTML = 0;
        document.getElementById("volumevalue").style.left = 0 * 2.425 + 'px';
    } else {
        document.getElementById("slider").value = volume_var;
        document.getElementById("volumevalue").innerHTML = volume_var;
        document.getElementById("volumevalue").style.left = volume_var * 2.425 + 'px';
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

function dismiss_notification() {
    $('#header').slideUp(800);
}

function notification_open() {
    $('#header').slideDown(800);
}

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
        $('#notifications').text('To ' + mcname + ': ' +text);
        soundManager.createSound({
            id: 'mySound2',
            url: '',
            volume: volume
        });
        soundManager.play('mySound2');
        notification_open();
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
                    fadeIdOut("loop_" + randomID);
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
AutoDj.IdOfNowPlaying = 1;
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
        AutoDj.SoundManager_Play(thisdata.File)
    } else {
        console.log("AutoDj: " + FNC_ID + "not playing");
    }
};
AutoDj.SoundManager_Play = function(fnc_file) {
    var VolumeNow = this.Volume;
    soundManager.destroySound('AutoDj');
    var mySoundObject = soundManager.createSound({
        id: "AutoDj",
        url: fnc_file,
        volume: volume,
        stream: true,
        onfinish: AutoDj.PlayNext
    });
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
    swal(
        'Do you want to customize?',
        '<a style="color:black" href="https://plus.openaudiomc.net/">Then click here.</a>',
        'question'
    );
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
    if (!(development !== true)) {
        $('#notifications').text('This server is using a Beta Build! There may be some bugs in this build');
        notification_open();
    }
}

function soundmanager2_debugger() {
    $("#debugger").modal();
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
                swal({
                    title: langpack.hue.disabled,
                    type: 'error'
                });
            }
        }

        if (data.key == "m") {
            if (!(minimeon) !== true) {
                openSmallWindow();
            } else {
                swal({
                    title: 'Minimi is disabled by the server admin.',
                    type: 'error'
                });
            }
        }

        if (data.key == "d") {
            if (!(development !== true)) {
                soundmanager2_debugger();
            } else {
                swal({
                    title: 'Debugger is only available on development builds.',
                    type: 'error'
                });
            }
        }

        if (data.key == "l") {
            swal("You found a fucking easter egg. Now listen to the torture <3");
            soundManager.createSound({
                id: "oa_easteregg",
                volume: volume,
                url: "https://oa-yt.snowdns.de/?v=m7SNzJx05IE",
                autoPlay: true
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
        swal({
            title: langpack.hue.disabled,
            type: 'error'
        })
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

function sliderValue(vol) {
    //Joww, it's ja boy liturkey doing all the math boi
    var output = document.querySelector("#volumevalue");
    output.value = vol;
    output.style.left = vol * 2.4 + 'px';
}

function open_soundcloud() {
    swal({
        title: soundcloud_title,
        imageUrl: soundcloud_icon,
        showCancelButton: true,
        confirmButtonColor: "#3fa5ff",
        confirmButtonText: langpack.message.listen_on_soundcloud,
    }).then(function() {
        window.open(soundcloud_url);
    });
}

function addJs(url) {
    console.info("[ModManager] Attempting to add js file from " + url + ".");
    $.getScript(url, function() {
        console.info("[ModManager] Added js file from " + url + " successfully.");
    });
}

function addCss(url) {
    console.info("[ModManager] Attempting to add css file from " + url + ".");
    $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css" />');
    console.info("[ModManager] Added css file from location " + url + " successfully");
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


function trayItem(icon, callback) {
    this.ul = document.getElementById("icons");
    this.li = document.createElement("li");
    $('.icons').each(function () {
            $('.icons li').addClass('fa-mobile-hide');
    });
    this.ul.appendChild(document.createTextNode(''));
    this.ul.appendChild(this.li);
    this.li.innerHTML = '<i class="fa ' + icon + ' fa-2x footer-icon" aria-hidden="true" onclick="' + callback + '();"></i>';
    this.li.style.color = "#" + iconcolor;
    this.destroy = function() {
        this.li.remove();
    }
}


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

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    //connect to the craftmend server
    socketIo.connect();
}