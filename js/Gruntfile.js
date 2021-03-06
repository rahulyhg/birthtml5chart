module.exports = function(grunt){

	// Project confirugation
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator:';'
			},
			dist: {
				src: ['src/start.js','src/d3extension.js','src/util.js', 'src/core.js','src/text.js','src/label.js', 'src/axis.js', 'src/export.js', 'src/end.js'],
				dest: 'build/<%= pkg.name %>.js'
			},
			aChartsDist: {
				src: ['src/misc/start.js', 'src/misc/base.js','src/misc/donutChart.js', 'src/misc/barChart.js', 'src/misc/export.js', 'src/misc/end.js'],
				dest: 'build/aCharts.js'
			}
		},
		uglify: {
			options: {
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js':['<%= concat.dist.dest %>'],
					'dist/aChart.min.js':['<%= concat.aChartsDist.dest %>']
				}
			}
		}
	});

	// Load 'uglify' task plugin
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Load 'concat' task plugin
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	// Default task
	grunt.registerTask('default', ["concat","uglify"]);
};
