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


;angular.module('fireblog.controllers', []).

controller('PostsController', function($scope, Blog) {
  document.title = config.name;
  $scope.posts = Blog.posts;
  // make all details from config available
  for(var key in config) {
    // we don't want to overwrite anything
    if(typeof $scope[key] === 'undefined') {
      $scope[key] = config[key];
    }
  }
  
}).

controller('PostController', function($scope, $routeParams, Blog) {
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
;angular.module('fireblog.directives', []).

directive('fireblogTemplate', function() {
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: config.theme + '/template.html',
    link: function(scope, element, attrs) {
      console.log('scope', scope);
    }
  }
});
;angular.module('fireblog.services', []).

factory('Firebase', function($firebase) {
  var url, _ref, ref;
  url = config.firebase;
  _ref = new Firebase(url);
  ref = $firebase(_ref);

  return {
    ref: ref,
    _ref: _ref
  };
}).

factory('Blog', function(Firebase) {
  var posts = Firebase.ref.$child('posts');
    
  var getPost = function(id) {
    return posts.$child(id);
  };
    
  var createPost = function(title, content, tags) {
    posts.$add({
      title: title,
      date: date,
      content: content,
      tags: tags
    });
  }; 
  
  var removePost = function(id) {
    posts.$remove(id);
  };

  return {
    posts: posts,
    getPost: getPost,
    createPost: createPost,
    removePost: removePost
  }
});
