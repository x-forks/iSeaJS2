module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  var jsconcats = {};
  var jsmins = [];
  var copies = [];

  var output = pkg.spm.output || {};

  if (Array.isArray(output)) {
    var ret = {};
    output.forEach(function(name) {
      ret[name] = [name];
    });
    output = ret;
  }

  Object.keys(output).forEach(function(name) {
    if (name.indexOf('*') === -1) {
      if (/\.js$/.test(name)) {
        // concat js
        jsconcats['.build/' + name] = output[name].map(function(key) {
          return '.build/src/' + key;
        });

        jsmins.push({
          src: ['.build/' + name],
          dest: name
        });

        // create debugfile
        jsconcats[name.replace(/\.js$/, '-debug.js')] = output[name].map(function(key) {
          return '.build/src/' + key.replace(/\.js$/, '-debug.js');
        });
      } else {
        copies.push({
          cwd: '.build/src',
          src: name,
          expand: true,
          dest: './'
        });
        console.log('copies:' + copies);
      }
    } else {
      copies.push({
        cwd: '.build/src',
        src: name,
        filter: function(src) {
          if (/-debug\.(js)$/.test(src)) {
            return true;
          }
          return !/\.(js)$/.test(src);
        },
        expand: true,
        dest: './'
      });
      jsmins.push({
        cwd: '.build/src',
        src: name,
        filter: function(src) {
          if (/-debug.js$/.test(src)) {
            return false;
          }
          return /\.js$/.test(src);
        },
        expand: true,
        dest: './'
      });
    }
  });

  grunt.initConfig({
    pkg: pkg,
    transport: {
        js: {
            options: {
                alias: pkg.spm.alias,
                idleading: pkg.family + '/' + pkg.name + '/' + pkg.version + '/'
            },
            files: [{
                cwd: 'src',
                src: '**/*.js',
                filter: 'isFile',
                dest: '.build/src'
            }]
        }
    },
    concat: {
      options: {
        include: 'relative',
		banner: '/** \n'+
				' *  @name: <%= pkg.name %> - v<%= pkg.version %> \n' +
				' *  @description: <%= pkg.description %> \n'+
				' *  @author: <%= pkg.author %> \n'+
				' *  @date: <%= grunt.template.today("yyyy-mm-dd") %> \n'+
				' */'
      },
      js: {files: jsconcats}
    },
    uglify: {js: {files: jsmins}},
    copy: {spm: {files: copies}},
    clean: {
      build: ['.build']
    }
  });

  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['transport', 'concat', 'uglify', 'copy', 'clean']);

};