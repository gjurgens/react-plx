'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;
var instancesCount = 0;

var INTERVAL = 16;

// CustomEvent polyfill
if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
  var _CustomEvent = function _CustomEvent(event) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { bubbles: false, cancelable: false, detail: undefined };

    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  _CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = _CustomEvent;
}

var ScrollManager = function () {
  function ScrollManager() {
    var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INTERVAL;

    _classCallCheck(this, ScrollManager);

    instancesCount++;
    if (instance) {
      return instance;
    }

    instance = this;

    // Bind handlers
    this.handleInterval = this.handleInterval.bind(this);

    this.intervalID = setInterval(this.handleInterval, interval);
  }

  _createClass(ScrollManager, [{
    key: 'destroy',
    value: function destroy() {
      instancesCount--;

      if (instancesCount === 0) {
        // Clear sinfleton instance
        instance = null;
        // Remove and reset interval/animationFrame
        clearInterval(this.intervalID);
        this.intervalID = null;
      }
    }
  }, {
    key: 'getWindowScrollTop',
    value: function getWindowScrollTop() {
      // Get scroll position, with IE fallback
      return window.pageYOffset || document.documentElement.scrollTop;
    }
  }, {
    key: 'handleInterval',
    value: function handleInterval() {
      var newScrollPosition = this.getWindowScrollTop();

      // Fire the event only when scroll position is changed
      if (newScrollPosition !== this.scrollPosition) {
        this.scrollPosition = newScrollPosition;

        var event = new CustomEvent('plx-scroll', {
          detail: {
            scrollPosition: newScrollPosition
          }
        });

        // Dispatch the event.
        window.dispatchEvent(event);
      }
    }
  }]);

  return ScrollManager;
}();

exports.default = ScrollManager;