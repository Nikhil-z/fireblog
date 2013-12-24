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
});
