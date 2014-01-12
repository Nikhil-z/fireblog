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
  
  // update our model 
  $scope.update = function(posts) {
    if(posts) {
      $scope.posts = posts;  
    } 
  };

  $scope.newPost = function(post) {
    $scope.posts.push(post);
  };

  // make all details from config available
  // to template engine
  $scope.blog = config;

  $scope.edited = function(posts) {
    if(!posts) return;
    $scope.posts = [];
    var keys = Blog.posts.$getIndex();
    for(var i = 0; i < keys.length; i++) {
      $scope.posts.push(posts[keys[i]]);
    }
    $scope.posts.reverse();
    Cache.savePosts($scope.posts);
  };
 
  // when the data loads, replace cached
  // version with live data
  Blog.posts.$on('loaded', $scope.edited); 
  Blog.posts.$on('change', $scope.edited);
   
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
  
  // TODO make sure slugMap is loaded
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
controller('LoginController', function($scope, Login) {
  $scope.username = '';
  $scope.password = '';
  $scope.busy = false;

  var error = function() {
    console.log('Login Failed');
    window.location.hash = '/login';
  };
  
  var success = function() {
    console.log('Login Success');
    localStorage['hasAuth'] = true;
  };

  $scope.login = function(provider) {
    if(provider) {
      // login to blog based on provider
      Login(provider, success, error);
    } else {
      // login from form input
      Login($scope.username, $scope.password, success, error);
    }
  };
  
}).

/**
 * Writing and publishing a blog post
 */
controller('WriteController', function($scope, $timeout, Blog, Cache, 
  CommonWords) {

  var converter = new Showdown.converter();  

  $scope.markdown = '';
  $scope.title = 'Post Title...';
  $scope.tags = [];
  $scope.version = 0;
  $scope.output = '';
 
  // when in edit mode we
  // don't want to publish new posts
  $scope.editMode = false; 
  $scope.search = '';
  $scope.saving = false;
  $scope.suggestedTags = [];
  
  // load cached posts 
  $scope.posts = Cache.loadPosts();
  // when live posts load, overwrite
  Blog.posts.$on('loaded', function(posts) {
    // sorts out date ordering
    if(posts) {
      $scope.posts = [];
      var keys = Blog.posts.$getIndex();
      for(var i = 0; i < keys.length; i++) {
        posts[keys[i]].id = keys[i];
        $scope.posts.push(posts[keys[i]]);
      }
      $scope.posts.reverse();
    }
  });  
  
  // load the locally cached version 
  var cached = Cache.loadDraft();
  if(cached !== null) {
    // apply if version is newer than current
    if($scope.version < cached.version) {
      console.log('Loading cached draft');
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
        console.log('Loading server draft');
        $scope.markdown = draft.content;
        $scope.title = draft.title;
        $scope.tags = draft.tags;
        $scope.version = draft.version;
      }
    }
  });
  
  $scope.edited = function() {
    $scope.version++;
    var draft = buildDraft();
    $scope.saving = true;
    // cache locally
    Cache.saveDraft(draft);
    // draft to server
    Blog.saveDraft(draft);
    
    // find out the 5 most common words
    // and suggest them as tags
    $scope.suggestedTags = CommonWords($scope.markdown, 5);
    
    // pretend it's taking a while to save
    $timeout(function() {
      $scope.saving = false;
    }, 2000);
  };
  
  $scope.clear = function() {
    console.log('clear');
    $scope.markdown = '';
    $scope.title = '';
    $scope.tags = [];
    $scope.suggestedTags = [];
    
    Cache.deleteDraft();
    Blog.deleteDraft();
  };
 
  $scope.publish = function() {
    console.log('publish');
    var post = buildPost();
    Blog.createPost(post);
    // TODO if the post was successful
    
    $scope.clear();
  };

  $scope.delete = function() {
    console.log('delete');
    $scope.editMode = false;
    // delete the current post
    Blog.deletePost($scope.id);
    $scope.clear();
  };

  $scope.update = function() {
    console.log('update');
    // update the current post
    var post = buildPost();
    Blog.updatePost($scope.id, post);
  };
 
  $scope.edit = function(id) {
    $scope.editMode = true;
    var post = Blog.getPost(id);
    $scope.title = post.title;
    $scope.tags = post.tags;
    $scope.markdown = post.markdown;
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
        second: getSeconds(),
        created: valueOf()
      }
    }
  };

  var buildDraft = function() {
    return {
      title: $scope.title,
      content: $scope.markdown,
      tags: $scope.suggestedTags,
      version: $scope.version
    };
  };

  var buildPost = function() {
    return {
      title: $scope.title,
      content: converter.makeHtml($scope.markdown),
      date: date(),
      markdown: $scope.markdown,
      tags: $scope.suggestedTags,
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
