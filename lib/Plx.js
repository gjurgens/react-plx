'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bezierEasing = require('bezier-easing');

var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

var _scrollManager = require('./scroll-manager');

var _scrollManager2 = _interopRequireDefault(_scrollManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_UNIT = '';
var DEFAULT_TRANSFORM_UNIT = 'px';
var DEFAULT_ANGLE_UNIT = 'deg';
var ANGLE_PROPERTIES = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY', 'skewZ'];

var EASINGS = {
  ease: [0.25, 0.1, 0.25, 1.0],
  easeIn: [0.42, 0.0, 1.00, 1.0],
  easeOut: [0.00, 0.0, 0.58, 1.0],
  easeInOut: [0.42, 0.0, 0.58, 1.0],
  easeInSine: [0.47, 0, 0.745, 0.715],
  easeOutSine: [0.39, 0.575, 0.565, 1],
  easeInOutSine: [0.445, 0.05, 0.55, 0.95],
  easeInQuad: [0.55, 0.085, 0.68, 0.53],
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
  easeInCubic: [0.55, 0.055, 0.675, 0.19],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeInQuart: [0.895, 0.03, 0.685, 0.22],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeInOutQuart: [0.77, 0, 0.175, 1],
  easeInQuint: [0.755, 0.05, 0.855, 0.06],
  easeOutQuint: [0.23, 1, 0.32, 1],
  easeInOutQuint: [0.86, 0, 0.07, 1],
  easeInExpo: [0.95, 0.05, 0.795, 0.035],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutExpo: [1, 0, 0, 1],
  easeInCirc: [0.6, 0.04, 0.98, 0.335],
  easeOutCirc: [0.075, 0.82, 0.165, 1],
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86]
};

// Color regexs

// 0 - 199 | 200 - 249 | 250 - 255
var REGEX_0_255 = '(1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])';
// 0.0 - 1.9999...
var REGEX_0_1 = '([01](\\.\\d+)?)';
// 00 - FF
var REGEX_TWO_HEX_DIGITS = '([a-f\\d]{2})';

var HEX_REGEX = new RegExp('^#' + REGEX_TWO_HEX_DIGITS + REGEX_TWO_HEX_DIGITS + REGEX_TWO_HEX_DIGITS + '$', 'i');
var RGB_REGEX = new RegExp('^rgb\\(' + REGEX_0_255 + ',' + REGEX_0_255 + ',' + REGEX_0_255 + '\\)$', 'i');
var RGBA_REGEX = new RegExp('^rgba\\(' + REGEX_0_255 + ',' + REGEX_0_255 + ',' + REGEX_0_255 + ',' + REGEX_0_1 + '\\)$', 'i');

var SCROLL_OFFSET = 50;

var RESIZE_DEBOUNCE_TIMEOUT = 150;

// CSS transform map
var TRANSFORM_MAP = {
  rotate: function rotate(value, unit) {
    return 'rotate(' + value + unit + ')';
  },
  rotateX: function rotateX(value, unit) {
    return 'rotateX(' + value + unit + ')';
  },
  rotateY: function rotateY(value, unit) {
    return 'rotateY(' + value + unit + ')';
  },
  rotateZ: function rotateZ(value, unit) {
    return 'rotateZ(' + value + unit + ')';
  },
  scale: function scale(value) {
    return 'scale(' + value + ')';
  },
  scaleX: function scaleX(value) {
    return 'scaleX(' + value + ')';
  },
  scaleY: function scaleY(value) {
    return 'scaleY(' + value + ')';
  },
  scaleZ: function scaleZ(value) {
    return 'scaleZ(' + value + ')';
  },
  skew: function skew(value, unit) {
    return 'skew(' + value + unit + ')';
  },
  skewX: function skewX(value, unit) {
    return 'skewX(' + value + unit + ')';
  },
  skewY: function skewY(value, unit) {
    return 'skewY(' + value + unit + ')';
  },
  skewZ: function skewZ(value, unit) {
    return 'skewZ(' + value + unit + ')';
  },
  translateX: function translateX(value, unit) {
    return 'translateX(' + value + unit + ')';
  },
  translateY: function translateY(value, unit) {
    return 'translateY(' + value + unit + ')';
  },
  translateZ: function translateZ(value, unit) {
    return 'translateZ(' + value + unit + ')';
  }
};

// Order of CSS transforms matter
// so custom order is used
var ORDER_OF_TRANSFORMS = ['translateX', 'translateY', 'translateZ', 'skew', 'skewX', 'skewY', 'skewZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ'];

// CSS properties that use color values
var COLOR_PROPERTIES = ['backgroundColor', 'color', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor'];

var Plx = function (_Component) {
  _inherits(Plx, _Component);

  function Plx(props) {
    _classCallCheck(this, Plx);

    var _this = _possibleConstructorReturn(this, (Plx.__proto__ || Object.getPrototypeOf(Plx)).call(this, props));

    var interval = props.interval;

    // Check for universal apps

    if (typeof window !== 'undefined') {
      // Get scroll manager singleton
      _this.scrollManager = new _scrollManager2.default(interval);
    }

    // Binding handlers
    _this.handleScrollChange = _this.handleScrollChange.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);

    _this.state = {
      hasReceivedScrollEvent: false,
      plxStyle: {},
      plxStateClasses: ''
    };
    return _this;
  }

  _createClass(Plx, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // Check for universal apps
      if (typeof window !== 'undefined') {
        window.addEventListener('plx-scroll', this.handleScrollChange);
        window.addEventListener('resize', this.handleResize);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.update(this.scrollManager.getWindowScrollTop(), nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('plx-scroll', this.handleScrollChange);
      window.removeEventListener('resize', this.handleResize);

      clearTimeout(this.resizeDebounceTimeoutID);
      this.resizeDebounceTimeoutID = null;

      this.scrollManager.destroy();
      this.scrollManager = null;
    }
  }, {
    key: 'getElementTop',
    value: function getElementTop(el) {
      var top = 0;
      var element = el;

      do {
        top += element.offsetTop || 0;
        element = element.offsetParent;
      } while (element);

      return top;
    }
  }, {
    key: 'getUnit',
    value: function getUnit(property, unit) {
      var propertyUnit = unit || DEFAULT_UNIT;

      if (Object.getOwnPropertyNames(TRANSFORM_MAP).indexOf(property) > -1) {
        propertyUnit = unit || DEFAULT_TRANSFORM_UNIT;
      }

      if (ANGLE_PROPERTIES.indexOf(property) > -1) {
        propertyUnit = unit || DEFAULT_ANGLE_UNIT;
      }

      return propertyUnit;
    }
  }, {
    key: 'hexToObject',
    value: function hexToObject(hex) {
      // Convert #abc to #aabbcc
      var color = hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
      var result = HEX_REGEX.exec(color);

      // Safety check, if color is in the wrong format
      if (!result) {
        console.log('Plx, ERROR: hex color is not in the right format: "' + hex + '"'); // eslint-disable-line no-console
        return null;
      }

      // All color functions are returning { r, g, b, a } object
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
      };
    }
  }, {
    key: 'rgbToObject',
    value: function rgbToObject(rgb) {
      var isRgba = rgb.toLowerCase().indexOf('rgba') === 0;
      var color = rgb.replace(/ /g, '');
      var result = isRgba ? RGBA_REGEX.exec(color) : RGB_REGEX.exec(color);

      // Safety check, if color is in the wrong format
      if (!result) {
        console.log('Plx, ERROR: rgb or rgba color is not in the right format: "' + rgb + '"'); // eslint-disable-line
        return null;
      }

      // All color functions are returning { r, g, b, a } object
      return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
        a: isRgba ? parseFloat(result[4]) : 1
      };
    }
  }, {
    key: 'colorParallax',
    value: function colorParallax(scrollPosition, start, duration, startValue, endValue, easing) {
      var startObject = null;
      var endObject = null;

      if (startValue[0].toLowerCase() === 'r') {
        startObject = this.rgbToObject(startValue);
      } else {
        startObject = this.hexToObject(startValue);
      }

      if (endValue[0].toLowerCase() === 'r') {
        endObject = this.rgbToObject(endValue);
      } else {
        endObject = this.hexToObject(endValue);
      }

      if (startObject && endObject) {
        var r = this.parallax(scrollPosition, start, duration, startObject.r, endObject.r, easing);
        var g = this.parallax(scrollPosition, start, duration, startObject.g, endObject.g, easing);
        var b = this.parallax(scrollPosition, start, duration, startObject.b, endObject.b, easing);
        var a = this.parallax(scrollPosition, start, duration, startObject.a, endObject.a, easing);

        return 'rgba(' + parseInt(r, 10) + ', ' + parseInt(g, 10) + ', ' + parseInt(b, 10) + ', ' + a + ')';
      }

      return null;
    }
  }, {
    key: 'parallax',
    value: function parallax(scrollPosition, start, duration, startValue, endValue, easing) {
      var min = startValue;
      var max = endValue;
      var invert = startValue > endValue;

      // Safety check, if "startValue" is in the wrong format
      if (typeof startValue !== 'number') {
        console.log('Plx, ERROR: startValue is not a number, but "' + (typeof endValue === 'undefined' ? 'undefined' : _typeof(endValue)) + '": "' + endValue + '"'); // eslint-disable-line
        return null;
      }

      // Safety check, if "endValue" is in the wrong format
      if (typeof endValue !== 'number') {
        console.log('Plx, ERROR: endValue is not a number, but "' + (typeof endValue === 'undefined' ? 'undefined' : _typeof(endValue)) + '": "' + endValue + '"'); // eslint-disable-line
        return null;
      }

      if (invert) {
        min = endValue;
        max = startValue;
      }

      var percentage = (scrollPosition - start) / duration;

      if (percentage > 1) {
        percentage = 1;
      } else if (percentage < 0) {
        percentage = 0;
      }

      // Apply easing
      if (easing) {
        var easingPropType = typeof easing === 'undefined' ? 'undefined' : _typeof(easing);
        if (easingPropType === 'object' && easing.length === 4) {
          percentage = (0, _bezierEasing2.default)(easing[0], easing[1], easing[2], easing[3])(percentage);
        } else if (easingPropType === 'string' && EASINGS[easing]) {
          percentage = (0, _bezierEasing2.default)(EASINGS[easing][0], EASINGS[easing][1], EASINGS[easing][2], EASINGS[easing][3])(percentage);
        } else if (easingPropType === 'function') {
          percentage = easing(percentage);
        }
      }

      var value = percentage * (max - min);

      if (invert) {
        value = max - value;
      } else {
        value += min;
      }

      return value.toFixed(2);
    }
  }, {
    key: 'handleResize',
    value: function handleResize() {
      var _this2 = this;

      clearTimeout(this.resizeDebounceTimeoutID);

      this.resizeDebounceTimeoutID = setTimeout(function () {
        _this2.update(_this2.scrollManager.getWindowScrollTop(), _this2.props);
      }, RESIZE_DEBOUNCE_TIMEOUT);
    }
  }, {
    key: 'handleScrollChange',
    value: function handleScrollChange(e) {
      this.update(e.detail.scrollPosition, this.props);
    }
  }, {
    key: 'update',
    value: function update(scrollPosition, props) {
      var _this3 = this;

      var parallaxData = props.parallaxData,
          animateWhenNotInViewport = props.animateWhenNotInViewport;
      var _state = this.state,
          hasReceivedScrollEvent = _state.hasReceivedScrollEvent,
          plxStyle = _state.plxStyle,
          plxStateClasses = _state.plxStateClasses;

      // Check if element is in viewport
      // Small offset is added to prevent page jumping

      if (!animateWhenNotInViewport) {
        var rect = this.element.getBoundingClientRect();
        var isTopAboveBottomEdge = rect.top < window.innerHeight + SCROLL_OFFSET;
        var isBottomBellowTopEdge = rect.top + rect.height > -SCROLL_OFFSET;

        if (!isTopAboveBottomEdge || !isBottomBellowTopEdge) {
          return;
        }
      }

      var newState = {};
      var newStyle = {
        transform: {}
      };

      if (!hasReceivedScrollEvent) {
        newState.hasReceivedScrollEvent = true;
      }

      var appliedProperties = [];
      var segments = [];
      var isInSegment = false;
      var lastSegmentScrolledBy = null;

      var _loop = function _loop(i) {
        var _parallaxData$i = parallaxData[i],
            start = _parallaxData$i.start,
            duration = _parallaxData$i.duration,
            offset = _parallaxData$i.offset,
            properties = _parallaxData$i.properties,
            easing = _parallaxData$i.easing;


        var scrollOffset = offset || 0;

        var startPosition = start;
        var element = _this3.element;

        if (start === 'top') {
          startPosition = _this3.getElementTop(_this3.element);
        } else if (
        // Percentage start
        typeof start === 'string' && start.search('%') === start.length - 1 && _this3.isNumber(start.substr(0, start.length - 1))) {
          var percentageValue = parseFloat(start) / 100;
          var maxScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;

          startPosition = maxScroll * percentageValue;
        } else if (typeof start === 'string') {
          element = document.querySelector(start);

          if (!element) {
            console.log('Plx, ERROR: start selector matches no elements: "' + start + '"'); // eslint-disable-line no-console
            return {
              v: void 0
            };
          }

          startPosition = _this3.getElementTop(element);
        }

        startPosition += scrollOffset;
        var parallaxDuration = duration;

        if (duration === 'height') {
          parallaxDuration = element.offsetHeight;
        } else if (
        // Percentage duration
        typeof duration === 'string' && duration.search('%') === duration.length - 1 && _this3.isNumber(duration.substr(0, duration.length - 1))) {
          var _percentageValue = parseFloat(duration) / 100;
          var _maxScroll = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;

          parallaxDuration = _maxScroll * _percentageValue;
        } else if (typeof duration === 'string') {
          var durationElement = document.querySelector(duration);

          if (!durationElement) {
            console.log('Plx, ERROR: duration selector matches no elements: "' + duration + '"'); // eslint-disable-line
            return {
              v: void 0
            };
          }

          parallaxDuration = _this3.getElementTop(durationElement);
        }

        var endPosition = startPosition + parallaxDuration;

        // If segment is bellow scroll position skip it
        if (scrollPosition < startPosition) {
          return 'break';
        }

        var isScrolledByStart = scrollPosition >= startPosition;

        if (isScrolledByStart) {
          lastSegmentScrolledBy = i;
        }

        // If active segment exists, apply his properties
        if (scrollPosition >= startPosition && scrollPosition <= endPosition) {
          isInSegment = true;

          properties.forEach(function (propertyData) {
            var startValue = propertyData.startValue,
                endValue = propertyData.endValue,
                property = propertyData.property,
                unit = propertyData.unit;

            appliedProperties.push(property);

            // Get CSS unit
            var propertyUnit = _this3.getUnit(property, unit);

            // Set default parallax method
            var parallaxMethod = _this3.parallax.bind(_this3);

            // If property is one of the color properties
            // Use it's parallax method
            if (COLOR_PROPERTIES.indexOf(property) > -1) {
              parallaxMethod = _this3.colorParallax.bind(_this3);
            }

            // Get new CSS value
            var value = parallaxMethod(scrollPosition, startPosition, parallaxDuration, startValue, endValue, easing);

            // Get transform function
            var transformMethod = TRANSFORM_MAP[property];

            if (transformMethod) {
              // Transforms, apply value to transform function
              newStyle.transform[property] = transformMethod(value, propertyUnit);
            } else {
              // All other properties
              newStyle[property] = value.toString() + propertyUnit;
            }
          });
        } else {
          // Push non active segments above the scroll position to separate array
          // This way "parallaxDuration" and "startPosition" are not calculated again
          // and segments bellow scroll position are skipped in the next step
          segments.push({
            parallaxDuration: parallaxDuration,
            properties: properties,
            startPosition: startPosition
          });
        }
      };

      _loop2: for (var i = 0; i < parallaxData.length; i++) {
        var _ret = _loop(i);

        switch (_ret) {
          case 'break':
            break _loop2;

          default:
            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
      }

      // These are only segments that are completly above scroll position


      segments.forEach(function (data) {
        var properties = data.properties,
            startPosition = data.startPosition,
            parallaxDuration = data.parallaxDuration,
            easing = data.easing;


        properties.forEach(function (propertyData) {
          var startValue = propertyData.startValue,
              endValue = propertyData.endValue,
              property = propertyData.property,
              unit = propertyData.unit;

          // Skip propery that was changed for current segment

          if (appliedProperties.indexOf(property) > -1) {
            return;
          }

          // Get CSS unit
          var propertyUnit = _this3.getUnit(property, unit);

          // Set default parallax method
          var parallaxMethod = _this3.parallax.bind(_this3);

          // If property is one of the color properties
          // Use it's parallax method
          if (COLOR_PROPERTIES.indexOf(property) > -1) {
            parallaxMethod = _this3.colorParallax.bind(_this3);
          }

          // Get new CSS value
          var value = parallaxMethod(scrollPosition, startPosition, parallaxDuration, startValue, endValue, easing);

          // Get transform function
          var transformMethod = TRANSFORM_MAP[property];

          if (transformMethod) {
            // Transforms, apply value to transform function
            newStyle.transform[property] = transformMethod(value, propertyUnit);
          } else {
            // All other properties
            newStyle[property] = value.toString() + propertyUnit;
          }
        });
      });

      // Sort transforms by ORDER_OF_TRANSFORMS
      var transformsOrdered = [];

      ORDER_OF_TRANSFORMS.forEach(function (transformKey) {
        if (newStyle.transform[transformKey]) {
          transformsOrdered.push(newStyle.transform[transformKey]);
        }
      });

      // Concat transforms and add browser prefixes
      newStyle.transform = transformsOrdered.join(' ');
      newStyle.WebkitTransform = newStyle.transform;
      newStyle.MozTransform = newStyle.transform;
      newStyle.OTransform = newStyle.transform;
      newStyle.msTransform = newStyle.transform;

      // "Stupid" check if style should be update
      if (JSON.stringify(plxStyle) !== JSON.stringify(newStyle)) {
        newState.plxStyle = newStyle;
      }

      // Adding state class
      var newPlxStateClasses = null;

      if (lastSegmentScrolledBy === null) {
        newPlxStateClasses = 'Plx--above';
      } else if (lastSegmentScrolledBy === parallaxData.length - 1 && !isInSegment) {
        newPlxStateClasses = 'Plx--bellow';
      } else if (lastSegmentScrolledBy !== null && isInSegment) {
        var segmentName = parallaxData[lastSegmentScrolledBy].name || lastSegmentScrolledBy;

        newPlxStateClasses = 'Plx--active Plx--in Plx--in-' + segmentName;
      } else if (lastSegmentScrolledBy !== null && !isInSegment) {
        var _segmentName = parallaxData[lastSegmentScrolledBy].name || lastSegmentScrolledBy;
        var nextSegmentName = parallaxData[lastSegmentScrolledBy + 1].name || lastSegmentScrolledBy;

        newPlxStateClasses = 'Plx--active Plx--between Plx--between-' + _segmentName + '-and-' + nextSegmentName;
      }

      if (newPlxStateClasses !== plxStateClasses) {
        newState.plxStateClasses = newPlxStateClasses;
      }

      if (Object.keys(newState).length) {
        requestAnimationFrame(function () {
          _this3.setState(newState);
        });
      }
    }
  }, {
    key: 'isNumber',
    value: function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }, {
    key: 'omit',
    value: function omit(object, keysToOmit) {
      var result = {};

      Object.keys(object).forEach(function (key) {
        if (keysToOmit.indexOf(key) === -1) {
          result[key] = object[key];
        }
      });

      return result;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          style = _props.style;
      var _state2 = this.state,
          hasReceivedScrollEvent = _state2.hasReceivedScrollEvent,
          plxStyle = _state2.plxStyle,
          plxStateClasses = _state2.plxStateClasses;


      var propsToOmit = ['animateWhenNotInViewport', 'children', 'className', 'interval', 'parallaxData', 'style'];

      return _react2.default.createElement(
        'div',
        _extends({}, this.omit(this.props, propsToOmit), {
          className: 'Plx ' + plxStateClasses + ' ' + className,
          style: _extends({}, style, plxStyle, {
            // TODO think more about how to solve this
            visibility: hasReceivedScrollEvent ? null : 'hidden'
          }),
          ref: function ref(el) {
            return _this4.element = el;
          }
        }),
        children
      );
    }
  }]);

  return Plx;
}(_react.Component);

exports.default = Plx;


var propertiesItemType = _propTypes2.default.shape({
  startValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  endValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  property: _propTypes2.default.string.isRequired,
  unit: _propTypes2.default.string
});

var parallaxDataType = _propTypes2.default.shape({
  start: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  duration: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  offset: _propTypes2.default.number,
  properties: _propTypes2.default.arrayOf(propertiesItemType).isRequired,
  easing: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.func]),
  name: _propTypes2.default.string
});

Plx.propTypes = {
  animateWhenNotInViewport: _propTypes2.default.bool, // eslint-disable-line react/no-unused-prop-types
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  className: _propTypes2.default.string,
  interval: _propTypes2.default.number,
  parallaxData: _propTypes2.default.arrayOf(parallaxDataType).isRequired, // eslint-disable-line react/no-unused-prop-types
  style: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.object]))
};

Plx.defaultProps = {
  animateWhenNotInViewport: false,
  className: '',
  interval: 16
};