angular.module('fireblog.directives', []).

directive('fireblogTemplate', function() {
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: config.theme.name + '/template.html',
    link: function(scope, element, attrs) {
      console.log('scope', scope);
    }
  }
});
