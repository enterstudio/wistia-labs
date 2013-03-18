// Generated by CoffeeScript 1.4.0

(function(W) {
  var bindEvent, pageOffset, removeElem;
  pageOffset = function(elem) {
    var curLeft, curTop;
    curLeft = curTop = 0;
    if (elem.offsetParent) {
      while (elem) {
        curLeft += elem.offsetLeft;
        curTop += elem.offsetTop;
        elem = elem.offsetParent;
      }
    }
    return {
      left: curLeft,
      top: curTop
    };
  };
  if (W.detect.browser.msie) {
    bindEvent = function(elem, event, fn) {
      return elem.attachEvent("on" + event, fn);
    };
  } else {
    bindEvent = function(elem, event, fn) {
      return elem.addEventListener(event, fn, false);
    };
  }
  removeElem = function(elem) {
    var par;
    if (elem && (par = elem.parentNode)) {
      par.removeChild(elem);
      return elem = null;
    }
  };
  return W.plugin("dimTheLights", function(video, options) {
    var addStyle, autoDimOff, autoDimOn, container, dim, dimmed, elem, elems, k, positionElems, removeStyle, styleElem, undim, uuid, _i, _len, _ref, _ref1;
    if (options == null) {
      options = {};
    }
    if ((_ref = video.options) != null ? _ref.popover : void 0) {
      return;
    }
    positionElems = function() {
      var docHeight, docWidth, offset, videoHeight, videoWidth, videoX, videoY;
      if (!dimmed) {
        return;
      }
      offset = pageOffset(container);
      videoX = offset.left;
      videoY = offset.top;
      videoWidth = video.width();
      videoHeight = video.height();
      docWidth = document.body.clientWidth;
      docHeight = document.body.clientHeight;
      elems.left.style.width = "" + videoX + "px";
      elems.left.style.height = "" + docHeight + "px";
      elems.left.style.left = "0px";
      elems.left.style.top = "0px";
      elems.right.style.width = "" + (docWidth - videoX - videoWidth) + "px";
      elems.right.style.height = "" + docHeight + "px";
      elems.right.style.left = "" + (videoX + videoWidth) + "px";
      elems.right.style.top = "0px";
      elems.top.style.width = "" + videoWidth + "px";
      elems.top.style.height = "" + videoY + "px";
      elems.top.style.left = "" + videoX + "px";
      elems.top.style.top = "0px";
      elems.bottom.style.width = "" + videoWidth + "px";
      elems.bottom.style.height = "" + (docHeight - videoY - videoHeight) + "px";
      elems.bottom.style.left = "" + videoX + "px";
      return elems.bottom.style.top = "" + (videoY + videoHeight) + "px";
    };
    dimmed = false;
    dim = function() {
      var elem, k, v, _results;
      dimmed = true;
      addStyle();
      container.className = container.className.replace(/\s*wistia-dim-target/g, "") + " wistia-dim-target";
      document.body.className = (document.body.className || "").replace(/\s*wistia-dim-the-lights/g, "") + " wistia-dim-the-lights";
      for (k in elems) {
        v = elems[k];
        document.body.appendChild(v);
      }
      positionElems();
      _results = [];
      for (k in elems) {
        elem = elems[k];
        _results.push(elem.className = elem.className.replace(/\s*wistia-invisible/g, "") + " wistia-visible");
      }
      return _results;
    };
    undim = function() {
      var elem, k, _results;
      dimmed = false;
      container.className = container.className.replace(/\s*wistia-dim-target/g, "");
      document.body.className = (document.body.className || "").replace(/\s*wistia-dim-the-lights/g, "");
      _results = [];
      for (k in elems) {
        elem = elems[k];
        _results.push((function(elem) {
          elem.className = elem.className.replace(/\s*wistia-visible/g, "") + " wistia-invisible";
          return W.timeout("" + uuid + ".undim." + k, function() {
            removeElem(elem);
            return removeStyle();
          }, 500);
        })(elem));
      }
      return _results;
    };
    styleElem = null;
    removeStyle = function() {
      return removeElem(styleElem);
    };
    addStyle = function() {
      var prop, t, transitionCss;
      removeStyle();
      prop = "opacity";
      t = .5;
      transitionCss = "-webkit-transition: " + prop + " " + t + "s ease-in-out;\n-moz-transition: " + prop + " " + t + "s ease-in-out;\n-o-transition: " + prop + " " + t + "s ease-in-out;\n-ms-transition: " + prop + " " + t + "s ease-in-out;\ntransition: " + prop + " " + t + "s ease-in-out;";
      return styleElem = W.util.addInlineCss(document.body, ".wistia-dim-backdrop {\nbackground-color:" + options.backgroundColor + ";\ncursor:pointer;\nfilter:alpha(opacity=0);\nopacity:0;\nz-index:16777271;\nposition: absolute;\n}\n.wistia-dim-backdrop.wistia-visible {\nfilter:alpha(opacity=" + (Math.round(options.backgroundOpacity * 100)) + ");\nopacity:" + options.backgroundOpacity + ";\n" + transitionCss + "\n}\n.wistia-dim-backdrop.wistia-invisible {\nfilter:alpha(opacity=0);\nopacity:0;\n" + transitionCss + "\n}\n.wistia-dim-target {\nbox-shadow:0 0 50px 5px rgba(0,0,0,.95);\n}\n.wistia-dim-the-lights textarea {\nresize:none!important;\n}");
    };
    autoDimOff = function() {
      options.autoDim = false;
      video.unbind("play", dim);
      video.unbind("pause", undim);
      return video.unbind("end", undim);
    };
    autoDimOn = function() {
      autoDimOff();
      options.autoDim = true;
      video.bind("play", dim);
      video.bind("pause", undim);
      return video.bind("end", undim);
    };
    uuid = W.seqId();
    options = W.extend({
      backgroundColor: "#000000",
      backgroundOpacity: .6,
      autoDim: true
    }, options);
    options.autoDim = W.obj.cast(options.autoDim);
    container = video.iframe ? video.iframe : video.container;
    elems = {};
    _ref1 = ['left', 'right', 'top', 'bottom'];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      k = _ref1[_i];
      elems[k] = document.createElement("div");
      elems[k].id = "" + uuid + "_" + k;
      elems[k].className = "wistia-dim-backdrop";
    }
    for (k in elems) {
      elem = elems[k];
      bindEvent(elem, "click", function() {
        if (options.autoDim) {
          video.pause();
        }
        return undim();
      });
    }
    if (options.autoDim) {
      autoDimOn();
    }
    video.bind("widthchanged", positionElems);
    video.bind("heightchanged", positionElems);
    bindEvent(window, "resize", positionElems);
    return {
      dim: dim,
      undim: undim,
      elems: elems,
      reposition: positionElems,
      autoDimOff: autoDimOff,
      autoDimOn: autoDimOn
    };
  });
})(Wistia);
