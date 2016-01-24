module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/js/app.min.js',
        dest: 'build/js/app.min.js'
      }
    },
    copy: {
      main: {
        files: [
          {expand: false, src: ['src/index.html'], dest: 'build/index.html', filter: 'isFile'},
          {expand: false, src: ['src/favicon.ico'], dest: 'build/favicon.ico', filter: 'isFile'}
        ]
      },
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['*.scss'],
          dest: 'build/css',
          ext: '.css'
        }]
      }
    },
    connect: {
      server: {
        options: {
          port: 3131,
          base: 'build'
        }
      }
    },
    watch: {
      css: {
        files: 'src/scss/*.scss',
        tasks: ['sass']
      },
      scripts: {
        files: ['src/*.js', 'src/js/*.js', 'src/js/**/*.js'],
        tasks: ['build'],
      },
    },
    browserify: {
      dist: {
        options: {
          "transform": [ ["babelify", { "presets": ["react", "es2015", "stage-0"] }] ]
        },
        files: {
          'build/js/app.min.js': ['src/*.js', 'src/js/*.js', 'src/js/**/*.js']
        }
      }
    },
    clean: ['build']
  });

  // Default task(s).
  grunt.registerTask('default', ['clean', 'build', 'copy', 'sass', 'connect', 'watch']);
  grunt.registerTask('build', ['browserify', 'uglify']);

};
