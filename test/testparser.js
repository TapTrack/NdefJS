var Ndef = require('../src/ndef.js');

describe("Parser/composer self-test",function() {
    it("Should create and parse a basic text record",function() {
        var data = "TEST DATA";
        var record = Ndef.Utils.createTextRecord(data,"en");
        var message = new Ndef.Message([record]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        expect(parsedRecords.length).toEqual(1);
        expect(Ndef.Utils.resolveTextRecord(parsedRecords[0]).content).toEqual(data);
    });
    
    it("Should create and parse a text record containing numbers",function() {
        var data = "TEST2";
        var record = Ndef.Utils.createTextRecord(data,"en");
        var message = new Ndef.Message([record]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        expect(parsedRecords.length).toEqual(1);
        expect(Ndef.Utils.resolveTextRecord(parsedRecords[0]).content).toEqual(data);
    });

    it("Should create and parse a unicode text record",function() {
        var data = "寿司";
        var record = Ndef.Utils.createTextRecord(data,"en");
        var message = new Ndef.Message([record]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        expect(parsedRecords.length).toEqual(1);
        expect(Ndef.Utils.resolveTextRecord(parsedRecords[0]).content).toEqual(data);
    });
    
    it("Should create and parse a basic url",function() {
        var data = "https://www.test.com";
        var record = Ndef.Utils.createUriRecord(data);
        var message = new Ndef.Message([record]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        expect(parsedRecords.length).toEqual(1);
        expect(Ndef.Utils.resolveUriRecordToString(parsedRecords[0])).toEqual(data);
    });

    it("Should create and parse a ndef record longer than 255 bytes",function() {
        var data = "";
        for(var i = 0; i < 400; i++) {
            data += "a";
        }
 
        var record = Ndef.Utils.createTextRecord(data);
        var message = new Ndef.Message([record]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        expect(parsedRecords.length).toEqual(1);
        expect(Ndef.Utils.resolveTextRecord(parsedRecords[0]).content).toEqual(data);
    });

    it("Should create and parse a multi-record ndef message", function() {
        var textdata1 = "TEXT1";
        var record1 = Ndef.Utils.createTextRecord(textdata1,"en");
        var uridata = "http://www.google.com";
        var record2 = Ndef.Utils.createUriRecord(uridata);
        var textdata2 = "TEXT2";
        var record3 = Ndef.Utils.createTextRecord(textdata2,"en");

        var message = new Ndef.Message([record1,record2,record3]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        expect(parsedRecords.length).toEqual(3);
        expect(Ndef.Utils.resolveTextRecord(parsedRecords[0]).content).toEqual(textdata1);
        expect(Ndef.Utils.resolveUriRecordToString(parsedRecords[1])).toEqual(uridata);
        expect(Ndef.Utils.resolveTextRecord(parsedRecords[2]).content).toEqual(textdata2);

    });

    it("Should create and parse an NDEF message with an external record with arbitrary contents", function() {
        uint8ArrayToHexString = function(data) {
            var hexString = ""; 
            for(var x = 0; x < data.length; x++) {
                var hexValue = data[x].toString(16).toUpperCase();
                if(data[x] <= 15) {
                    // gives zero padding to hex values less than 16
                    hexString = hexString.concat("0" + hexValue);
                }   
                else {
                    hexString = hexString.concat(hexValue);
                }   
            }   
            return hexString;
        };

        var tnf = Ndef.Record.TNF_EXTERNAL;
        var type = Uint8Array.from([0x22,0x22,0x22]);
        var id = Uint8Array.from([0x32,0x05,0x10,0x24]);
        var payload = Uint8Array.from([0xBB,0xA0,0x45]);
        var chunked = false;

        var record = new Ndef.Record(chunked, tnf, type, id, payload);
        var message = new Ndef.Message([record]);
        var rawBytes = message.toByteArray();
        var parsedMessage = Ndef.Message.fromBytes(rawBytes);
        var parsedRecords = parsedMessage.getRecords();
        
        expect(parsedRecords.length).toEqual(1);
        
        expect(parsedRecords[0].getTnf()).toEqual(tnf);
        expect(parsedRecords[0].getType()).toEqual(type);
        expect(parsedRecords[0].getId()).toEqual(id);
        expect(parsedRecords[0].getPayload()).toEqual(payload);
        expect(parsedRecords[0].isChunked()).toEqual(chunked);
    });
});
