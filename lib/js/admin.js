angular.module('fireblog-admin', [
  'firebase',
  'ngRoute',
  'btford.markdown',
  'fireblog.services', 
  'fireblog.controllers',
  'fireblog.directives'
]).

config(function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'AdminController',
    templateUrl: '/lib/partials/write.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});


