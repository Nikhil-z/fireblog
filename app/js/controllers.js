angular.module('fireblog.controllers', []).

controller('PostsController', function($scope, Blog) {
  $scope.posts = Blog.posts;  
});
