angular.module('fireblog.services', []).

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
    var newPost = posts.$add(post);
    console.log(newPost.path.m[1]);
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
