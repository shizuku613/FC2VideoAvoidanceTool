/// <reference path="../../../typings/chrome/chrome.d.ts" />
/// <reference path="../../../typings/md5/md5.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

module fc2.video.background {
    var FC2_MAGICK = '_gGddgPfeaf_gzyr';

    function parseParams(str: string) {
        var params: { [key: string]: string } = {};
        var pairs = str.split('&');

        _.each(pairs, pair => {
            var index = pair.indexOf('=');

            if (index > 0) {
                var key = pair.slice(0, index);
                var value = pair.slice(index + 1);
                params[key] = value;
            }
        });

        return params;
    }

    function getVideoInfoUrl(vid: string): string {
        var getInfoUrl = 'http://video.fc2.com/ginfo.php?mimi=' +
            CybozuLabs.MD5.calc(vid + FC2_MAGICK) +
            '&v=' + vid + '&upid=' + vid + '&otag=1';

        return getInfoUrl;
    }

    chrome.webRequest.onBeforeRequest.addListener(
        details => {
            var params = parseParams(details.url);
            var vid = params['v'] || params['upid'];

            if (!vid) {
                return {};
            }

            var newUrl = getVideoInfoUrl(vid);

            if (typeof DEBUG !== 'undefined') {
                console.log(newUrl);
            }

            return { redirectUrl: newUrl };
        },
        {
            urls: ['*://video.fc2.com/ginfo.php*']
        },
        [
            "blocking"
        ]);
}