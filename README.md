# Jekyll Bootstrap 5 Boilerplate


## What's this?

This is a Jekyll boilerplate that includes Bootstrap 5. Use boilerplate developing a static website, eg. with GitHub Pages. Requires Ruby, Ruby Gems, Node.js, Gulp and Yarn.

## Basic usage 

#### Setup
Fork or clone repo. Install dependencies:

```sh
$ bundle install
$ yarn
```

#### Custom theme styling
Add custom Boostrap 5 variables to `src/sass/variables.scss`.
Add custom styles to `src/sass/custom.scss`. 

#### Custom scripts
Add custom JS to `src/scripts/custom.js`.

#### Serving locally
Compile static site to the `_site` folder, ready for production:

```sh
$ yarn build
```

Compile and view static site for development. Listen for changes and recompile automatically in browser:

```sh
$ yarn watch
```
