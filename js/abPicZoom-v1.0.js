/*!
 * abPicZoom 结合 agilebins 的组图预览放大镜效果 http://ab.geshai.com/demo/demo1/demo.html
 * 更多详尽信息请看官网：http://ab.geshai.com/other-plus/abPicZoom/abPicZoom.html
 *
 * 有疑难问题可选择QQ群① 158544200 或QQ群② 790370978 进行反馈
 *
 * Carlo,Cloud,Trdiotr
 *
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途
 *
 */

;(function ($) {
    $.fn.abPicZoom = function (__opts) {
        $.fn.abPicZoom.defaults = {
            _version: 1.0,
            marginLeft: 10,
            selectorWrapClass: "wrap",
            selector: "#img",
            selectorClass: "selector",
            selectorOpacity: 0.2,
            previewSrcName: "preview",
            previewClass: "preview",
            previewZindex: 999,
            speed: 0,
            delayTips: 2500,
            errorTips: "Load failed."
        };
        __opts = $.extend({}, $.fn.abPicZoom.defaults, __opts);

        // value
        var __V__ = {
            "i": "img",

            "sl": "f03dx",
            "slw": "f03dx-w",
            "slh": "f03dx-h",

            "sn": "abpzv",
            "sv": "yes",

            "w": "c7217b",
            "s": "e1072d",
            "p": "cd6a8e",
            "ifr": "ea531b"
        };

        function __px(__v) {
            return (__v) + "px";
        };

        function __isIe6() {
            return ($.browser.msie && $.browser.version < 7);
        };

        function __chkIsInit() {
            return (_thisBox.attr(__V__.sn) == __V__.sv);
        };

        function __isSelectorInit() {
            return (_curSelect.attr(__V__.sn) == __V__.sv);
        };

        function __chkImgLoad(__o) {
            return (__o.attr(__V__.sl) == __V__.sv);
        };

        function __isHidden(__el) {
            return __el.is(":hidden");
        };

        function __elSlideStop(__el) {
            return __el.stop(true, true);
        };

        function __setPosition(__e) {
            if (__e == null) {
                return false;
            }

            var __X = Math.max(0, __e.pageX - _curSelect.offset().left - _selectorW / 2);
            var __Y = Math.max(0, __e.pageY - _curSelect.offset().top - _selectorH / 2);

            // X
            __X = ((__X + _selectorW) > _sImgW ? (_sImgW - _selectorW) : __X) + ((_selectorElW - _sImgW) / 2);
            // Y
            __Y = ((__Y + _selectorH) > _sImgH ? (_sImgH - _selectorH) : __Y) + ((_selectorElH - _sImgH) / 2);

            // width | height
            if (_vImgW == null) {
                _vImgW = parseFloat(_curSelect.attr(__V__.slw) || 0);
                _vImgH = parseFloat(_curSelect.attr(__V__.slh) || 0);

                if (_vImgW < _selectorW || _vImgH < _selectorH) {
                    _vImgW = _sImgW;
                    _vImgH = _sImgH;
                }

                _previewBox.css("width", __px(_selectorW * _vImgW / _sImgW));
                _previewBox.css("height", __px(_selectorH * _vImgH / _sImgH));
            }

            // scroll-x
            var __scrollX = (__X * _vImgW / _sImgW) - ((_selectorElW - _sImgW) / 2);

            // scroll-y
            var __scrollY = (__Y * _vImgH / _sImgH) - ((_selectorElH - _sImgH) / 2);

            // preview box img
            _previewBox.find(__V__.i)
                .css({left: __px(__scrollX * -1), top: __px(__scrollY * -1)});

            // preview box
            _previewBox.css({
                top: __px(_thisBox.offset().top),
                left: __px(_thisBox.offset().left + _thisBox.outerWidth() + __opts.marginLeft)
            });

            return {left: __px(__X), top: __px(__Y)};
        };

        function __eventPosition(__e) {
            if(__e.stopPropagation) {
                __e.stopPropagation();
            }

            _selector.css(__setPosition(__e));
        };

        function __mouseenter(__e) {
            _curEvent = __e;
            // clear timer
            __clearTimer();

            // slide
            __elSlideStop(_selector).fadeIn(__opts.speed);
            // load
            __loadPreviewImg();
        };

        function __mousemove(__e) {
            _curEvent = __e;
            __eventPosition(__e);
        };

        function __mouseOut(__e) {
            // clear timer
            __clearTimer();

            if(__e.stopPropagation) {
                __e.stopPropagation();
            }

            if (!__isHidden(_selector)) {
                __elSlideStop(_selector).fadeOut(__opts.speed);
                __elSlideStop(_previewBox).fadeOut(__opts.speed);
            }
        };

        function __clearTimer() {
            if (!_timerId) {
                return false;
            }

            window.clearTimeout(_timerId);
        };

        function __loadTips(__s, __msg) {
            var __span = _previewBox.find("span");
            if (0 == __span.length) {
                _previewBox.append("<span style=\"position:absolute;z-index:2;width:100%;height:100%;line-height:55px;font-size:14px;text-align:center;color:#666666;background-color:#FFFFFF;\"></span>");
                __span = _previewBox.find("span");
            }

            __span.html(__msg || "Loading...");
            __span.css("display", true == __s ? "block" : "none");
        };

        function __imgLoad(__o, __src, __callback) {
            var __img = new Image();

            // load
            __img.onload = function() {
                // callback
                if (typeof(__callback) === "function") {
                    __callback(__img.width, __img.height);
                }
            };

            // error
            __img.onerror = function () {
                _curSelect.attr(__V__.sl, __V__.sv);
            };

            // src
            __img.src = __src;
        };

        function __loadPreviewImg() {
            // Is loaded ?
            if (__chkImgLoad(_curSelect)) {
                if (!_curSelect.attr(__V__.slw)) {
                    __loadTips(true, __opts.errorTips);
                } else {
                    __loadTips(false);
                }

                __elSlideStop(_previewBox).fadeIn(__opts.speed);
                _previewBox.find(__V__.i).attr("src", _curSelect.attr(__opts.previewSrcName));
                __eventPosition(_curEvent);
                return false;
            }

            // img load
            __imgLoad(_previewBox.find(__V__.i), _curSelect.attr(__opts.previewSrcName), function (__w, __h) {
                _vImgW = _vImgH = null;
                _curSelect
                    .attr(__V__.slw, __w)
                    .attr(__V__.slh, __h)
                    .attr(__V__.sl, __V__.sv);

                __loadTips(false);
                __elSlideStop(_previewBox).fadeIn(__opts.speed);
                _previewBox.find(__V__.i).attr("src", _curSelect.attr(__opts.previewSrcName));
                __eventPosition(_curEvent);
            });

            // timer
            _timerId = window.setTimeout(function () {
                if (_curSelect.attr(__V__.slw)) {
                    return true;
                }

                __loadTips(true);
                __elSlideStop(_previewBox).fadeIn(__opts.speed);
                _previewBox.find(__V__.i).attr("src", "");
                __eventPosition(_curEvent);
            }, __opts.delayTips);

            // clear src
            _previewBox.find(__V__.i).attr("src", "");
        };

        function __createIframeForIe6(__el) {
            if (__isIe6()) {
                var ifrStyle = {
                    position: "absolute",
                    display: "block",
                    "z-index": -1,
                    border: "none",
                    top: __px(0),
                    left: __px(0),
                    filter: "mask(color=#fff)",
                    width: __px($(window).width()),
                    height: __px($(window).height())
                };

                __el.append("<iframe id=\"" + __V__.ifr + "\"></iframe>");
                $("iframe[id='" + __V__.ifr + "']").css(ifrStyle);
            }
        };

        function __selectorInit() {
            var __elStr = "div[ab-selector='" + __V__.s + "']";

            // check
            if (!__isSelectorInit()) {
                var __html = "<div ab-selector=\"" + __V__.s + "\" class=\"" + __opts.selectorClass + "\" style=\"display:none;position:absolute; z-index:1;\"></div>";

                // selector html
                _selectorEl.append(__html);

                // for ie6
                if (__isIe6()) {
                    $(__elStr, _selectorEl).css("background-color", "#3D6ECE");
                }

                // opacity
                $(__elStr, _selectorEl).css("opacity", __opts.selectorOpacity);
            }

            return $(__elStr, _selectorEl);
        };

        function __previewInit() {
            var __elStr = "div[ab-preview='" + __V__.p + "']";

            // check
            if (!__chkIsInit()) {
                var __html = "<div ab-preview=\"" + __V__.p + "\" class=\"" + __opts.previewClass + "\" style=\"display:none;position:absolute;background-color:#FFFFFF;overflow:hidden;z-index:" + __opts.previewZindex + ";\"><img src=\"\" style=\"position:absolute;\" /></div>";

                // preview
                _thisBox.append(__html);

                // for ie6
                __createIframeForIe6($(__elStr, _thisBox));
            }

            return $(__elStr, _thisBox);
        };

        function __wrap() {
            if (__isSelectorInit()) {
                return _curSelect.parent();
            }

            // html
            var __html = "<div ab-wrap=\"" + __V__.w + "\" class=\"" + __opts.selectorWrapClass + "\" style=\"position:relative;\"></div>";
            _curSelect.wrap(__html);

            return _curSelect.parent()
                .css("width", __px(_sImgW))
                .css("height", __px(_sImgH));
        };

        function __init() {
            // tips
            __loadTips(false);
            // x | y
            _previewBox.scrollLeft(0).scrollTop(0);

            // img preload
            __imgLoad(_previewBox.find(__V__.i), _curSelect.attr(__opts.previewSrcName), function (__w, __h) {
                _curSelect
                    .attr(__V__.slw, __w)
                    .attr(__V__.slh, __h)
                    .attr(__V__.sl, __V__.sv);
            });

            // bind
            _selectorEl.unbind()
                .mouseenter(__mouseenter)
                .mousemove(__mousemove)
                .mouseleave(__mouseOut);

            // selector flag
            _curSelect.attr(__V__.sn, __V__.sv);
            // common flag
            _thisBox.attr(__V__.sn, __V__.sv);
        };

        // var
        var _thisBox = $(this);
        var _curSelect = $(__opts.selector, _thisBox);

        var _sImgW = _curSelect.width();
        var _sImgH = _curSelect.height();

        var _selectorEl = __wrap();
        var _selector = __selectorInit();
        var _previewBox = __previewInit();

        var _selectorW = _selector.width();
        var _selectorH = _selector.height();

        var _selectorElW = _selectorEl.outerWidth();
        var _selectorElH = _selectorEl.outerHeight();

        var _vImgW = null, _vImgH = null, _curEvent = null, _timerId = null;

        // init
        __init();
    }
})(jQuery);