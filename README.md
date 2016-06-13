Library for creating and parsing NDEF messages
# Installing
Bower
```
    bower install ndef
```
NPM
```
    npm install @taptrack/ndef
```

# Creating Records
## Text records
```javascript
    var ndef = require('@taptrack/ndef');
    // language code is optional, defaults to 'en'
    var textRecord = ndef.Utils.createTextRecord("sirop","fr"); 
    var message = new ndef.Message([textRecord]);

    // Uint8Array for storing, writing to a tag, etc.
    var bytes = message.toByteArray(); 
```
## Uri records
```javascript
    // NDEF uri prefixes will be automatically applied
    var textRecord = ndef.Utils.createUriRecord("http://www.google.com"); 
    var message = new ndef.Message([textRecord]);

    // Uint8Array for storing, writing to a tag, etc.
    var bytes = message.toByteArray(); 
```
## Custom records
```javascript
    // creating message to be carried inside smartposter record
    var uri = ndef.Utils.createUriRecord("http://www.google.com");
    var payloadMsg = new ndef.Message([uri]);

    var chunked = false; // non-chunked record
    var tnf = new Uint8Array([0x01]); // TNF well known
    var type = new Uint8Array([0x53,0x70]);
    var payload = payloadMessage.toByteArray();

    var spRecord = new ndef.Record(chunked,tnf,type,id,payload);
    var spMessage = new ndef.Message([record]);

    // Uint8Array for storing, writing to a tag, etc.
    var bytes = spMessage.toByteArray();
```

# Parsing messages
## Text records
```javascript
    var message = ndef.Message.fromBytes(byteArray);
    var records = message.getRecords();

    var recordContents = ndef.Utils.resolveTextRecord(parsedRecords[0]);
    console.log("Language: "+recordContents.language);
    console.log("Content: "+recordContents.content);
```

## URI records
```javascript
    var message = ndef.Message.fromBytes(byteArray);
    var records = message.getRecords();

    var uri = ndef.Utils.resolveUriRecordToString(parsedRecords[0]);
    console.log("URI: "+uri);
```

## Other records
```javascript
    // takes a Uint8Array containing a valid, complete message
    var message = ndef.Message.fromBytes(byteArray);

    // array of all the records
    var records = message.getRecords();
    
    for(var i = 0; i < records.length; i++) {
        var record = records[i];
        console.log("Chunked: "+(record.isChunked?"Yes":"No");
        console.log("TNF: "+record.getTnf().toString());
        console.log("Type: "+record.getTnf().toString());
        console.log("ID: "+record.getId().toString());
        console.log("Payload: "+record.getTnf().toString());
    }
```

