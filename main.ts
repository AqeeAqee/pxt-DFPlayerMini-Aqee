//%
namespace DFPlayerMini_Aqee {
    let _DEBUG = 0



    const DFPLAYER_EQ_NORMAL = 0
    const DFPLAYER_EQ_POP = 1
    const DFPLAYER_EQ_ROCK = 2
    const DFPLAYER_EQ_JAZZ = 3
    const DFPLAYER_EQ_CLASSIC = 4
    const DFPLAYER_EQ_BASS = 5

    const DFPLAYER_DEVICE_U_DISK = 1
    const DFPLAYER_DEVICE_SD = 2
    const DFPLAYER_DEVICE_AUX = 3
    const DFPLAYER_DEVICE_SLEEP = 4
    const DFPLAYER_DEVICE_FLASH = 5

    const DFPLAYER_RECEIVED_LENGTH = 10
    const DFPLAYER_SEND_LENGTH = 10

    //#define _DEBUG

    const TimeOut = 0
    const WrongStack = 1
    const DFPlayerCardInserted = 2
    const DFPlayerCardRemoved = 3
    const DFPlayerCardOnline = 4
    const DFPlayerPlayFinished = 5
    const DFPlayerError = 6
    const DFPlayerUSBInserted = 7
    const DFPlayerUSBRemoved = 8
    const DFPlayerUSBOnline = 9
    const DFPlayerCardUSBOnline = 10
    const DFPlayerFeedBack = 11

    const Busy = 1
    const Sleeping = 2
    const SerialWrongStack = 3
    const CheckSumNotMatch = 4
    const FileIndexOut = 5
    const FileMismatch = 6
    const Advertise = 7

    const Stack_Header = 0
    const Stack_Version = 1
    const Stack_Length = 2
    const Stack_Command = 3
    const Stack_ACK = 4
    const Stack_Parameter = 5
    const Stack_CheckSum = 7
    const Stack_End = 9

    let _sending = control.createBuffer(DFPLAYER_SEND_LENGTH)

    //%
    export function begin() {
        _sending = control.createBuffer(DFPLAYER_SEND_LENGTH)
        //_sending.fill(0)
        _sending[Stack_Header] = 0x7E
        _sending[Stack_Version] = 0xFF
        _sending[Stack_Length] = 0x06
        _sending[Stack_Command] = 0x0
        _sending[Stack_ACK] = 0x0 // ACK=0,1
        _sending[Stack_Parameter] = 0x0
        _sending[Stack_Parameter + 1] = 0x0
        _sending[Stack_CheckSum] = 0x0
        _sending[Stack_CheckSum + 1] = 0x0
        _sending[Stack_End] = 0xEF

    }

    function debug(value: number = 1) {
        _DEBUG = value
    }

    function calculateCheckSum(buffer: Buffer) {
        let sum = 0;
        for (let i = Stack_Version; i < Stack_CheckSum; i++) {
            sum += buffer[i];
        }
        return -sum;
    }

    function sendStack(): void {

        if (_DEBUG) {
            console.log("");
            console.log("sending:");
            for (let i = 0; i < DFPLAYER_SEND_LENGTH; i++) {
                console.logValue("" + i, _sending[i]);
                console.log("");
            }
            console.log("");
        }

        serial.redirect(SerialPin.P15, SerialPin.P16, 9600)
        //serial.redirectToUSB()
        serial.writeBuffer(_sending);
        //_timeOutTimer = millis();
        //_isSending = _sending[Stack_ACK];

        //if (!_sending[Stack_ACK]) { //if the ack mode is off wait 10 ms after one transmition.
        //    delay(10);
        //}
        basic.pause(0)

    }

    function sendCommand(command: number) {
        sendCmdArg(command, 0);
    }

    function sendCmdArg(command: number, argument: number) {
        _sending[Stack_Command] = command;
        writeInt16toSendStack(argument, Stack_Parameter);
        writeInt16toSendStack(calculateCheckSum(_sending), Stack_CheckSum);
        sendStack();
    }

    function sendCmdArgHL(command: number, argumentHigh: number, argumentLow: number) {
        let buffer = argumentHigh;
        buffer <<= 8;
        sendCmdArg(command, buffer | argumentLow);
    }

    function writeInt16toSendStack(value: number, index: number) {
        _sending.setNumber(NumberFormat.Int16BE, index, value)
    }

    //%
    export function volume(value: number) {
        sendCmdArg(0x06, value);
    }

    //%
    export function play(fileNumber: number) {
        sendCmdArg(0x03, fileNumber);
    }

    //%
    export function playNext() {
        sendCommand(0x01);
    }


}
