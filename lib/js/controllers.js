angular.module('fireblog.controllers', []).

/**
 * Loads all the blog's posts, displays a cached version
 * then updates to reflect the live version when the data
 * arrives.
 */
controller('PostsController', function($scope, Blog, Theme, Cache) {
  // update title of blog
  document.title = config.name;
  
  // add theme stylesheets
  Theme.loadStyles();
  
  // load posts from cache
  $scope.posts = Cache.loadPosts();
    
  // when the data loads, replace cached
  // version with live data
  Blog.posts.$on('loaded', function(posts) {
    Cache.savePosts(posts);
    $scope.posts = Blog.posts;
  });
   
  // make all details from config available
  // to template engine
  for(var key in config) {
    // ensure nothing is overwritten
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
      if(typeof $scope[key] === 'undefined') {
        $scope[key] = post[key];
      }
    } 
  };  
  
  // if the post is not present 
  if(typeof posts[id] === 'undefined') {
    // display cached version
    showPost(Cache.getPost(id));  
    // and wait for the real one
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
  
}).

/**
 * Provides log in methods for the admin
 * interface.
 */
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

/**
 * Controllers administrator functionality
 */
controller('AdminController', function($scope) {
  $scope.markdown = '';
  $scope.update = function() {
    // cache locally
    console.log('type');
    // draft to server
  };
});
