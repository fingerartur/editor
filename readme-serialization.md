# Serialization
Rules can be serialized in order to be prepared to be sent to the server. (Or deserialized after being loaded.)

Here is an example of a [serialized rule](serialization-example.json). (It can be reproduced by loggin in as user 1 and exporting a rule in text format.)

The rule is valid JSON. The validity can be tested by running ```node serialization-test.js serialization-example.json```.