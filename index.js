#!/usr/bin/env node
const fs = require('fs');
const Mustache = require('mustache');

let component = `import templateUrl from './{{snakeCase}}.tmpl.html';
const name = '{{camelCase}}';

export default {
  templateUrl,
  name,
  bindings: {},
  controller: Ctrl,
};

function Ctrl() {}

`;

let index = `import {{camelCase}} from './{{snakeCase}}.js'
export default {{camelCase}}

`;

let template = `<div class="{{snakeCase}}"></div>`;

let style = `.{{snakeCase}} {
  
}`;

const program = require('commander');

program
  .arguments('<name>')
  .action(name => {
    return main(name);
  })
  .parse(process.argv);

async function main(name) {
  const { camelCase, snakeCase } = parseName(name);

  await makeDirIfNotExist(snakeCase);

  const templates = {
    index,
    component,
    template,
    style,
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
  await writeFile(
    `${componentName}/${componentName}.css`,
    renderedTemplates.style
  );
}

function renderTemplates(templates, { camelCase, snakeCase }) {
  const index = render(templates.index);
  const component = render(templates.component);
  const template = render(templates.template);
  const style = render(templates.style);
  return { index, component, template, style };

  function render(template) {
    return Mustache.render(template, { camelCase, snakeCase });
  }
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
  const camelCase = name.replace(/-([A-Za-z])/g, (s, c) => c.toUpperCase());
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
