module.exports = function(grunt) {
	// описание конфигурации
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// шаблонизатор Jade
		jade: {
			html: {
				files: {
					'./': ['source/jade/*.jade']
				},
				options: {
					client: false,
					pretty: true,
					compileDebug: true
				}
			}
		},

		// расческа для html
		prettify: {
			options: {
				// удалит лишние отступы и строки если true
				condense: false,
				// количество символов отступа для тега
				indent: 1,
				// символ отступа перед тегом (таб)
				indent_char: "	",
				// не форматировуемые теги
				unformatted:  ["pre", "code", "meta", "link"]
			},
			  all: {
				expand: true,
				cwd: './',
				ext: '.html',
				src: ['./*.html'],
				dest: './'
			}
		},

		// препроцессор Less
		less: {
			development: {
				options: {
					// путь откуда берутся @import файлы
					paths: ['source/less/']
				},
				files: {
					'css/style.css': 'source/less/style.less'
				}
			}
		},

		// автопрефиксы для кроссбраузерности
		autoprefixer: {
			options: {
				// поддержка браузеров
				browsers: ["last 2 version", "ie 10"]
			},
			style: {
				// css файлы для модификации
				src: "css/style.css"
			}
		},

		// исправит css по заданному стайлгайду
		csscomb: {
			options: {
				// файл с настройками для стайлгайда
				config: 'source/.csscomb.json'
			},
			files: {
				src: ['css/style.css'],
				dest: 'css/style.css'
			}
		},

		// минификатор css
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'css/',
					src: ['*.css', '!*.min.css'],
					dest: 'css/',
					ext: '.min.css'
				}]
			}
		},

		// для сборки всех правил под одним media query
		cmq: {
			options: {
				// Log processed media queries.
				log: false
			},
			target: {
				files: {
					'css/style.css': ['css/style.css']
				}
			}
		},

		// плагин для автовыполнения тасков при изменении файлов
		watch: {
			// сборка шаблонизатором и изменение по заданному стайлгайду для html
			html: {
				files: ['source/jade/**/*.jade', 'source/jade/includes/*.html'],
				tasks: ['jade', 'prettify']
			},
			// сборка css из less, расстановка префиксов, изменение по заданному стайлгайду и минификация
			css: {
				files: ['source/less/**/*.less'],
				tasks: ['less', 'autoprefixer', 'cmq', 'csscomb', 'cssmin']
			},
			// сборка javascript файла
			js: {
				files: ['source/js/script.js'],
				tasks: ['jshint', 'uglify']
			}
		},

		// плагин для проверки синтаксиса javascript файлов
		jshint: {
			options: {
				// выполнит таск несмотря на ошибки в синтаксисе
				force: true,
				// проверка на побитовые операторы ^ и | и тд, и опечатки вроде & вместо &&
				bitwise: true,
				// проверка на отсутствие фигурных скобок в циклах и условиях
				curly: true,
				// проверка на != ==, и замену их на === !==, тк они не приводят типы данных перед сравнением
				eqeqeq: true,
				// проверка на наличие фильтра в for in, тк во вложенном коде могут быть наследованные обьекты
				forin: true,
				// проверка не определенных глобальных переменных в коде, за исключением находящихся в данном списке
				globals: {
					// предоставление списка глобальных переменных для библиотеки jQuery
					jQuery: true
				},
				// проверка использования переменных только после их пределения
				latedef: true,
				// использование кода в строгом режиме ECMAScript 5
				strict: true,
				// проверка на наличие обьявленных и не использованных переменных
				unused: true,
				// исключение проверки на сравнение вида ==null
				eqnull: true,
				// исключение проверки на наличие функций внутри цикла
				loopfunc: true,
				// доступ к переменным браузеров
				browser: true,
			},
			files: {
				src: ['source/js/script.js']
			}
		},

		// плагин для минификации js
		uglify: {
			files: {
				src: ['source/js/script.js'],
				dest: 'js/script.min.js'
			}
		}
	});

	// загрузка плагинов
	grunt.loadNpmTasks('grunt-jade');
	grunt.loadNpmTasks('grunt-prettify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// регистрация задачи, через её имя из конфигурации
	grunt.registerTask('js', ['jshint', 'uglify']);
	grunt.registerTask('css', ['less', 'autoprefixer', 'cmq', 'csscomb', 'cssmin']);
	grunt.registerTask('html', ['jade', 'prettify']);
	// по умолчанию при вызове grunt 
	grunt.registerTask('default', ['watch']);
};