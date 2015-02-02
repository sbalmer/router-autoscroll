var scrollPositions = {};
var backToPosition;

// Keep track of the last position for every page in case we return to it
// via the back button or history.
var saveScrollPosition = function () {
  scrollPositions[window.location] = $(window).scrollTop();
};

window.onpopstate = function(event) {
  // We used the back button, find the position we were at on that page
  // last time
  backToPosition = scrollPositions[window.location];
};

// Scroll to the right place after changing routes. "The right place" is:
// 1. The previous position if we're returning via the back button
// 2. The element whose id is specified in the URL hash
// 3. The top of page otherwise
var scrollToTop = function () {
  var self = this;

  if (self.ready()) {
    // defer until after the DOM update so that the position can be correct
    Tracker.afterFlush(function () {
      var hash = window.location.hash;
      var position;
      var animationTime = 200;

      if (backToPosition) {
        position = backToPosition;
        backToPosition = null;
        console.log("back button used, scrolling to " + position);
      } else if ($(hash).length) {
        position = $(hash).offset().top;
      }
      else {
        position = 0;
      }

      $('body').animate({
        scrollTop: position
      }, animationTime);
    });
  }
};

if (Package['iron:router']) {
  Package['iron:router'].Router.onStop(saveScrollPosition);
  Package['iron:router'].Router.onAfterAction(scrollToTop);
} else {
  if (console.warn) {
    console.warn("The okgrow:iron-router-autoscroll package requires iron:router, please add it.");
  }
}