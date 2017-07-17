# Create-ng-component

## use
run `yarn create ng-component <component-name>`

or
```
npm i -g create-ng-component
create-ng-component <component-name>

```

component name should be snake cased.

## Work flow
1. get component name (as snake case)
2. create component-name folder
3. inside the folder
4. create index.js
5. create component-name.js
6. create component-name.tmpl.html

## Templates
**index.js**
```
import componentName from './component-name';
export default componentName;

```

**component-name.js**
```
import templateUrl from './component-name';
const name = 'componentName"

export default {
  templateUrl,
  name,
  bindings: {},
  controller: Ctrl
}

function Ctrl() {}

```

**component-name.tmpl.html**
```
<div class="component-name"></div>
```

**component-name.css**
```
.component-name{

}
```

## Using
- **commander**: for controlling command line arguments.
- **mustache**: for compiling the templates.