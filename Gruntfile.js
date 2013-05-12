module.exports = function (grunt) {

  grunt.initConfig({
    less: {
      // 编译
      compile: {
        files: {
          'assets/style/base.css': 'assets/less/base.less'
        }
      },
      // 压缩
      yuicompress: {
        files: {
          'assets/style/base.min.css': 'assets/style/base.css',
          'assets/script/lib/artDialog/5.0.3/skin/default.min.css': 'assets/script/lib/artDialog/5.0.3/skin/default.css'
        },
        options: {
          yuicompress: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['assets/less/*.less'],
        tasks: ['less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['less', 'watch']);

};