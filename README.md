# Symbol-Node-Util Module

This module retrieves the active node of the blockchain Symbol

# Installation

Node.js

```
npm instll symbol-node-util
or
yarn add symbol-node-util
```

# Usage

.ts

```
import { getActiveNode } from "symbol-node-util";

(async ()=>{
  const node = await getActiveNode(152);
  console.log(node);

})()
```

```

```

.js

```
const nodeUtil =  require("symbol-node-util");

(async() => {
  const node = await nodeUtil.getActiveNode(104);
  console.log(node);
})()

```

# Feature

- getActiveNode(NetworkType: number): Promise<string>
