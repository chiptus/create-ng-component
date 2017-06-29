#!/usr/bin/env node
const fs = require('fs');
const Mustache = require('mustache');

let component = `
import templateUrl from './{{snakeCase}}.tmpl.html';
const name = '{{camelCase}}';

export default {
  templateUrl,
  name,
  bindings: {},
  controller: Ctrl,
};

function Ctrl() {}

`;

let index = `
import {{camelCase}} from './{{snakeCase}}.js'
export default {{camelCase}}

`;

let template = `<div class="{{snakeCase}}"></div>`


const program = require('commander');

program
  .arguments('<name>')
  .action(name => {
    return main(name)
  })
  .parse(process.argv)


async function main(name) {
  const { camelCase, snakeCase } = parseName(name);

  await makeDirIfNotExist(snakeCase);

  const templates = {
    index,
    component,
    template,
  };
  const rendered = renderTemplates(templates, { camelCase, snakeCase });

  saveFiles(snakeCase, rendered);
}

async function saveFiles(componentName, renderedTemplates) {
  await writeFile(`${componentName}/index.js`, renderedTemplates.index);
  await writeFile(
    `${componentName}/${componentName}.js`,
    renderedTemplates.component
  );
  await writeFile(
    `${componentName}/${componentName}.tmpl.html`,
    renderedTemplates.template
  );
}

function renderTemplates(templates, { camelCase, snakeCase }) {
  const index = Mustache.render(templates.index, { camelCase, snakeCase });
  const component = Mustache.render(templates.component, {
    camelCase,
    snakeCase,
  });
  const template = Mustache.render(templates.template, {
    camelCase,
    snakeCase,
  });
  return { index, component, template };
}

async function getFile(filename) {
  return new Promise((resolve, reject) =>
    fs.readFile(filename, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.toString());
    })
  );
}

async function writeFile(filename, fileInput) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, fileInput, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function parseName(name) {
  const snakeCase = name;
  const camelCase = name.replace(/-([A-Za-z])/, (s, c) => c.toUpperCase());
  return { snakeCase, camelCase };
}

function makeDirIfNotExist(dirname) {
  return new Promise((resolve, reject) =>
    fs.mkdir(
      dirname,
      error => (error && error.code !== 'EEXIST' ? reject(error) : resolve())
    )
  );
}


