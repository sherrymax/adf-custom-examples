# Alfresco Content services Library

Contains a variety of components, directives and services used throughout ADF

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Documentation](#documentation)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Storybook](#storybook)
- [License](#license)

<!-- tocstop -->

<!-- markdown-toc end -->

## Documentation

See the [ADF Content Services](../../docs/README.md#content-services) section of the [docs index](../../docs/README.md)
for all available documentation on this library.

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

> If you plan using this component with projects generated by Angular CLI, please refer to the following article: [Using ADF with Angular CLI](https://github.com/Alfresco/alfresco-ng2-components/wiki/Angular-CLI)

## Install

```sh
npm install @alfresco/adf-content-services
```

## Storybook

In case you would like to aggregate all the stories from content services library use

```
nx run content-services:storybook
```
And navigate to `http://localhost:4400/`.

To create a Storybook content services library build use

```
nx run content-services:build-storybook
```

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)