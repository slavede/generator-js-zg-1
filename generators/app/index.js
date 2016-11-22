'use strict';

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
	constructor: function() {
		generators.Base.apply(this, arguments);

		this.argument('name', { type: String, required: true });

		this.bowerDependencies = [
			"jquery"
		];
	},
	prompting : {
		prompt1 : function() {
			return this.prompt({
                type    : 'input',
                name    : 'pageTitle',
                message : 'Page title (it will be displayed in tab)?',
                default : ''
			}).then(function(answers) {
                this.pageTitle = answers.pageTitle;
			}.bind(this));
		},
		prompt2 : function() {
			return this.prompt({
                type    : 'input',
                name    : 'description',
                message : 'Project description (it will be set to meta description)?',
                default : ''
			}).then(function(answers) {
                this.description = answers.description;
			}.bind(this));
		},
		prompt3 : function() {
            var that = this;
            return this.prompt({
                type    : 'input',
                name    : 'useLess',
                message : 'Do you want to use LESS?',
                default : 'y'
            }).then(function (answers) {
                if (answers.useLess.toLowerCase() === 'y' || answers.useLess.toLowerCase() !== 'n') {
                	that.useLess = true;
                	that.useSass = false;
                } else if (answers.useLess.toLowerCase() === 'n') {
                	that.useLess = false;
                	return that.prompt({
                		type : 'input',
                		name : 'useSass',
                		message : 'Do you want to use Sass?',
                		default : 'y'
                	}).then(function(answers) {
						if (answers.useSass.toLowerCase() === 'y' || answers.useSass.toLowerCase() !== 'n') {
		                	that.useSass = true;
		                } else if (answers.useSass.toLowerCase() === 'n') {
		                	that.useSass = false;
		                }
		            });
                }
            }.bind(this));

		},
		prompt4 : function() {
	    	return this.prompt({
		      	type    : 'input',
		      	name    : 'useBootstrap',
		      	message : 'Do you want to use Bootstrap? (y/n)',
		      	default : 'y'
		    }).then(function (answers) {
		    	this.useBootstrap = false;
		    	if (answers.useBootstrap.toLowerCase() === 'y') {
		    		this.useBootstrap = true;
		    		this.bowerDependencies.push('bootstrap');
		    	} else if (answers.useBootstrap.toLowerCase() !== 'n') {
		    		this.useBootstrap = true;
		    		this.log('Unknown option. Going with default answer (y)');
		    		this.bowerDependencies.push('bootstrap');
		    	}
			}.bind(this));
		}
	},
	writing : function() {
            var injectOptions = {
                name: this.name,
                pageTitle : this.pageTitle,
                description : this.description,
                useLess : this.useLess,
                useSass : this.useSass,
                useBootstrap : this.useBootstrap
            };

       		this.fs.copy(
				this.templatePath('.editorconfig'),
				this.destinationPath('.editorconfig'));

       		this.fs.copy(
				this.templatePath('gulpfile.js'),
				this.destinationPath('gulpfile.js'));

       		this.fs.copyTpl(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json'), injectOptions);

			this.fs.copy(
				this.templatePath('src/.jshintrc'),
				this.destinationPath('src/.jshintrc'));  

			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'), injectOptions);

      		this.fs.copyTpl(
				this.templatePath('src/_index.html'),
				this.destinationPath('src/index.html'), injectOptions);

			this.directory('gulp', 'gulp');
      		this.fs.copyTpl(
				this.templatePath('gulp/_build.js'),
				this.destinationPath('gulp/build.js'), injectOptions);
      		this.fs.copyTpl(
				this.templatePath('gulp/_conf.js'),
				this.destinationPath('gulp/conf.js'), injectOptions);

      		this.fs.delete(this.destinationPath('gulp/_conf.js'));
      		this.fs.delete(this.destinationPath('gulp/_build.js'));

      		if (this.useLess) {
      			this.directory('src/less', 'src/less');
      		}
      		if (this.useSass) {
      			this.directory('src/sass', 'src/sass');
      		}

      		this.directory('src/css', 'src/css');

	},
	install : function() {
	  	this.npmInstall();

        this.log('Installing bowerDependencies');
        this.log(this.bowerDependencies);

	  	this.bowerInstall(this.bowerDependencies, { 'save': true } );
	}
});
