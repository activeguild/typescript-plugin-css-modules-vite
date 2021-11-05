"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var factory = function (mod) {
    var pluginModule = {
        create: create,
    };
    return pluginModule;
};
var create = function (info) {
    var ls = info.languageService;
    // オリジナルのメソッドを退避しておく
    var delegate = ls.getQuickInfoAtPosition;
    // tooltip用のメソッドを上書き
    ls.getQuickInfoAtPosition = function (fileName, position) {
        var result = delegate(fileName, position); // 元メソッドを呼び出す
        if (!result) {
            return result;
        }
        if (!result.displayParts || !result.displayParts.length) {
            return result;
        }
        // 結果を修正する
        result.displayParts = __spreadArray(__spreadArray([
            { kind: "", text: " 🎉🎉 " }
        ], result.displayParts, true), [
            { kind: "", text: " 🎉🎉 " },
        ], false);
        return result;
    };
    return ls;
};
module.exports = factory;
