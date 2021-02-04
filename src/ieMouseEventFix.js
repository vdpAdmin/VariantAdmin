/* eslint-disable */
/* 解决：NavMenu组件折叠之后，鼠标滑过menu，在IE环境下报错[Error in v-on handler: "TypeError: 对象不支持此操作"] */
(function(window) {
  try {
    new MouseEvent('test');
    return false; // No need to polyfill
  } catch (e) {
    // Need to polyfill - fall through
  }
  // Polyfills DOM4 MouseEvent
  var MouseEvent = function(eventType, params) {
    params = params || { bubbles: false, cancelable: false };
    var mouseEvent = document.createEvent('MouseEvent');
    mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    return mouseEvent;
  };

  MouseEvent.prototype = Event.prototype;

  window.MouseEvent = MouseEvent;
}(window));
