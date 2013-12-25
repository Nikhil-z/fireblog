angular.module('fireblog.services', []).

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
}).

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
