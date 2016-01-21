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

egg.prototype.askForAppName = function askForAppName() {
    var cb = this.async();
    this.prompt([{
        name: 'eggName',
        message: 'What is your project name?',
        default: 'egg'
    }], function (props) {
        this.eggName = props.eggName;
        cb();
    }.bind(this));
};

egg.prototype.askForAppVersion = function askForAppVersion() {
    var cb = this.async();
    this.prompt([{
        name: 'eggVersion',
        message: 'What is your project version?',
        default: '1.0.0'
    }], function (props) {
        this.eggVersion = props.eggVersion;
        cb();
    }.bind(this));
};

egg.prototype.askForAppDesc = function askForAppDesc() {
    var cb = this.async();
    this.prompt([{
        name: 'eggDesc',
        message: 'What is your project description?',
        default: 'this awesome project made by project EGG'
    }], function (props) {
        this.eggDesc = props.eggDesc;
        cb();
    }.bind(this));
};

egg.prototype.askForAppRepo = function askForAppRepo() {
    var cb = this.async();
    this.prompt([{
        name: 'eggRepo',
        message: 'Add your project git repository'
    }], function (props) {
        this.eggRepo = props.eggRepo;
        cb();
    }.bind(this));
};

egg.prototype.askForAppAuthor = function askForAppAuthor() {
    var cb = this.async();
    this.prompt([{
        name: 'eggAuthor',
        message: 'App Authors name'
    }], function (props) {
        this.eggAuthor = props.eggAuthor;
        cb();
    }.bind(this));
};

egg.prototype.askForAppLicense = function askForAppLicense() {
    var cb = this.async();
    this.prompt([{
        name: 'eggLicense',
        message: 'App license?',
        default: 'MIT'
    }], function (props) {
        this.eggLicense = props.eggLicense;
        cb();
    }.bind(this));
};

egg.prototype.app = function app(){
    mkdirp(this.appDir);
    var modulesDir = this.appDir + '/modules';
    var assetsDir = this.appDir + '/assets';
    mkdirp(modulesDir);
    mkdirp(assetsDir);
};

egg.prototype.installFiles = function installFiles() {

    this.template(this.rootSourceDir + '/_package.json', this.appDir + '/package.json');
    this.template(this.rootSourceDir + '/_.bowerrc', this.appDir + '/.bowerrc');
    this.template(this.rootSourceDir + '/_bower.json', this.appDir + '/bower.json');
    this.template(this.rootSourceDir + '/_.yo-rc.json', this.appDir + '/.yo-rc.json');
    this.template(this.rootSourceDir + '/_.gitignore', this.appDir + '/.gitignore');
    this.template(this.rootSourceDir + '/_.editorconfig', this.appDir + '/.editorconfig');
};

