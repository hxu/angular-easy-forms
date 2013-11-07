Angular EasyForms
==================

[AngularJS](http://angularjs.org/) directives for basic client-side form handling

[![Build Status](https://travis-ci.org/hxu/angular-easy-forms.png?branch=master)](https://travis-ci.org/hxu/angular-easy-forms)

Overview
========

For simple forms, EasyForms allows you to get up and running without writing any Javascript at all.  Once you're
ready to make your form more complex, it's also easy to override and use only the pieces that you need

EasyForms provides the following features out of the box:

  - Response and error handling
  - Bootstrap 3 templates for common forms and controls
  - POST/PUT of form data to an API specified in the EasyForm tag

See an example in action here.

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

If you don't need to customize the form behavior, EasyForms works out of the box, as in this example:

    <form name="MyForm" ef-form ef-resource="submit">
        <div ef-messages</div>
        <input ef-input name="MyInput" type="text" ef-label="My Input Label">
        <div ef-submit></div> <div ef-reset></div>
    </form>

See it in action here: link.

Core directives
---------------

*ef-form* - Main directive applied to a `form` tag.  This creates an isolate scope with a form model and strings up
the form's methods and response handlers

*ef-resource* - Expression.  Required directive applied to `form` tag that indicates where the form should submit to.
The form will first check if the expression is a Restangular object.  If it is, and it is a Restangular Collection,
then the form will POST to the Restangular resource.  If it is a Restangular Element,  then the form will be
pre-populated with the Restangular object's attributes, and will PUT to the resource endpoint.  The form will try to
parse the expression on the parent scope of the `efForm` directive.

If the expression parses to a string in your parent scope, then the form will create a new Restangular Collection
whose route is the string (i.e. it will set the form resource to `Restangular.all('parsed_expression')`).  Otherwise,
 if the expression parses to undefined, it will treat the expression as a string and use that as the route of a new
 Restangular Collection.

*ef-input* - Directive applied to `input` tags that sets up the `ng-model` binding to the form model.  Also
replaces the input with a template that includes a label, specified by `ef-label`,
and space for field-specific validation errors returned by the server

*ef-messages* - Replaced with a template for alerts and other messages non-field-specific validation errors.

*ef-submit* - Template button that calls the submit method on the scope.

*ef-reset* - Template button that calls the reset method on the scope.

Customizing behavior
--------------------

In addition to the core directives, there are several directives that you can use to customize the behavior of the
form.

*ef-success-message* - String.  This is the message that is shown by the `ef-message` directive when a successful
POST occurs.

*ef-error-message* - String.  This message is shown by the `ef-message` directive when a POST returns with an error.

Signals
-------

EasyForms also emits several signals at specific points in the form life cycle, so that you can react to changes in
the form.

*efFormReset* - emitted when the `reset` method is called, resetting the form and its model to the pristine state

*efFormSubmit* - emitted when the `submit` method is called.  The form does not wait for the response before emitting
 this signal

*efFormSubmitSuccess* - emitted when the response returns successfully.

*efFormSubmitError* - emitted when the response returns with an error.

EasyForm also listens to several signals so that you can programatically change the state of the form.

*efTriggerFormReset* - triggers a form reset.

Advanced Usage
--------------

If you want to use only a part of EasyForm's functionality or want to override anything,
you can do so by directly accessing the easyForm service.  The easyForm service has the following functions

*`easyForm.extendScope(scope)`* - attaches EasyForms methods for handling the form to the scope.  After calling
`extendScope`, the scope will have all of the methods below.

*`$initialize(resource, attrs)`* - does the actual set up of the form scope by creating objects for the form
 model, the errors hash, and the messages array.  It also sets up listeners and other miscellany

*`hasErrors()`*

*`hasMessages()`*

*`$clearErrors()`*
*`$clearMessages()`*
*`canSubmit()`*
*`canReset()`*
*`reset()`*
*`submit()'*
*`responseHandler(promise)`*
*`errorHandler(response)`*
*`successHandler()`*

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
