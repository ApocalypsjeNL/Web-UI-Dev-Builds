/**
 * @copyright 2017 Mindgamesnl
 *
 * @license
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

soundManager.setup({
    defaultOptions: {
        onfinish: function() {
            var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
            handleSoundEnd(this.id);
            soundManager.destroySound(this.id);
            if (this.id !== "oa_back_" + randomID) {
                onSoundEnd();
            }
        },
        onplay: function() {
            var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
            if (this.id !== "oa_back_" + randomID) {
                onSoundPlay();
            }
        },
        onstop: function() {
            var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
            if (this.id !== "oa_back_" + randomID) {
                onSoundEnd();
            }
        },
        onerror: function(code, description) {
            var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
            if (this.id !== "oa_back_" + randomID) {
                soundManager._writeDebug("[SoundManager2] oa_back_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopBackground("oa_back_" + randomID);
                    soundManager.destroySound("oa_back_" + randomID);
                } else {
                    soundManager._writeDebug("Unable to decode oa_back_" + randomID + ". Well shit.", 3);
                }
            }
        },
        volume: volume
    }
});

function onSoundPlay() {
    var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
    if (listSounds().includes("oa_back_" + randomID) && ambiance !== "") {
        openaudio.stopBackground();
    }
    try {
        clearTimeout(ambtimer);
        openaudio.stopBackground();
    } catch(e) {}
}

function onSoundEnd() {
    ambtimer = setTimeout(function() {
        if (listSounds().length === 0 && ambiance !== "") {
            if (ambiance.includes("soundcloud.com")) {
                var scurl = ambiance;
                getSoundcloud(scurl, function (newurl) {
                    openaudio.sartBackground(newurl);
                });
            } else if (ambiance.includes("youtube.com")) {
                var youtubeId = request.src.split("?v=");
                openaudio.sartBackground(getYoutbe(youtubeId));
            } else if (ambiance.includes("youtu.be")) {
                var youtubeId = ambiance.split('youtu.be/');
                openaudio.sartBackground(getYoutbe(youtubeId));
            } else if (ambiance.includes("stackstorage.com/s/")) {
                openaudio.sartBackground(getStackStorage(ambiance));
            } else {
                openaudio.sartBackground(ambiance);
            }
        }
    }, ambdelay);
}



function handleSoundEnd(fullId) {
    var id = fullId.split("_")[2];
    if (id !== "undefined") {
        var whisper = {};
        whisper.command = "SoundEnded";
        whisper.id = id;
        openaudio.whisper(JSON.stringify(whisper));
    }
}


openaudio.play = function(src_fo_file, soundID, defaultTime) {
    if (!closedwreason) {
        var randomID = Math.floor(Math.random() * 60) + 1 + "_";
        if (soundID === null) {
            var songID = randomID;
        } else {
            var songID = soundID;
        }

        if (defaultTime === null) {
            var defaultTime = 0;
        }

        var soundId = "play";
        if (isFading[songID] === true) {
            stopFading[songID] = true;
        }
        var mySoundObject = soundManager.createSound({
            id: "play_" + songID,
            url: src_fo_file,
            volume: volume,
            from: defaultTime,
            autoPlay: true
        });

        openaudio.stopPlay = function () {
            fadeIdOut("play_" + songID);
        }
    } else {
        console.error("[OpenAudio] An error has occured while loading this function.");
    }
}

openaudio.sartBackground = function(url) {
    if (!closedwreason) {
        var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
        var backgroundSound = soundManager.createSound({
            id: "oa_back_" + randomID,
            url: url,
            autoPlay: true,
            volume: volume,
            onfinish: function () {
                if (!closedwreason) {
                    this.stream = true;
                    this.from = 0;
                    this.play();
                } else {
                    console.error("[OpenAudio] An error has occured while loading this function.");
                }
            },
            onerror: function (code, description) {
                soundManager._writeDebug("oa_back_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopLoop();
                } else {
                    soundManager._writeDebug("Unable to decode oa_back_" + randomID + ". Well shit.", 3);
                }
            }
        });
        fadeIdTarget("oa_back_" + randomID);

        openaudio.stopBackground = function () {
            fadeIdOut("oa_back_" + randomID);
        };
    } else {
        console.error("[OpenAudio] An error has occured while loading this function.");
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


/*
* Looping handler
*/
openaudio.loop = function(url, defaultTime) {
    if (!closedwreason) {
        var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio

        soundManager.stop("loop_" + randomID);
        soundManager.destroySound("loop_" + randomID);
        var loopnu = soundManager.createSound({
            id: "loop_" + randomID,
            url: url,
            volume: volume,
            autoPlay: true,
            from: defaultTime * 1000,
            onfinish: function () {
                if (!closedwreason) {
                    this.stream = true;
                    this.from = 0;
                    this.play();
                } else {
                    console.error("[OpenAudio] An error has occured while loading this function.");
                }
            },
            onerror: function (code, description) {
                soundManager._writeDebug("loop_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopLoop();
                } else {
                    soundManager._writeDebug("Unable to decode loop_" + randomID + ". Well shit.", 3);
                }
            }
        });

        openaudio.stopLoop = function() {
            fadeIdOut("loop_" + randomID);
        };
    } else {
        console.error("[OpenAudio] An error has occured while loading this function.");
    }
};

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

        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: "[PlaylistManager] Loaded " + loadedcount + " songs.",
            timeout: 10000
        };
        notification.MaterialSnackbar.showSnackbar(data);
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

        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
            message: "[PlaylistManager] Failed to play song #" + FNC_ID + ". Skipping to next song.",
            timeout: 100
        };
        notification.MaterialSnackbar.showSnackbar(data);
    }
};
AutoDj.SoundManager_Play = function(fnc_file, id) {
    if (!closedwreason) {
        var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
        var mySoundObject = soundManager.createSound({
            id: "AutoDj_" + id + "_" + randomID,
            url: fnc_file,
            volume: volume,
            autoPlay: true,
            onfinish: function () {
                AutoDj.PlayNext();
            },
            onerror: function () {
                console.error("AutoDj: An error occured while playing ID: " + id + ". Check the URL in playlist.yml. Playing next song in playlist");
                soundManager.destroySound("AutoDj_" + id + "_" + randomID);
                AutoDj.PlayNext();

                var notification = document.querySelector('.mdl-js-snackbar');
                var data = {
                    message: "[PlaylistManager] Failed to play song #" + id + ". Skipping to next song.",
                    timeout: 100
                };
                notification.MaterialSnackbar.showSnackbar(data);
            }
        });

        if (fnc_file.includes("oa-yt.snowdns.de")) {
            curl = fnc_file.toString().split('&v=')[1];
            $.get("https://oa-yt.snowdns.de/ytdata.php?name=" + mcname + "&server=" + clientID + "&v=" + curl, function (data) {
                let json = JSON.parse(data);
                OpenAudioAPI.songNotification({
                    songTitle: json["title"],
                    songURL: 'https://www.youtube.com/watch?v=' + curl,
                    songImage: json["thumbnail"]
                });
            });
        }
    } else {
        console.error("[OpenAudio] An error has occured while loading this function.");
    }

    AutoDj.stopPlaylist = function() {
        fadeIdOut("AutoDj_" + id + "_" + randomID);
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

/*
*  Region Handler
*/
openaudio.playRegion = function(url, defaultTime) {
    if (!closedwreason) {
        var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
        openaudio.stopBackground();
        soundManager.stop("oa_region_" + randomID);
        soundManager.destroySound("oa_region_" + randomID);
        var regionsounds = soundManager.createSound({
            id: "oa_region_" + randomID,
            url: url,
            volume: volume,
            from: defaultTime * 1000,
            autoPlay: true,
            onplay: function () {
                soundManager.getSoundById("oa_region_" + randomID).metadata.region = true;
            },
            onfinish: function () {
                if (!closedwreason) {
                    this.stream = true;
                    this.from = 0;
                    this.play();
                } else {
                    console.error("[OpenAudio] An error has occured while loading this function.");
                }
            },
            onerror: function (code, description) {
                soundManager._writeDebug("oa_region_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.stopRegion();
                } else {
                    soundManager._writeDebug("Unable to decode oa_region_" + randomID + ". Well shit.", 3);
                }
            }
        });
    } else {
        console.error("[OpenAudio] An error has occured while loading this function.");
    }

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
};

/*
* Speaker Handler
*/
openaudio.newspeaker = function(url, defaultTime, requestvol) {
    if (!closedwreason) {
        var randomID = Math.floor(Math.random() * 60) + 1 + "_"; // MultiShot Disabled Fix to still play multiple sounds without ghost audio
        soundManager.stop("speaker_ding_" + randomID);
        soundManager.destroySound("speaker_ding_" + randomID);
        var speakersound = soundManager.createSound({
            id: "speaker_ding_" + randomID,
            url: url,
            volume: 0,
            autoPlay: true,
            from: defaultTime * 1000,
            onplay: function () {
                soundManager.getSoundById("speaker_ding_" + randomID, volume).metadata.speaker = true;
                fadeSpeaker2("speaker_ding_" + randomID, ((requestvol / 100) * volume))
            }, onfinish: function () {
                if (!closedwreason) {
                    this.stream = true;
                    this.from = 0;
                    this.play();
                } else {
                    console.error("[OpenAudio] An error has occured while loading this function.");
                }
            }, onerror: function (code, description) {
                soundManager._writeDebug("speaker_ding_" + randomID + " failed?", 3, code, description);
                if (this.loaded) {
                    openaudio.removeSpeaker();
                } else {
                    soundManager._writeDebug("Unable to decode speaker_ding_" + randomID + ". Well shit.", 3);
                }
            }
        });
    } else {
        console.error("[OpenAudio] An error has occured while loading this function.");
    }

    openaudio.removeSpeaker = function(id) {
        fadeSpeakerOut("speaker_ding_" + randomID);
    };
};
