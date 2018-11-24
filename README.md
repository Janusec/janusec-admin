# Janusec Application Gateway Web Administration

This project is the Unified Web Administration Portal for [Janusec Application Gateway](https://www.janusec.com/) , [Github](https://github.com/Janusec/janusec) , generated with [Angular CLI](https://github.com/angular/angular-cli) and Angular 5.  

This project is optional, and Janusec Application Gateway has already included it.  

## Development server

Angular 5 is required.  

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Edit `proxy.config.json` with janusec-api url and run:  
>  `npm start`  

 to solve cross-domain warnings.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.  
> ng build --prod  

## Release

The produced files are under `./dist/`, copy all files  to `./static/` under Janusec Application Gateway. 

## Backend  

Backend source code is available at [Janusec Application Gateway Github](https://github.com/Janusec/janusec).  

## LICENSE

Janusec Application Gateway source files are made available under the terms of the GNU Affero General Public License ([GNU AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html)).  
