module.exports = function(grunt) {
	
	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    concat: {
	    	javascript: {
		    	options: {
		    		// Wrapper for javascript context
		    		banner: '(function(publicContext, c, $$)\n{',
		    		footer: '\npublicContext.initiated = true;\n})(window[appContext], {}, angular);'
		    	},
	    		src: [
					'js/first/*.js',
					'js/polyfill/*.polyfill.js',
					'js/common/*.js',
					'js-shared/common/*.js',
					'js-shared/classes/*.class.js',
					'js/helpers/*.helper.js',
					'js/app.js',
					'js/managers/*.js',
					'js/app_run.js',
					'js/controllers/*.js',
					'js/ag/filters/*.filter.js',
					'js/modules/**/*.js'
	    		],
	    	    dest: '../../public/assets/js/app.js'
	    	},
            jsangular: {
                src: ['js-ag/*.js'],
                dest: '../../public/assets/js/app-ag.js'
            },
	    	jsworkers: {
		    	options: {
		    		// Wrapper for javascript context
		    		banner: '"use strict";\n\n'
		    	},
		    	files: {
		    		'../../public/assets/js/simulator.js': ['js/workers/simulator/*.js'],
		    		'../../public/assets/js/simulator-result.js': ['js/workers/simulator-result/*.js'],
		    		'../../public/assets/js/simulator-ipm.js': ['js/workers/simulator-ipm/*.js']
		    	}
	    	},
			jsadmin: {
				options: {
					// Wrapper for javascript context
					banner: '(function(app, $$, c){\n\n"use strict";\n',
					footer: '\n\n}).call(window, adminApp, Vue, {routes: [], constants: {}, validations: {}});'
				},
				src: [
					'js-admin/classes/*.js',
					'js-shared/classes/*.class.js',
					'js-admin/common/*.js',
					'js-shared/common/*.js',
					'js-admin/validations/*.js',
					'js-admin/managers/*.js',
					'js-admin/mixins/*.js',
					'js-admin/mixins/form/*.js',
					'js-admin/*.js',
					'js-admin/components/**/*.js'
				],
				dest: '../../public/assets/js/app-admin.js'
			},
			jsvue: {
				src: [
					'node_modules/vue/dist/vue.js',
					'node_modules/vue-router/dist/vue-router.js'
				],
				dest: '../../public/assets/js/vue.js'
			},
	    	css: {
	    		src: [
	    		      'css/*.css',
	    		      'css/common/*.css',
	    		      'css/page/*.css',
	    		      'css/html/*.css'
	    		],
	    	    dest: '../../public/assets/css/app.css'
	    	},
			cssadmin: {
				src: [
					'css/admin/*.css',
					'css/admin/components/**/*.css'
				],
				dest: '../../public/assets/css/app-admin.css'
			}
    	},
    	copy: {
    		css: {
    			expand: true,	
    			cwd: 'css/libs/',
    			src: '**',
    			dest: '../../public/assets/css/libs/'
    		},
    		javascript: {
    			expand: true,	
    			cwd: 'js-libs/',
    			src: '**',
    			dest: '../../public/assets/js/libs/'
    		},
    		images: {
    			expand: true,	
    			cwd: 'img/',
    			src: '**',
    			dest: '../../public/assets/img/'
    		},
    		fonts: {
    			expand: true,	
    			cwd: 'fonts/',
    			src: '**',
    			dest: '../../public/assets/fonts/'
    		}
    	},
    	clean: {
    		options: {
    			force: true
    		},
    		all: ['../../public/assets/**']
    	},
		uglify: {
			dist: {
				files: {
					'../../public/assets/js/app.js': '../../public/assets/js/app.js',
					'../../public/assets/js/app-admin.js': '../../public/assets/js/app-admin.js',
					'../../public/assets/js/simulator.js': '../../public/assets/js/simulator.js',
					'../../public/assets/js/simulator-result.js': '../../public/assets/js/simulator-result.js'
				}
			}
		}

	});
	
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('default', ['clean:all','javascript','css','images','fonts']);
	grunt.registerTask('production', ['clean:all','javascript','css','images','fonts','uglify:dist']);
	
	grunt.registerTask('javascript', ['concat:javascript','concat:jsangular','concat:jsworkers','concat:jsadmin','concat:jsvue','copy:javascript']);
	grunt.registerTask('css', ['concat:css','concat:cssadmin','copy:css']);
	grunt.registerTask('images', ['copy:images']);
	grunt.registerTask('fonts', ['copy:fonts']);
	
}
