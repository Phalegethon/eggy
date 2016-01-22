'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var path = require('path');
var yosay = require('yosay');
var util = require('util');
var angularUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require("underscore.string");

var egg = module.exports = function projectEgg(args, options) {
    yeoman.Base.apply(this, arguments);
    this.argument('appname', {type: String, required: false});
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = _.humanize(_.slugify(_.camelize(this.appname)));


    this.option('app-suffix', {
        desc: 'Allow a custom suffix to be added to the module name',
        type: String
    });
    this.env.options['app-suffix'] = this.options['app-suffix'];
    this.scriptAppName = this.appname + angularUtils.appName(this);

    if (typeof this.env.options.appPath === 'undefined') {
        this.option('appPath', {
            desc: 'Allow to choose where to write the files'
        });

        this.env.options.appPath = this.options.appPath;

        if (!this.env.options.appPath) {
            try {
                this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
            } catch (e) {
            }
        }
        this.env.options.appPath = this.env.options.appPath || 'app';
        this.options.appPath = this.env.options.appPath;
    }

    this.appDir = this.env.options.appPath;

    this.on('end', function () {
        var message = chalk.yellow('Cracked ') + this.eggName + chalk.yellow.bold(' project EGG');
        console.log(yosay(message, {maxLength: 17}));

    });

    this.pkg = require('../package.json');
    this.rootSourceDir = this.sourceRoot(path.join(__dirname, '/templates/root'));
    this.appSourceDir = this.sourceRoot(path.join(__dirname, '/templates/app'));
};

util.inherits(egg, yeoman.Base);

egg.prototype.welcome = function welcome() {
    console.log(yosay());
};



function askForEverything (){
    var promts = [
        {
            name: 'eggName',
            message: 'What is your project name?',
            default: 'egg'
        },
        {
            name: 'eggVersion',
            message: 'What is your project version?',
            default: '0.0.1'
        },
        {
            name: 'eggDesc',
            message: 'What is your project description?',
            default: 'this awesome project made by project EGG'
        },
        {
            name: 'eggRepo',
        message: 'Add your project git repository'
        },
        {
            name: 'eggAuthor',
        message: 'App Authors name'
        },
        {
            name: 'eggLicense',
        message: 'App license?',
        default: 'MIT'
        },
        {
            type: 'checkbox',
            name: 'modules',
            message: 'Which modules would you like to include?',
            choices: [
            {
              value: 'animateModule',
              name: 'angular-animate.js',
              checked: true
            }, {
              value: 'ariaModule',
              name: 'angular-aria.js',
              checked: false
            }, {
              value: 'cookiesModule',
              name: 'angular-cookies.js',
              checked: true
            }, {
              value: 'resourceModule',
              name: 'angular-resource.js',
              checked: true
            }, {
              value: 'messagesModule',
              name: 'angular-messages.js',
              checked: false
            }, {
              value: 'routeModule',
              name: 'angular-route.js',
              checked: true
            }, {
              value: 'sanitizeModule',
              name: 'angular-sanitize.js',
              checked: true
            }, {
              value: 'touchModule',
              name: 'angular-touch.js',
              checked: true
            }
    ]
  }
    ];

    return promts;
};


egg.prototype._setAllAnswers = function _setAllAnswers(answers, callback){
    this.eggName = answers.eggName;
    this.eggDesc = answers.eggDesc;
    this.eggVersion = answers.eggVersion;
    this.eggLicense = answers.eggLicense;
    this.eggAuthor = answers.eggAuthor;
    this.eggRepo = answers.eggRepo;
    callback();
};

egg.prototype.app = function app(){
    var done = this.async();
    this.prompt(askForEverything(), function(answers){
        this._setAllAnswers(answers, done);
    }
        .bind(this))
        .on('end', function(){
            this._installFiles();
        }
    );
};

egg.prototype._installFiles = function _installFiles() {
    mkdirp(this.appDir);
    var modulesDir = this.appDir + '/modules';
    var assetsDir = this.appDir + '/assets';
    mkdirp(modulesDir);
    mkdirp(assetsDir);
    this.template(this.rootSourceDir + '/_package.json', this.appDir + '/package.json');
    this.template(this.rootSourceDir + '/_.bowerrc', this.appDir + '/.bowerrc');
    this.template(this.rootSourceDir + '/_bower.json', this.appDir + '/bower.json');
    this.template(this.rootSourceDir + '/_.yo-rc.json', this.appDir + '/.yo-rc.json');
    this.template(this.rootSourceDir + '/_.gitignore', this.appDir + '/.gitignore');
    this.template(this.rootSourceDir + '/_.editorconfig', this.appDir + '/.editorconfig');
};

