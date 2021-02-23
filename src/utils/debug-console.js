console.log = (function(logFunc) {
  return function () {
    if (process.env.NODE_ENV === 'development') {
      //alert('oooo')
      logFunc.call(console, ...arguments);
    }
  }
})(console.log)
