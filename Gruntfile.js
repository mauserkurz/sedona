module.exports = function(grunt) {

	// описание конфигурации
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true,
					$: true,
					console: true
				}
			},
			uses_defaults: {
				src : ['source/js/**/*.js']
			}
		},

		uglify : {
			options : {
				stripBanners : true,
				banner : '/*<%= pkg.name %> -v <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>*/\n'
			},
			build : {
				src : 'js/main.js',
				dest : 'js/main.min.js'
			}
		},

		cssmin : {
			with_banner : {
				files : {
					'css/style.min.css' : 'css/style.css'
				}
			}
		},

		watch : {
			scripts : {
				files : ['src/js/**/*.js'],
				tasks : ['jshint', 'uglify', 'removelogging']
			},
			css : {
				files : ['src/css/**/*.css'],
				tasks : ['cssmin']
			}
		},

		removelogging : {
			dist : {
				src : 'dest/build.min.js',
				dest : 'dest/build.clean.js'
			}
		}
	});

	// загрузка плагина
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-remove-logging');

	// регистрация задачи, через её имя из конфигурации
	/*grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'removelogging']);
	grunt.registerTask('watchOn', ['watch']);*/
	grunt.registerTask('cssmin', ['cssmin']);
};