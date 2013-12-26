angular.module('fireblog', [
  'firebase',
  'ngRoute',
  'ngSanitize',
  'fireblog.services', 
  'fireblog.controllers',
  'fireblog.directives'
]).

config(function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'PostsController',
    template: '<fireblog-template></fireblog-template>' 
  }).
  when('/post/:slug', {
    controller: 'PostController',
    templateUrl: config.theme.name + '/post.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});


