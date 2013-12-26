angular.module('fireblog.controllers', []).

/**
 * Loads posts and exposes them
 */
controller('PostsController', function($scope, Blog, Theme, Cache) {
  document.title = config.name;
  Theme.loadStyles();
  $scope.posts = Cache.loadPosts();
  $scope.posts = Blog.posts;

  /*$scope.posts.$on('loaded', function(posts) {
    Cache.savePosts(posts);
    $scope.posts = Blog.posts;
  });*/
   
  // make all details from config available
  // to template engine
  for(var key in config) {
    // we don't want to overwrite anything
    if(typeof $scope[key] === 'undefined') {
      $scope[key] = config[key];
    }
  }
  
}).

/**
 * Loads a single post based on the ID then
 * exposes it for the template
 */
controller('PostController', function($scope, $routeParams, Blog, Theme) {
  Theme.loadStyles();
  var posts = Blog.posts;
  var id = $routeParams.id;
  
  var showPost = function(post) {
    document.title = post.title;
    for(var key in post) {
      if(typeof $scope[key] === 'undefined' || key.indexOf('$') === -1) {
        $scope[key] = post[key];
      }
    } 
  };  
  
  // if the post is not present, wait for loaded 
  if(typeof posts[id] === 'undefined') {
    // grab cached version
    
    // then wait for real one
    posts.$on('loaded', function(posts) {
      var post = posts[id]
      showPost(post);  
    });
  } else {
    // otherwise display it straight away
    showPost(posts[id]); 
  } 
    
  // set temporary name and expose config 
  document.title = config.name;
  for(var key in config) {
    if(typeof $scope[key] === 'undefined') {
      $scope[key] = config[key];
    }
  }
  
  // when the post loads change name and expose post
  //post.$on('loaded', function(post) {
   
  //});
  
  
 
}).

controller('LoginController', function($scope) {
  $scope.username = '';
  $scope.password = '';
  $scope.busy = false;

  $scope.login = function(provider) {
    // login to blog based on provider
    if(provider) {
      // login based on provider
    } else {
      // login from form input
    }
  };
  
}).

controller('AdminController', function($scope) {
  $scope.markdown = '';
  $scope.update = function() {
    // cache locally
    console.log('type');
    // draft to server
  };
});
