module.exports = (grunt) ->
    pkg = grunt.file.readJSON 'package.json'
    
    grunt.initConfig
        bower_concat:
            main:
                dest: 'obj/' + pkg.name + '/bower_concat.js'
                dependencies:
                    'underscore.string': 'underscore'
                mainFiles:
                    'underscore.string': ['lib/underscore.string.js']
        
        json5_to_json:
            manifest:
                options:
                    replacer: null
                    space: 2
                src: [pkg.name + '/manifest.json']
                dest: 'bin/' + pkg.name + '/manifest.json'
        
        typescript:
            main:
                src: [pkg.name + '/**/*.ts']
                options:
                    target: 'es5'
                    sourceMap: false
                    declaration: false
                    noImplicitAny: true
                    comments: true
        
        copy:
            main:
                expand: true
                cwd: pkg.name
                src: [
                    'debug.js'
                    '**/*.png'
                    '**/*.json'
                    '**/*.js'
                    '**/*.css'
                    ]
                dest: 'bin/' + pkg.name + '/'
            
            bower:
                expand: true
                cwd: 'obj/' + pkg.name
                src: 'bower_concat.js'
                dest: 'bin/' + pkg.name + '/vendor/js/'
            
            license:
                src: 'LICENSE.txt'
                dest: 'bin/' + pkg.name + '/'
        
        compress:
            main:
                options:
                    archive: 'bin/' + pkg.name + '.zip'
                files: [
                    expand: true
                    cwd: 'bin'
                    src: pkg.name + '/**/*'
                ]
        
        watch:
            main:
                files: [
                    pkg.name + '/**/*.png'
                    pkg.name + '/**/*.js'
                    pkg.name + '/**/*.css'
                    pkg.name + '/_locales/**/*.json'
                    ]
                tasks: ['copy:main']
            
            bower:
                files: ['bower.json', 'bower_components/**/*']
                tasks: ['bower_concat', 'copy:bower']
            
            manifest:
                files: [pkg.name + '/manifest.json']
                tasks: ['json5_to_json']
    
    require('load-grunt-tasks')(grunt)
    
    grunt.registerTask 'default', [
        'typescript'
        'bower_concat'
        'copy'
        'json5_to_json'
        'watch'
        ]
    
    grunt.registerTask 'build', [
        'typescript'
        'bower_concat'
        'copy'
        'json5_to_json'
        'create_empty_debug'
        'compress'
        ]
    
    grunt.registerTask 'test', [
        'build'
        ]
    
    grunt.registerTask 'create_empty_debug', ->
        grunt.file.write('bin/' + pkg.name + '/debug.js', '')
 