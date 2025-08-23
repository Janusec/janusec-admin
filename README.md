# Janusec Application Gateway Web Administration

This project is the Web Administration Portal for [Janusec Application Gateway](https://github.com/Janusec/janusec) .  

> This project is optional, and Janusec Application Gateway has already included distribution files of this project.  

## Development server

Development environment: Angular 20, Node.js v22 .  

Edit `proxy.conf.json` with janusec-admin url and run:  

>  `npm start`  (instead of `ng serve`, to solve cross-domain warnings.)  

Navigate to `http://localhost:4200/janusec-admin/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/janusec-admin/browser/` directory. 

## Release

Copy all files under `dist/janusec-admin/browser/` to `./static/janusec-admin/` under Janusec Application Gateway. 

## Backend  

Backend source code is available at [Janusec Application Gateway Github](https://github.com/Janusec/janusec).  

## LICENSE

Janusec Application Gateway source files are made available under the terms of the GNU Affero General Public License ([GNU AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html)).  
