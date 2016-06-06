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
});
