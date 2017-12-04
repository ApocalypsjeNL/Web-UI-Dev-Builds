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
    if (youtubeId.includes('youtube.com')) {
        console.warn('[OpenAudio] [snowDNSException] Please use ID only. Correcting for you.');
        var getid = youtubeId.split("?v=");
        $.get("https://oa-yt.snowdns.de/ytdata.php?name=" + mcname + "&server=" + clientID + "&v=" + getid[1], function(data) {
            let json = JSON.parse(data);
            OpenAudioAPI.songNotification({
                songTitle: json["title"],
                songURL: 'https://www.youtube.com/watch?v=' + getid,
                songImage: json["thumbnail"]
            });
        });
        return "https://oa-yt.snowdns.de/?name=" + mcname + "&server=" + clientID + "&v=" + getid[1];
    } else if (youtubeId.includes('yout.ub/')) {
        console.warn('[OpenAudio] [snowDNSException] Please use ID only. Correcting for you.');
        var getid = youtubeId.split('youtu.be/');
        $.get("https://oa-yt.snowdns.de/ytdata.php?name=" + mcname + "&server=" + clientID + "&v=" + getid[1], function(data) {
            let json = JSON.parse(data);
            OpenAudioAPI.songNotification({
                songTitle: json["title"],
                songURL: 'https://www.youtube.com/watch?v=' + getid[1],
                songImage: json["thumbnail"]
            });
        });
        return "https://oa-yt.snowdns.de/?name=" + mcname + "&server=" + clientID + "&v=" + getid[1];
    } else {
        $.get("https://oa-yt.snowdns.de/ytdata.php?name=" + mcname + "&server=" + clientID + "&v=" + youtubeId, function(data) {
            let json = JSON.parse(data);
            OpenAudioAPI.songNotification({
                songTitle: json["title"],
                songURL: 'https://www.youtube.com/watch?v=' + youtubeId,
                songImage: json["thumbnail"]
            });
        });
        return "https://oa-yt.snowdns.de/?name=" + mcname + "&server=" + clientID + "&v=" + youtubeId;
    }
}

// YouTube Playlist Integration
// Warning: This will only work with /oa playlist and playlist regions
function getYouTubePlaylist(playlistID) {
    $.ajax({
        url: 'https://api.apocalypsje.ga/yt/YouTubePlayList.php?playlistId=' + playlistID,
        type: 'get',
        async: false,
        success: function (data) {
            var ids = data;
            $.each(ids, function(key, value) {
                AutoDj.AddSong("https://oa-yt.snowdns.de/?name=" + mcname + "&server=" + clientID + "&v=" + value);
            });
        }
    });
}

function getStackStorage(url) {
    return "https://api.apocalypsje.ga/stack.php?url=" + url;
}
