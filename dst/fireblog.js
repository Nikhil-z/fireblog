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
    controller: 'WriteController',
    templateUrl: '/lib/partials/write.html'
  }).
  when('/login', {
    controller: 'LoginController',
    templateUrl: '/lib/partials/login.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});


;angular.module('fireblog', [
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
  when('/post/:slug', {
    controller: 'PostController',
    templateUrl: config.theme.name + '/post.html'
  }).
  otherwise({
    redirectTo: '/'
  });
});


;angular.module('fireblog.controllers', []).

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
controller('PostController', function($scope, $routeParams, Blog, Theme, Cache) {
  Theme.loadStyles();
  var posts = Blog.posts;
  var slug = $routeParams.slug;
  var id = Blog.slugMap[slug];
  console.log(Blog.slugMap);
  console.log(slug, '->', id);  
  
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
    showPost(Cache.loadPost(id));  
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
 * Writing and publishing a blog post
 */
controller('WriteController', function($scope, Blog, Cache) {

  var converter = new Showdown.converter();  

  $scope.markdown = '';
  $scope.title = '';
  $scope.tags = [];
  $scope.version = 0;
  $scope.output = '';
 
  // load cached posts 
  $scope.posts = Cache.loadPosts();
  // when live posts load, overwrite
  Blog.posts.$on('loaded', function(posts) {
    $scope.posts = posts;
  });  
 
  // load the locally cached version 
  var cached = Cache.loadDraft();
  if(cached !== null) {
    // apply if version is newer than current
    if($scope.version < cached.version) {
      $scope.markdown = cached.content;
      $scope.title = cached.title;
      $scope.tags = cached.tags;
      $scope.version = cached.version;
    }
  }
  
  // load the server version
  var draft = Blog.loadDraft();
  draft.$on('loaded', function(draft) {
    if(draft !== null) {
      // apply if version is newer than current
      if($scope.version < draft.version) {
        $scope.markdown = draft.content;
        $scope.title = draft.title;
        $scope.tags = draft.tags;
        $scope.version = draft.version;
      }
    }
  });
  
  $scope.update = function() {
    $scope.version++;
    var draft = buildDraft();
    // cache locally
    Cache.saveDraft(draft);
    // draft to server
    Blog.saveDraft(draft);
  };

  $scope.publish = function() {
    var post = buildPost();
    Blog.createPost(post);
    // TODO if the post was successful
    
    // TODO then clear our drafts
    $scope.markdown = '';
    console.log(Cache);
    Cache.deleteDraft();
    Blog.deleteDraft();
  };
  
  // date generator
  var date = function() {
    with(new Date()) {
      return {
        day: getDate(),
        month: 1 + getMonth(),
        year: 1900 + getYear(),
        hour: getHours(),
        minute: getMinutes(),
        second: getSeconds()
      }
    }
  };

  var buildDraft = function() {
    return {
      title: $scope.title,
      content: $scope.markdown,
      tags: [],
      version: $scope.version
    };
  };

  var buildPost = function() {
    return {
      title: $scope.title,
      content: converter.makeHtml($scope.markdown),
      date: date(),
      tags: [],
      slug: slug($scope.title)
    };
  };
  
  var slug = function(title) {
    var clean = title.match(/[a-zA-Z0-9 ]*/g);
    var url = encodeURIComponent(clean.join(''));
    url = url.replace(/\%20/g, '-');
    url = url.toLowerCase();
    var slug = url;
    
    // don't overwrite existing slugs
    var i = 0;
    while(typeof Blog.slugMap[slug] !== 'undefined') {
      slug = url + '' + i++;
      console.log(slug);
    }

    return slug;
  };
  
});
;angular.module('fireblog.directives', []).

directive('fireblogTemplate', function() {
  return {
    restrict: 'E',
    templateUrl: config.theme.name + '/template.html',
    link: function(scope, element, attrs) {
      console.log('scope', scope);
    }
  }
}).

directive('afterTyping', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function  (scope, element, attrs) {
      var timeout;
      // TODO convert this to use $parse
      element.bind('keyup', function() {
        $timeout.cancel(timeout);
        var delay = attrs.typingDuration || 1000;

        timeout = $timeout(function() {  
          scope.$eval(attrs.afterTyping);
        }, delay);

      });
    }
  };
});

  
;angular.module('fireblog.services', []).

/**
 * A wrapper service for useful angularfire
 * bits and bobs
 */
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

/**
 * Provides a series of modification
 * methods for blog posts and drafts.
 */
factory('Blog', function(Firebase) {
  var ref = Firebase.ref;
  var posts = ref.$child('posts');
  var draft = ref.$child('draft');
  var slugMap = ref.$child('slugs');
    
  var getPost = function(id) {
    return posts[id];
  };
  var createPost = function(post) {
    // TODO feel bad.
    // hack and a half (eww)
    post._content = post.content;
    // when the template is rendered
    // create an element to bind the html to
    post.content = '<span ng-bind-html="post._content"></span>';
    
    var newPost = posts.$add(post);
    slugMap[post.slug] = newPost.path.m[1];
    slugMap.$save();
  }; 
  var deletePost = function(id) {
    posts.$remove(id);
  };

  var saveDraft = function(post) {
    draft.$set(post);
  };
  var loadDraft = function() {
    return draft;
  };
  var deleteDraft = function() {
    draft.$remove();
  };

  return {
    posts: posts,
    slugMap: slugMap,
    getPost: getPost,
    createPost: createPost,
    deletePost: deletePost,
    saveDraft: saveDraft,
    loadDraft: loadDraft,
    deleteDraft: deleteDraft
  }
}).

/**
 * Stores objects in localstorage
 */
factory('Cache', function() {
  var keys = {
    posts: 'fireblog-cache',
    draft: 'fireblog-draft'
  };
  
  var posts = {};
  
  var savePosts = function(posts) {
    localStorage[keys.posts] = JSON.stringify(posts);
  };
  var loadPosts = function() {
    var cached = localStorage[keys.posts];
    try {
      posts = JSON.parse(cached);
      return posts;
    } catch(e) {
      return {};
    }
  };
  var loadPost = function(id) {
    loadPosts();
    return posts[id];
  };


  var saveDraft = function(draft) {
    console.log('save draft locally');
    localStorage[keys.draft] = JSON.stringify(draft);
  };
  var loadDraft = function() {
    var cached = localStorage[keys.draft];
    try {
      return JSON.parse(cached);
    } catch(e) {
      return null;
    }
  };
  var deleteDraft = function() {
    delete localStorage[keys.draft];
  };

  return {
    savePosts: savePosts,
    loadPosts: loadPosts,
    loadPost: loadPost,
    saveDraft: saveDraft,
    loadDraft: loadDraft,
    deleteDraft: deleteDraft
  }  
}).

/**
 * Responsible for loading stylesheets
 * as required by the current theme.
 */
factory('Theme', function() {
  var styles = config.theme.styles;
  var theme = config.theme.name;

  var loadStyles = function() {
    var loaded = document.styleSheets;
    
    // for every loaded stylesheet
    for(var i = 0; i < loaded.length; i++) {
      var sheet = loaded[i];
  
      // for every theme stylesheet
      for(var j = 0; j < styles.length; j++) {
        var url = config.theme.name + '/' + styles[j]
        var present = equal(url, sheet);
        if(present) {
          styles.splice(j, 1);
          insertCSS(url);
        }
      }
    }  
  };

  var equal = function(url, sheet) { 
    // ensure that this is not a browser stylesheet
    if(sheet.href !== null) {
      if(sheet.href.indexOf(url) === -1) {
        return true;
      }
    }
    return false;
  };

  
  /**
   * Insert a stylesheet with href='<url>'
   * into the current document
   */
  var insertCSS = function(url) {
    console.log('inserting', url);
    if (document.createStyleSheet) {
      document.createStyleSheet(url); //IE
    } else {
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  };

  return {
    loadStyles: loadStyles
  };
});
