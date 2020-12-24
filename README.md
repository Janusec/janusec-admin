# Luccitech LCD Series Web Administration

This project is the Unified Web Administration Portal for Luccitech LCD Series, generated with Angular 9.  

> This project is optional, and Luccitech LCD Series has already included distribution files of this project.  

## Development server

Angular 9+ is required.  

Edit `proxy.config.json` with luci-admin url and run:  

>  `npm start`  (instead of `ng serve`, to solve cross-domain warnings.)  

Navigate to `http://localhost:4200/luci-admin/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.  
> ng build --prod  

If `crypto` not found, try to change this file:
> node_modules@angular-devkit\build-angular\src\angular-cli-files\models\webpack-configs\browser.js  
and set node to new value:

> node: { crypto: true, stream: true, fs: 'empty', net: 'empty' }  

## Release

The produced files are under `./dist/`, copy all files  to `./static/luci-admin/` under Luccitech LCD Series. 

