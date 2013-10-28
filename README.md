Angular EasyForms
==================

[AngularJS](http://angularjs.org/) directives for basic client-side form handling

[![Build Status](https://travis-ci.org/hxu/angular-easy-forms.png?branch=master)](https://travis-ci.org/hxu/angular-easy-forms)

Overview
========

For simple forms, EasyForms allows you to get up and running without writing any Javascript at all.  Once you're
ready to make your form more complex, it's also easy to override and use only the pieces that you need

EasyForms provides the following features out of the box:

  - Bootstrap 3 templates for common forms and controls
  - POST/PUT of form data to an API specified in the EasyForm tag
  - Response and error handling

See some examples here.

Dependencies
============

EasyForms uses the following libraries:

  - [AngularJS](http://angularjs.org/)
  - [Restangular](https://github.com/mgonto/restangular)
  - [Bootstrap](http://getbootstrap.com/) - templates designed for Bootstrap 3

Installation
============

EasyForms can be installed via [Bower](http://bower.io/), or simply download files in `dist` and add it to your
project.

Usage
=====

See the [full documentation]() for full details.

Contributing
============

The easiest way to contribute is to submit bugs and feature requests as issues on this repository.  Pull requests are
 also welcome if you wish to contribute directly to the code.

EasyForms uses [Grunt](http://gruntjs.com/) to manage the build process.  Once you've forked and cloned the repository,
be sure to install the Node and Bower dependencies:

    npm install
    bower install

Tests can be run once with the following command:

    grunt karma:unit

And continuous testing during development can be run with:

    grunt karma:continuous

To build, simply type:

    grunt build
