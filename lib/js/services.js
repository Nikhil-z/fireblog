angular.module('fireblog.services', []).

/**
 * A wrapper service for useful angularfire
 * bits and bobs
 */
factory('Firebase', function($firebase, $firebaseAuth) {
  var url, _ref, ref, auth;
  url = config.firebase;
  _ref = new Firebase(url);
  ref = $firebase(_ref);
  auth = $firebaseAuth(_ref, {
    simple: true
  });
  
  return {
    ref: ref,
    _ref: _ref,
    auth: auth
  };
}).

factory('Login', function(Firebase) {
  return function(providerOrEmail, password, success, error) {
    var login;
    if(providerOrEmail && password) {
      login = Firebase.auth.$login('password', {
        email: providerOrEmail,
        password: password
      });
    } else {
      login = Firebase.auth.$login(providerOrEmail);
    }
    console.log(login);
    login.then(success, error);
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
}).

factory('CommonWords', function() {
  
  var excludeWords = ["the","be","to","of","and",
    "a","in","that","have","i","it","for","not","on",
    "do","at","this","but","his","by","from","they",
    "we","say","her","she","or","an","will","my","one",
    "all","would","there","their","what","so","up", "is",
    "out","if","about","who","get","which","go","me",
    "when","make","can","like","no","just","him","know",
    "take","into","your","some","could","them","see",
    "other","than","then","now","look","only","come",
    "its","over","think","also","back","after","use",
    "two","how","our","work","first","well","way",
    "even","new","want","because","any","these", "are",
    "give","day","most","us","with","he","as","you"
  ];
  
  var stripSymbols = function(text) {
    // replace common line endings just incase
    text = text.replace(/[\!\?\;\,\.\(\)]/g, ' ');
    // return a string of alpha numerics
    var matches = text.match(/[a-zA-Z0-9\s\n]+/g);
    return (matches||[]).join('');
  };

  var toWords = function(text) {
    return text.split(/\s+/g);
  };

  var frequencies = function(words) {
    var freq = {};
    for(var i = 0; i < words.length; i++) {
      if(typeof freq[words[i]] === 'undefined') {
        freq[words[i]] = 1; 
      } else {
        freq[words[i]] += 1;
      }
    }
    return freq;
  };

  var exclude = function(words, exclusion) {
    var clean = [];
    for(var i = 0; i < words.length; i++) {
      if(exclusion.indexOf(words[i]) === -1) {
        clean.push(words[i]);
      }
    }
    return clean;
  };

  var pick = function(hash, count) {
    var counter = [];
    for(var word in hash) {
      var freq = hash[word];
      if(freq > 1) {
        // create huge gaps for other words
        freq *= 100;
        while(typeof counter[freq] !== 'undefined') {
          freq++;
        }
        counter[freq] = word;
      }
    }
    var sorted = counter.filter(function(word) {
      return !!word;
    });
    //console.log(sorted.reverse().slice(0, count - 1));
    return sorted.reverse().slice(0, count);
  };

  return function(text, count) {
    text = stripSymbols(text).toLowerCase();
    var words = toWords(text);
    words = exclude(words, excludeWords);
    var freq = frequencies(words, count);
    return pick(freq, count);
  };
});
