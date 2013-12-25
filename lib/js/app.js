angular.module('fireblog', [
  'firebase',
  'ngRoute',
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
  when('/post/:id', {
    controller: 'PostController',
    templateUrl: config.theme.name + '/post.html'
  }).
  when('/admin', {
    controller: 'AdminController',
    templateUrl: 'lib/partials/admin.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});


