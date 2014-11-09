/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />
/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/md5/md5.d.ts" />
/// <reference path="../../../typings/chrome/chrome.d.ts" />

import vm = require('vm');
import fs = require('fs');
import path = require('path');
import events = require('events');

import _ = require('underscore');
import chai = require('chai');

var EventEmitter = events.EventEmitter;
var expect = chai.expect;

interface OnBeforeRequestCallback {
    (details: { url: string }): { [key: string]: any };
}

/**
 * ライブラリ CybozuLabs.MD5 を文字列から読み込む
 */
function requireMd5(code: string): any {
    var context: { [key: string]: any } = {
        navigator: {
            // ライブラリ内部で Firefox との分岐で利用
            // Firefox 以外と判定されれば良いため、空白で OK
            userAgent: ''
        }
    };

    vm.runInNewContext(code, context);
    return context['CybozuLabs']; // グローバルに CybozuLabs が定義される
}

var base = path.join(__dirname, '../../../FC2VideoAvoidanceTool');
var code = fs.readFileSync(path.join(base, 'background/js/ginfo.js'), 'utf-8');
var md5 = requireMd5(fs.readFileSync(path.join(base, 'vendor/js/md5.js'), 'utf-8'));

// Chrome Extension API のモック (利用部分のみ)
var chromeEvents = new EventEmitter();
var chromeMock = {
    webRequest: {
        onBeforeRequest: {
            addListener: function () {
                chromeEvents.emit.apply(
                    chromeEvents, _.flatten(['onBeforeRequest', arguments]));
            }
        }
    }
};

var context: { [key: string]: any } = {};

describe('ginfo.ts', () => {
    beforeEach(() => {
        context = {
            _: _,
            CybozuLabs: md5,
            chrome: chromeMock,
            console: console
        }
    });

    afterEach(() => {
        chromeEvents.removeAllListeners();
    });

    // WebRequest のイベントリスナが登録されているか
    it('should add event listener of web request', () => {
        var called = false;
        chromeEvents.on('onBeforeRequest', () => {
            called = true;
        });

        vm.runInNewContext(code, context);
        expect(called).to.be.true;
    });

    // リダイレクトが行われているか
    it('redirect is running', () => {
        var callback: OnBeforeRequestCallback = null;
        chromeEvents.on('onBeforeRequest', (callback_: OnBeforeRequestCallback) => {
            callback = callback_;
        });

        vm.runInNewContext(code, context);

        var ret = callback({
            url: 'http://example.com/?v=foo&upid=foo'
        });

        expect(ret).to.have.keys('redirectUrl');
    });

    // 不正な URL でリダイレクトが行われていないか
    it('redirect isn\'t running with wrong url', () => {
        var callback: OnBeforeRequestCallback = null;
        chromeEvents.on('onBeforeRequest', (callback_: OnBeforeRequestCallback) => {
            callback = callback_;
        });

        vm.runInNewContext(code, context);

        var ret = callback({
            url: 'http://example.com/?vx=foo&upidx=foo'
        });

        expect(ret).to.not.have.keys('redirectUrl');
    });

    // リダイレクト URL が正しいかどうか調べる
    it('redirect url is valid', () => {
        var callback: OnBeforeRequestCallback = null;
        chromeEvents.on('onBeforeRequest', (callback_: OnBeforeRequestCallback) => {
            callback = callback_;
        });

        vm.runInNewContext(code, context);

        var ret = callback({
            url: 'http://example.com/?v=20141104NZZQgDYK&upid=20141104NZZQgDYK'
        });

        expect(ret).to.have.keys('redirectUrl');
        expect(ret['redirectUrl']).to.equal('http://video.fc2.com/ginfo.php?mimi=da7a59260038cf053c824d2148780475&v=20141104NZZQgDYK&upid=20141104NZZQgDYK&otag=1');
    });
});
