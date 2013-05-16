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
	  /*
      yuicompress: {
        files: {
          
          
        },
        options: {
          yuicompress: true
        }
      }
	  */
    },
	// 压缩 CSS 文件
	cssmin: {
		options: {
			report: 'gzip'
		},
		combine: {
			files: {
			  'assets/style/base.min.css': 'assets/style/base.css',
			  'assets/script/lib/artDialog/5.0.3/skin/default.min.css': 'assets/script/lib/artDialog/5.0.3/skin/default.css'
			}
		}
	},
	uglify: {
		options: {
			report: 'gzip'
		},
		build: {
			src: 'assets/script/lib/artDialog/5.0.3/jquery.artDialog.js',
			dest: 'assets/script/lib/artDialog/5.0.3/jquery.artDialog.min.js'
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['less', 'cssmin', 'uglify', 'watch']);

};