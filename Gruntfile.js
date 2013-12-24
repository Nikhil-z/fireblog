module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      basic: {
        src: ['app/js/*.js'],
        dest: 'fireblog.js'
      },
      extras: {
        src: [
          'app/components/angular/angular.min.js',
          'app/components/firebase/lib/firebase.js',
          'app/angularfire/angularfire.js',
          'app/components/angular-route/angular-route.min.js',
          'app/components/firebase/lib/firebase-simple-login.js'
        ],
        dest: 'lib.js'
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
};
