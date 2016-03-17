module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    copy: {
      main: {
        files: [
          {
            src: 'index.html',
            dest: 'dist/index.html'
          },
          {
            src: 'CNAME',
            dest: 'dist/CNAME'
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true,
            cwd: 'assets/',
            src: ['**', '!styles/**'],
            dest: 'dist/'
          }
        ],
      },
      bower_components: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/',
            src: ['**'],
            dest: 'dist/vendor/'
          }
        ],
      }
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['index.html'],
        tasks: ['copy:main']
      },
      sass: {
        files: ['main.scss'],
        tasks: ['sass', 'cssmin']
      },
      assets: {
        files: ['assets/**'],
        tasks: ['copy:assets', 'imagemin:assets']
      },
      bower_components: {
        files: ['bower_components/**'],
        tasks: ['copy:bower_components']
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/style.css': 'main.scss'
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.css', '!*.min.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },

    imagemin: {
      assets: {
        files: [{
          expand: true,
          cwd: 'dist/images',
          src: ['**/*.{png,jpg,gif,svg, ico}'],
          dest: 'dist/images'
        }]
      }
    },

    clean: {
      release: ["dist"]
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'dist',
          hostname: 'localhost',
          livereload: true,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                next();
            });

            return middlewares;
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('firebase', '', function () {
    var exec = require('child_process').execSync;
    var result = exec("firebase deploy", { encoding: 'utf8' });
    grunt.log.writeln(result);
  });

  grunt.registerTask('default', ['copy', 'sass', 'cssmin', 'imagemin']);
  grunt.registerTask('deploy', ['clean', 'default', 'firebase']);
  grunt.registerTask('run', ['clean', 'default', 'connect', 'watch']);
};
