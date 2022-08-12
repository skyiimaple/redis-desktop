
function name () {
  const Redis = require("ioredis");
  const redis = new Redis({ host: '81.71.45.213', port: 6379, password: '1821maple@' });

  console.log('redis :>> ', redis);
  // redis.set("mykey", "value"); // Returns a promise which resolves to "OK" when the command succeeds.

  // ioredis supports the node.js callback style
  redis.get("key", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result); // Prints "value"
    }
  });
}
name();