/*!
 * light7
 */

/* jshint node: true */
module.exports = function(grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var dist = 'dist/';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            distPath: dist+'<%= pkg.version %>/',
            doclessetsPath: 'docs/assets/',
            docsDistPath: 'docs/dist/',
            docsPath: 'docs/',
            jsPath: 'js/',
            srcPath: 'less/'
        },

        banner: '/*!\n' +
            ' * =====================================================\n' +
            ' * HSEA Mobile - 思迪信息版权所有\n' +
            ' *\n' +
            ' * =====================================================\n' +
            ' */\n',

        clean: {
            dist: ['<%= meta.distPath %>', '<%= meta.docsDistPath %>']
        },

        concat: {
            light7: {
              options: {
                banner: '/*\n作者：   <%= pkg.author %> \n 时间： <%= grunt.template.today("yyyy-mm-dd HH:MM:ss TT") %> \n 版本： <%= pkg.version %>*/\n',
                footer: '\n/*出品单位：<%= pkg.company %>*/',
              },
              src: [
              　　　　　　　　　　'js/extends/sea.js',
                  'js/modal.js',
                  'js/extends/routernew.js',
                  'js/extends/hseaUtil.js',//扩展的其他api
                  'js/intro.js',
                  'js/device.js',
                  'js/util.js',
                  'js/detect.js',
                  'js/zepto-adapter.js',
                  'js/fastclick.js',
                  'js/template7.js',
                  'js/page.js',
                  'js/tabs.js',
                  'js/bar-tab.js',
                  'js/calendar.js',
                  'js/picker.js',
                  'js/datetime-picker.js',
                  'js/pull-to-refresh-js-scroll.js',
                  'js/pull-to-refresh.js',
                  'js/infinite-scroll.js',
                  'js/notification.js',
                  'js/index.js',
                  'js/searchbar.js',
                  'js/panels.js',
                  //'js/router.js',
                   'js/extends/service.js',
                  'js/plugins/scripts/cacheUtils.js',
                  'js/plugins/scripts/service.js',
                  'js/plugins/cache/scripts/cacheUtils.js',
                  'js/plugins/caches/cripts/cacheUtils4App.js',
                  'js/plugins/cache/scripts/cacheUtils4H5.js',
                  'js/extends/ajax.js',                   
                  'js/extends/extnative.js',  
                  'js/extends/external.js',   
                  'js/extends/msgFunction.js',                   
                  'js/extends/startup.js',                  
				  'js/extends/cookieUtils.js',				  
                  'js/init.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>.js'
            },
            swiper: {
              options: {
                  banner: '<%= banner %>'
              },
              src: [
                  'js/swiper.js',
                  'js/swiper-init.js',
                  'js/photo-browser.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>-swiper.js'
            },
            cityPicker: {
              options: {
                  banner: '<%= banner %>'
              },
              src: [
                  'js/city-data.js',
                  'js/city-picker.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>-city-picker.js'
            },
            swipeout: {
              options: {
                  banner: '<%= banner %>'
              },
              src: [
                  'js/swipeout.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>-swipeout.js'
            },
            i18n: {
              options: {
                  banner: '<%= banner %>'
              },
              src: [
                  'js/i18n/cn.js'
              ],
              dest: '<%= meta.distPath %>js/i18n/cn.js'
            }
        },


        less: {
            core: {
                src: 'less/light7.less',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>.css'
            },
            swiper: {
                src: 'less/light7-swiper.less',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-swiper.css'
            },
            browser: {
                src: 'less/photo-browser.less',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-photoBrowser.css'
            },
            swipeout: {
                src: 'less/swipeout.less',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-swipeout.css'
            },
            docs: {
                src: 'less/docs.less',
                dest: '<%= meta.doclessetsPath %>css/docs.css'
            },
            demos: {
                src: 'less/demos.less',
                dest: '<%= meta.doclessetsPath %>css/demos.css'
            }
        },

        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        '<%= meta.distPath %>css/*.css',
                        '<%= meta.doclessetsPath %>css/docs.css'
                    ]
                }
            }
        },

        csscomb: {
            options: {
                config: 'less/.csscomb.json'
            },
            core: {
                files: {
                    '<%= less.core.dest %>': '<%= less.core.dest %>'
                }
            },
            docs: {
                files: {
                    '<%= less.docs.dest %>': '<%= less.docs.dest %>'
                }
            }
        },

        copy: {
            img: {
                expand: true,
                src: 'img/*',
                dest: '<%= meta.distPath %>'
            },
            docs: {
                expand: true,
                cwd: '<%= meta.distPath %>',
                src: [
                    '**/*'
                ],
                dest: '<%= meta.docsDistPath %>'
            },
             //备份当前发布的源码
        	source:{
        		expand: true,
                cwd: '<%= meta.jsPath %>',
                src: [
                    '**/*'
                ],
                dest: '<%= meta.historyVersion %>'
        	},
        },

        autoprefixer: {
            options: {
                browsers: [
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 9',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            core: {
                src: '<%= less.core.dest %>'
            },
            swiper: {
                src: '<%= less.swiper.dest %>'
            },
            swipeout: {
                src: '<%= less.swipeout.dest %>'
            },
            docs: {
                src: '<%= less.docs.dest %>'
            },
            demos: {
                src: '<%= less.demos.dest %>'
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: '*', // keep all important comments
                advanced: false,
                keepBreaks: true,
                banner: '/*\n作者：   <%= pkg.author %> \n 时间： <%= grunt.template.today("yyyy-mm-dd HH:MM:ss TT") %> \n*/\n',
                footer: '\n/*出品单位：<%= pkg.company %>*/',               
            },
            light7: {
                src: '<%= meta.distPath %>css/<%= pkg.name %>.css',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>.min.css'
            },
            swiper: {
                src: '<%= meta.distPath %>css/<%= pkg.name %>-swiper.css',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-swiper.min.css'
            },
            photoBrowser: {
                src: '<%= meta.distPath %>css/<%= pkg.name %>-photoBrowser.css',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-swiper.min.css'
            },            
            docs: {
                src: [
                    '<%= meta.doclessetsPath %>css/docs.css',
                    '<%= meta.doclessetsPath %>css/pygments-manni.css'
                ],
                dest: '<%= meta.doclessetsPath %>css/docs.min.css'
            },
            smplugins: {
            	"files": [{
	            	expand: true,
	                cwd: '<%= meta.jsPath %>plugins',
	                src: "**/*.css",
	                dest: '<%= meta.distPath %>js/plugins',
	                ext: ".css"
                }]
            },
        },

        uglify: {
            options: {
                banner: '/*\n作者：   <%= pkg.author %> \n 时间： <%= grunt.template.today("yyyy-mm-dd HH:MM:ss TT") %> \n*/\n',
                footer: '\n/*出品单位：<%= pkg.company %>*/',
                compress: {
                    warnings: false
                },
                mangle: true,
                preserveComments: false
            },
            light7: {
                src: '<%= concat.light7.dest %>',
                dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
            },
            swiper: {
                src: '<%= concat.swiper.dest %>',
                dest: '<%= meta.distPath %>js/<%= pkg.name %>-swiper.min.js'
            },
            cityPicker: {
                src: '<%= concat.cityPicker.dest %>',
                dest: '<%= meta.distPath %>js/<%= pkg.name %>-city-picker.min.js'
            },
            i18n: {
                src: '<%= concat.i18n.dest %>',
                dest: '<%= meta.distPath %>js/i18n/cn.min.js'
            },
            docs: {
                src: [
                    '<%= meta.doclessetsPath %>js/docs.js',
                    '<%= meta.doclessetsPath %>js/fingerblast.js'
                ],
                dest: '<%= meta.doclessetsPath %>js/docs.min.js'
            },
            smplugins: {//需要排除sm默认的extend和 cityPicker插件
            	files: [
                {
                	expand: true,
	                src: ['<%= meta.jsPath %>/plugins/**/*.js','!<%= meta.jsPath %>/plugins/cityPicker/**/*.js'],
	                dest: '<%= meta.distPath %>/'
                }]
            },     
        },
	   imagemin: {
		  dist: {
		    options: {
		      optimizationLevel: 5
		    },
	    	"files": [{
	        	expand: true,
	            cwd: '<%= meta.jsPath %>plugins',
	            src: "**/*.{png,jpg,jpeg}",
	            dest: '<%= meta.distPath %>js/plugins',
	        }]
		  }
		},
        qunit: {
            options: {
                inject: 'js/tests/unit/phantom.js'
            },
            files: 'js/tests/index.html'
        },

        watch: {
            options: {
                hostname: 'localhost',
                livereload: true,
                port: 8000
            },
            js: {
                files: '<%= meta.jsPath %>*.js',
                tasks: ['dist-js', 'copy']
            },
            i18n: {
                files: ['<%= meta.jsPath %>i18n/*.js'],
                tasks: ['concat:i18n']
            },
            css: {
                files: '<%= meta.srcPath %>**/*.less',
                tasks: ['dist-css', 'copy']
            },
            html: {
                files: '<%= meta.docsPath %>**',
                tasks: ['jekyll']
            }
        },

        jekyll: {
            docs: {}
        },

        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            grunt: {
                src: ['Gruntfile.js', 'grunt/*.js']
            },
            src: {
                src: 'js/*.js'
            },
            docs: {
                src: ['<%= meta.doclessetsPath %>/js/docs.js', '<%= meta.doclessetsPath %>/js/fingerblast.js']
            }
        },


        connect: {
            site: {
                options: {
                    base: '_site/',
                    hostname: '0.0.0.0',
                    livereload: true,
                    open: true,
                    port: 8000
                }
            }
        }
    });

    // Load the plugins
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
   grunt.loadNpmTasks('grunt-contrib-imagemin');
  // Default task(s).
  grunt.registerTask('dist-css', ['less', 'autoprefixer', 'usebanner', 'csscomb', 'cssmin']);
  grunt.registerTask('dist-js', ['concat', 'uglify']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'imagemin','copy']);
  grunt.registerTask('validate-html', ['jekyll']);
  grunt.registerTask('build', ['dist']);
 // grunt.registerTask('test', ['dist', 'jshint', 'qunit', 'validate-html']);
 // grunt.registerTask('server', ['dist', 'jekyll', 'connect', 'watch']);
  //grunt.registerTask('default', ['test', 'dist']);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
};
