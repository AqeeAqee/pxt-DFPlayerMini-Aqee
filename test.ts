basic.showLeds(`
    . . . . .
    . . . # .
    . . . . .
    # . . . #
    . # # # .
    `);
DFPlayerMini_Aqee.begin()
basic.pause(3000)
DFPlayerMini_Aqee.volume(20)
while (true) {

    DFPlayerMini_Aqee.playNext()
    basic.pause(1000)
    for (let i = 1; i < 6; i++) {
        DFPlayerMini_Aqee.play(i)
        basic.pause(1000)
    }
}
    //sendCmdArg(0x03, 1);


    /*
    */
