import * as seed from "./seed.json";

import JsonToTS from "json-to-ts";

JsonToTS(seed).forEach((typeInterface) => {
  console.log(typeInterface);
});
