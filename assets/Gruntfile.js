module.exports = function (grunt) {

  grunt.initConfig({
    less: {
      // 编译
      compile: {
        files: {
          'style/base.css': 'less/base.less'
        }
      },
      // 压缩
      yuicompress: {
		options: {
          yuicompress: true
        },
        files: {
			'style/base.min.css': 'style/base.css'
        }        
      }
    },
	// 压缩 CSS 文件
	cssmin: {
		options: {
			report: 'gzip'
		},
		combine: {
			files: {
			  'style/base.min.css': 'style/base.css',
			  'script/lib/artDialog/5.0.3/skin/default.min.css': 'script/lib/artDialog/5.0.3/skin/default.css'
			}
		}
	},
	uglify: {
		options: {
			report: 'gzip'
		},
		build: {
			src: 'script/lib/artDialog/5.0.3/jquery.artDialog.js',
			dest: 'script/lib/artDialog/5.0.3/jquery.artDialog.min.js'
		}
	},
    watch: {
      scripts: {
        files: ['less/*.less'],
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