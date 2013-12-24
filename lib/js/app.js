angular.module('fireblog', [
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
    controller: 'PostsController',
    template: '<fireblog-template></fireblog-template>' 
  }).
  when('/post/:id', {
    controller: 'PostController',
    templateUrl: config.theme + '/post.html'
  }).
  when('/admin', {
    controller: 'AdminController',
    templateUrl: 'lib/partials/admin.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});


