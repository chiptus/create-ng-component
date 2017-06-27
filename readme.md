get component name (as snake case)

create component-name folder
inside the folder
create index.js
create component-name.js
create component-name.tmpl.html

index.js
```
import componentName from './component-name';
export default componentName;

```

component-name.js
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

component-name.tmpl.html
```
<div class="component-name"></div>
```
