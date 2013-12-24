module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      basic: {
        src: ['lib/js/*.js'],
        dest: 'dst/fireblog.js'
      },
      blogLib: {
        src: [
          'lib/components/angular/angular.min.js',
          'lib/components/firebase/lib/firebase.js',
          'lib/components/angularfire/angularfire.min.js',
          'lib/components/angular-route/angular-route.min.js'
        ],
        dest: 'dst/blog-lib.js'
      },
      adminLib: {
        src: [
          'lib/components/angular/angular.min.js',
          'lib/components/firebase/lib/firebase.js',
          'lib/components/angularfire/angularfire.min.js',
          'lib/components/angular-route/angular-route.min.js',
          'lib/components/firebase/lib/firebase-simple-login.js',
          'lib/components/showndown/compressed/showdown.js',
          'lib/components/angular-markdown-directive/markdown.js'
        ],
        dest: 'dst/admin-lib.js'
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
};
