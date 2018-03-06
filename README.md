[![Build Status](https://travis-ci.org/FundacionParaguaya/fp-psp-frontend.svg?branch=master)](https://travis-ci.org/FundacionParaguaya/fp-psp-frontend)

# Poverty Stoplight

Fundación Paraguaya (FP from now on) has developed a methodology called “Poverty Stoplight”. The Poverty Stoplight seeks to eliminate the multidimensional poverty that affects many families. It allows families to trace their own poverty map and develop and implement a clear plan to overcome it.

Through a visual survey that shows photographs, families self-assess their level of poverty with 50 indicators. These indicators are in turn grouped into 6 different dimensions of poverty.

## Poverty Stoplight Frontend

Single Page Application working as a web client for [FP-PSP-SERVER](https://github.com/FundacionParaguaya/FP-PSP-SERVER).

## Credits

This project has been built with [Joko Starter Kit](https://github.com/jokoframework/joko_spa_starter_kit) as a skeleton.

## Requirements

* [Node.js](https://nodejs.org/) v5.0.0 or above

## Getting Started

### Clone this repo

```shell
$ git clone https://github.com/FundacionParaguaya/fp-psp-frontend.git
$ cd fp-psp-frontend
```

### Development

Run:

```shell
npm install
npm run start
```

This will create the bundle from the sources in `/src` and output it to `/dist`.

Finally, open up your browser in:

> [http://localhost:9000/](http://localhost:9000/)

### Environment

If you need to, change the `API` value in `config/env_develpment.json` to point to the FP-SERVER running in your local machine. By default this should work without any modification.

Use `config/env_production.json` in production environments.

#### OAuth Configuration

When the authentication security is enabled in the server, the parameter en the `config/env_XXX.json` file should be set to `true`:

```json
  "authenticationEnabled": true
```

### Users and roles

To see a list of default users and roles check the [backend documentation](https://github.com/FundacionParaguaya/FP-PSP-SERVER/blob/develop/docs/OAUTH.md#default-roles-and-users).

### Build for production

Run:

```shell
$ npm run build
```

### Tests

Unit and integration tests are run with [Karma](http://karma-runner.github.io/0.12/index.html), [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/):

```shell
$ npm test
```

To detect potential errors and bugs we use [ESLint](https://eslint.org/):

```shell
$ npm run lint
```

### Internationalization

We use [Polyglot](http://airbnb.io/polyglot.js/) library to include internationalization.

The language selection is made within the application, but for the pages that are previously shown as the login page, the language of the browser that is used is detected. If the language is not supported by the application, a default language is used. Therefore, you must keep the supported languages ​​in the `/src/login_app/app.js` file, where the default languages ​​are also defined.


#### How can I add support to another language?

All messages supported by internationalization are stored in the `/src/static/i18n` directory, separated according to language.

Files for each locale must be of type json and be named `XX_YY.json`, where `XX` is the language code and `YY` is the country code. For example, `es_PY.json` for Paraguay.

The keys for the values that will be localized have to be the same in every file, with values appropriate to the language they correspond to. 

The content of the files must follow the following format:

```
{
  "family": {
    "messages": {
      "add-done": "The family has been saved!",
      "delete-done": "The \"%{nameOfFamily}\" family has been deleted!"
    },
    "buttons": {
      "add": "Add Family"
    }
  }
}
```

The parameters are obtained with `%{nameOfParameter}`.


#### How can I internationalize a message, word, etc.?

For the translation the helper "t" was created, which uses Polyglot together with the jsons to carry out the translation.

##### Using "t" in a javascript file

Suppose we want to internationalize the following message to show the user:

```
FlashesService.request('add', {
  timeout: 2000,
  type: 'info',
  body: 'The ${nameOfFamily} family has been deleted!'
});
```

To internationalize it we should replace it with the following:

```
FlashesService.request('add', {
  timeout: 2000,
  type: 'info',
  body: t('family.messages.delete-done', {nameOfFamily: "García"})
});
```

##### Using "t" with handlebars

Suppose we want to internationalize the label of a button, for example:

```
<button type="button">Add Family</button>
```

To internationalize it we should replace it with the following:

```
<button type="button">{{$t 'family.buttons.add'}}</button>
```