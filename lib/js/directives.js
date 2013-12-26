angular.module('fireblog.directives', []).

directive('fireblogTemplate', function() {
  return {
    restrict: 'E',
    templateUrl: config.theme.name + '/template.html',
    link: function(scope, element, attrs) {
      console.log('scope', scope);
    }
  }
}).

directive('done', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function  (scope, element, attrs) {
      var timeout;
      // TODO convert this to use $parse
      element.bind('keyup', function() {
        $timeout.cancel(timeout);
        timeout = $timeout(function() {
          scope.$eval(attrs.done);
        }, 1000);
      });
    }
  };
});
