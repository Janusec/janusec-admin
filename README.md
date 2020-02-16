# Janusec Application Gateway Web Administration

This project is the Unified Web Administration Portal for [Janusec Application Gateway](https://www.janusec.com/) , [Github](https://github.com/Janusec/janusec) , generated with Angular 9.  

> This project is optional, and Janusec Application Gateway has already included distribution files of this project.  

## Development server

Angular 9+ is required.  

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Edit `proxy.config.json` with janusec-admin url and run:  
>  `npm start`  

instead of `ng serve`, to solve cross-domain warnings.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.  
> ng build --prod  

If `crypto` not found, try to change this file:
> node_modules@angular-devkit\build-angular\src\angular-cli-files\models\webpack-configs\browser.js  
and set node to new value:

> node: { crypto: true, stream: true, fs: 'empty', net: 'empty' }  

## Release

The produced files are under `./dist/`, copy all files  to `./static/` under Janusec Application Gateway. 

## Backend  

Backend source code is available at [Janusec Application Gateway Github](https://github.com/Janusec/janusec).  

## LICENSE

Janusec Application Gateway source files are made available under the terms of the GNU Affero General Public License ([GNU AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html)).  
