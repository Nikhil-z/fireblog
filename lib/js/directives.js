angular.module('fireblog.directives', []).

directive('fireblogTemplate', function() {
  return {
    restrict: 'E',
    templateUrl: config.theme.name + '/index.html',
    link: function(scope, element, attrs) {
      console.log('scope', scope);
    }
  }
}).

directive('afterTyping', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function  (scope, element, attrs) {
      var timeout;
      // TODO convert this to use $parse
      element.bind('keyup', function() {
        $timeout.cancel(timeout);
        var delay = attrs.typingDuration || 1000;

        timeout = $timeout(function() {  
          scope.$eval(attrs.afterTyping);
        }, delay);

      });
    }
  };
});

  
