## Summary
This project provides a Dojo based web server running on NodeJS. It uses dojox/dtl as template engine and provide a page rendering framework.

Although Dojo is known as a powerful rich internet application framework running on browser side, it is also able to run on NodeJS as a server side framework. By doing this, server side javascript could take use of AMD, Dojo's object oriented framework and many fancy Dojo modules. And developers can use one framework for both client side and server side, which is very helpful for development and maintenance of a web site.

## Installation
Dojos depends on [NodeJS](http://www.nodejs.org) v0.6+ and [Dojo Toolkit](http://www.dojotoolkit.org) v1.7+

Dojos folder needs to be the sibling of dojo and dojox folder,  resulting in a directory structure like the following:

* `dojo` - Provides the AMD loader
* `dojox` - Provides template engine: dojox/dtl and many other none-ui modules
* `dojos`

## Configuration
You can specify multi web sites running on the server, each web site is a folder on disk and runs as an AMD package.

To config web sites, open dojos/config.js. You can see a internal applicaiton named 'Dojos Default', which list all files in dojos parent folder:
```js
module.exports = {
	sites: [{
		id: 'dojos/default'
		,location: '../'
		,name: 'Dojos Default'
		,port: 1337
	}]
};
```
 This site alsointends to manage web sites using a web UI, it's still in early stage so just for demo purpose, can't provide actual functions. Simlar with the Dojos Default web site config, you need to specify below parameters for a web site:

* `id`: the identifier of the web site, it is also used as AMD package name. If not provided, dojos will give it a random id at each server starting.
* `name`: the name of the web site, it is displayed on Dojos Admin page. If not provided, it will be displayed as 'undefined' on admin page
* `location`: the location of the web site, could be an absolute path on disk, such as 'c:/wwwroot/my_site/', or a path related to dojoroot, such as './admin', which is used for Dojos Admin.
* `port`: the web site listening port.

## Start the server
Start up the server by running bootstrap.js:

    node /path/to/dojos/bootstrap.js

## What does Dojos Provide?
* Directory list, support orderring and filter functions
* Static file support
* Server page rendering engine using dojox/dtl as the template engine

## Create a page
Each file with extension '.djs' is rendered as a server page. Dojos looks for .djs.js for the page which is an AMD module as its backend context data provider automatically, and then render the .djs file as a dtl template with data to browser side.

index.djs
```html
<html>
    <head>
        <title>Welcome to Dojos</title>
    </head>
    <body><h1>Hello {{name}}!</h1></body>
</html>
```

index.djs.js
```js
define(['dojo/_base/declare', 'dojos/PageContext'], function(declare, PageContext){
    return declare(null, {
        getContext: function(){return {name: 'Dojos'};}
    });
});
```

NOTE: you need to restart the server after editing a Dojo module to apply the change because of AMD cache mechanism.

