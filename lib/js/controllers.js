angular.module('fireblog.controllers', []).

/**
 * Loads posts and exposes them
 */
controller('PostsController', function($scope, Blog, Theme) {
  document.title = config.name;
  Theme.loadStyles();
  $scope.posts = Blog.posts;
  
  // make all details from config available
  // to template engine
  for(var key in config) {
    // we don't want to overwrite anything
    if(typeof $scope[key] === 'undefined') {
      $scope[key] = config[key];
    }
  }
  
}).

controller('PostController', function($scope, $routeParams, Blog, Theme) {
  Theme.loadStyles();
  var post = Blog.getPost($routeParams.id);
    
  post.$on('loaded', function(post) {
    document.title = post.title;
    for(var key in post) {
      if(typeof $scope[key] === 'undefined' || key.indexOf('$') === -1) {
        $scope[key] = post[key];
      }
    } 
  });
 
}).

controller('AdminController', function($scope) {
  
});
