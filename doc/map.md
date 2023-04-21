## Commodore 64 memory map

+-----------------------------------+-----------------------------------+
| **Address\                        | Description                       |
| (hex, dec)**                      | []{#page00}[]{#zeropage}          |
+-----------------------------------+-----------------------------------+
| **\$0000-\$00FF, 0-255\           |                                   |
| Zero page**                       |                                   |
+-----------------------------------+-----------------------------------+
| \$0000\                           | Processor port data direction     |
| 0                                 | register. Bits:                   |
|                                   |                                   |
|                                   | -   Bit #x: 0 = Bit #x in         |
|                                   |     processor port can only be    |
|                                   |     read; 1 = Bit #x in processor |
|                                   |     port can be read and written. |
|                                   |                                   |
|                                   | Default: \$2F, %00101111.         |
+-----------------------------------+-----------------------------------+
| \$0001\                           | Processor port. Bits:             |
| 1                                 |                                   |
|                                   | -   Bits #0-#2: Configuration for |
|                                   |     memory areas \$A000-\$BFFF,   |
|                                   |     \$D000-\$DFFF and             |
|                                   |     \$E000-\$FFFF. Values:        |
|                                   |                                   |
|                                   |     -   %x00: RAM visible in all  |
|                                   |         three areas.              |
|                                   |                                   |
|                                   |     -   %x01: RAM visible at      |
|                                   |         \$A000-\$BFFF and         |
|                                   |         \$E000-\$FFFF.            |
|                                   |                                   |
|                                   |     -   %x10: RAM visible at      |
|                                   |         \$A000-\$BFFF; KERNAL ROM |
|                                   |         visible at \$E000-\$FFFF. |
|                                   |                                   |
|                                   |     -   %x11: BASIC ROM visible   |
|                                   |         at \$A000-\$BFFF; KERNAL  |
|                                   |         ROM visible at            |
|                                   |         \$E000-\$FFFF.            |
|                                   |                                   |
|                                   |     -   %0xx: Character ROM       |
|                                   |         visible at \$D000-\$DFFF. |
|                                   |         (Except for the value     |
|                                   |         %000, see above.)         |
|                                   |                                   |
|                                   |     -   %1xx: I/O area visible at |
|                                   |         \$D000-\$DFFF. (Except    |
|                                   |         for the value %100, see   |
|                                   |         above.)                   |
|                                   |                                   |
|                                   | -   Bit #3: Datasette output      |
|                                   |     signal level.                 |
|                                   |                                   |
|                                   | -   Bit #4: Datasette button      |
|                                   |     status; 0 = One or more of    |
|                                   |     PLAY, RECORD, F.FWD or REW    |
|                                   |     pressed; 1 = No button is     |
|                                   |     pressed.                      |
|                                   |                                   |
|                                   | -   Bit #5: Datasette motor       |
|                                   |     control; 0 = On; 1 = Off.     |
|                                   |                                   |
|                                   | Default: \$37, %00110111.         |
+-----------------------------------+-----------------------------------+
| \$0002\                           | Unused.                           |
| 2                                 |                                   |
+-----------------------------------+-----------------------------------+
| \$0003-\$0004\                    | Unused.\                          |
| 3-4                               | Default: \$B1AA, execution        |
|                                   | address of routine converting     |
|                                   | floating point to integer.        |
+-----------------------------------+-----------------------------------+
| \$0005-\$0006\                    | Unused.\                          |
| 5-6                               | Default: \$B391, execution        |
|                                   | address of routine converting     |
|                                   | integer to floating point.        |
+-----------------------------------+-----------------------------------+
| \$0007\                           | Byte being search for during      |
| 7                                 | various operations.\              |
|                                   | Current digit of number being     |
|                                   | input.\                           |
|                                   | Low byte of first integer operand |
|                                   | during AND and OR.\               |
|                                   | Low byte of integer-format FAC    |
|                                   | during INT().                     |
+-----------------------------------+-----------------------------------+
| \$0008\                           | Byte being search for during      |
| 8                                 | various operations.\              |
|                                   | Current byte of BASIC line during |
|                                   | tokenization.\                    |
|                                   | High byte of first integer        |
|                                   | operand during AND and OR.        |
+-----------------------------------+-----------------------------------+
| \$0009\                           | Current column number during      |
| 9                                 | SPC() and TAB().                  |
+-----------------------------------+-----------------------------------+
| \$000A\                           | LOAD/VERIFY switch. Values:       |
| 10                                |                                   |
|                                   | -   \$00: LOAD.                   |
|                                   |                                   |
|                                   | -   \$01-\$FF: VERIFY.            |
+-----------------------------------+-----------------------------------+
| \$000B\                           | Current token during              |
| 11                                | tokenization.\                    |
|                                   | Length of BASIC line during       |
|                                   | insertion of line.\               |
|                                   | AND/OR switch; \$00 = AND; \$FF = |
|                                   | OR.\                              |
|                                   | Number of dimensions during array |
|                                   | operations.                       |
+-----------------------------------+-----------------------------------+
| \$000C\                           | Switch for array operations.      |
| 12                                | Values:                           |
|                                   |                                   |
|                                   | -   \$00: Operation was not       |
|                                   |     called by DIM.                |
|                                   |                                   |
|                                   | -   \$40-\$7F: Operation was      |
|                                   |     called by DIM.                |
+-----------------------------------+-----------------------------------+
| \$000D\                           | Current expression type. Values:  |
| 13                                |                                   |
|                                   | -   \$00: Numerical.              |
|                                   |                                   |
|                                   | -   \$FF: String.                 |
+-----------------------------------+-----------------------------------+
| \$000E\                           | Current numerical expression      |
| 14                                | type. Bits:                       |
|                                   |                                   |
|                                   | -   Bit #7: 0 = Floating point; 1 |
|                                   |     = Integer.                    |
+-----------------------------------+-----------------------------------+
| \$000F\                           | Quotation mode switch during      |
| 15                                | tokenization; Bit #6: 0 = Normal  |
|                                   | mode; 1 = Quotation mode.\        |
|                                   | Quotation mode switch during      |
|                                   | LIST; \$01 = Normal mode; \$FE =  |
|                                   | Quotation mode.\                  |
|                                   | Garbage collection indicator      |
|                                   | during memory allocation for      |
|                                   | string variable; \$00-\$7F =      |
|                                   | There was no garbage collection   |
|                                   | yet; \$80 = Garbage collection    |
|                                   | already took place.               |
+-----------------------------------+-----------------------------------+
| \$0010\                           | Switch during fetch of variable   |
| 16                                | name. Values:                     |
|                                   |                                   |
|                                   | -   \$00: Integer variables are   |
|                                   |     accepted.                     |
|                                   |                                   |
|                                   | -   \$01-\$FF: Integer variables  |
|                                   |     are not accepted.             |
+-----------------------------------+-----------------------------------+
| \$0011\                           | GET/INPUT/READ switch. Values:    |
| 17                                |                                   |
|                                   | -   \$00: INPUT.                  |
|                                   |                                   |
|                                   | -   \$40: GET.                    |
|                                   |                                   |
|                                   | -   \$98: READ.                   |
+-----------------------------------+-----------------------------------+
| \$0012\                           | Sign during SIN() and TAN().      |
| 18                                | Values:                           |
|                                   |                                   |
|                                   | -   \$00: Positive.               |
|                                   |                                   |
|                                   | -   \$FF: Negative.               |
+-----------------------------------+-----------------------------------+
| \$0013\                           | Current I/O device number.\       |
| 19                                | Default: \$00, keyboard for input |
|                                   | and screen for output.            |
+-----------------------------------+-----------------------------------+
| \$0014-\$0015\                    | Line number during GOSUB, GOTO    |
| 20-21                             | and RUN.\                         |
|                                   | Second line number during LIST.\  |
|                                   | Memory address during PEEK, POKE, |
|                                   | SYS and WAIT.                     |
+-----------------------------------+-----------------------------------+
| \$0016\                           | Pointer to next expression in     |
| 22                                | string stack. Values: \$19; \$1C; |
|                                   | \$1F; \$22.\                      |
|                                   | Default: \$19.                    |
+-----------------------------------+-----------------------------------+
| \$0017-\$0018\                    | Pointer to previous expression in |
| 23-24                             | string stack.                     |
+-----------------------------------+-----------------------------------+
| \$0019-\$0021\                    | String stack, temporary area for  |
| 25-33                             | processing string expressions (9  |
|                                   | bytes, 3 entries).                |
+-----------------------------------+-----------------------------------+
| \$0022-\$0025\                    | Temporary area for various        |
| 34-37                             | operations (4 bytes).             |
+-----------------------------------+-----------------------------------+
| \$0026-\$0029\                    | Auxiliary arithmetical register   |
| 38-41                             | for division and multiplication   |
|                                   | (4 bytes).                        |
+-----------------------------------+-----------------------------------+
| \$002A\                           | Unused.                           |
| 42                                |                                   |
+-----------------------------------+-----------------------------------+
| \$002B-\$002C\                    | Pointer to beginning of BASIC     |
| 43-44                             | area.\                            |
|                                   | Default: \$0801, 2049.            |
+-----------------------------------+-----------------------------------+
| \$002D-\$002E\                    | Pointer to beginning of variable  |
| 45-46                             | area. (End of program plus 1.)    |
+-----------------------------------+-----------------------------------+
| \$002F-\$0030\                    | Pointer to beginning of array     |
| 47-48                             | variable area.                    |
+-----------------------------------+-----------------------------------+
| \$0031-\$0032\                    | Pointer to end of array variable  |
| 49-50                             | area.                             |
+-----------------------------------+-----------------------------------+
| \$0033-\$0034\                    | Pointer to beginning of string    |
| 51-52                             | variable area. (Grows downwards   |
|                                   | from end of BASIC area.)          |
+-----------------------------------+-----------------------------------+
| \$0035-\$0036\                    | Pointer to memory allocated for   |
| 53-54                             | current string variable.          |
+-----------------------------------+-----------------------------------+
| \$0037-\$0038\                    | Pointer to end of BASIC area.\    |
| 55-56                             | Default: \$A000, 40960.           |
+-----------------------------------+-----------------------------------+
| \$0039-\$003A\                    | Current BASIC line number.        |
| 57-58                             | Values:                           |
|                                   |                                   |
|                                   | -   \$0000-\$F9FF, 0-63999: Line  |
|                                   |     number.                       |
|                                   |                                   |
|                                   | -   \$FF00-\$FFFF: Direct mode,   |
|                                   |     no BASIC program is being     |
|                                   |     executed.                     |
+-----------------------------------+-----------------------------------+
| \$003B-\$003C\                    | Current BASIC line number for     |
| 59-60                             | CONT.                             |
+-----------------------------------+-----------------------------------+
| \$003D-\$003E\                    | Pointer to next BASIC instruction |
| 61-62                             | for CONT. Values:                 |
|                                   |                                   |
|                                   | -   \$0000-\$00FF: CONT\'ing is   |
|                                   |     not possible.                 |
|                                   |                                   |
|                                   | -   \$0100-\$FFFF: Pointer to     |
|                                   |     next BASIC instruction.       |
+-----------------------------------+-----------------------------------+
| \$003F-\$0040\                    | BASIC line number of current DATA |
| 63-64                             | item for READ.                    |
+-----------------------------------+-----------------------------------+
| \$0041-\$0042\                    | Pointer to next DATA item for     |
| 65-66                             | READ.                             |
+-----------------------------------+-----------------------------------+
| \$0043-\$0044\                    | Pointer to input result during    |
| 67-68                             | GET, INPUT and READ.              |
+-----------------------------------+-----------------------------------+
| \$0045-\$0046\                    | Name and type of current          |
| 69-70                             | variable. Bits:                   |
|                                   |                                   |
|                                   | -   \$0045 bits #0-#6: First      |
|                                   |     character of variable name.   |
|                                   |                                   |
|                                   | -   \$0046 bits #0-#6: Second     |
|                                   |     character of variable name;   |
|                                   |     \$00 = Variable name consists |
|                                   |     of only one character.        |
|                                   |                                   |
|                                   | -   \$0045 bit #7 and \$0046 bit  |
|                                   |     #7:                           |
|                                   |                                   |
|                                   |     -   %00: Floating-point       |
|                                   |         variable.                 |
|                                   |                                   |
|                                   |     -   %01: String variable.     |
|                                   |                                   |
|                                   |     -   %10: FN function, created |
|                                   |         with DEF FN.              |
|                                   |                                   |
|                                   |     -   %11: Integer variable.    |
+-----------------------------------+-----------------------------------+
| \$0047-\$0048\                    | Pointer to value of current       |
| 71-72                             | variable or FN function.          |
+-----------------------------------+-----------------------------------+
| \$0049-\$004A\                    | Pointer to value of current       |
| 73-74                             | variable during LET.\             |
|                                   | Value of second and third         |
|                                   | parameter during WAIT.\           |
|                                   | Logical number and device number  |
|                                   | during OPEN.\                     |
|                                   | \$0049, 73: Logical number of     |
|                                   | CLOSE.\                           |
|                                   | Device number of LOAD, SAVE and   |
|                                   | VERIFY.                           |
+-----------------------------------+-----------------------------------+
| \$004B-\$004C\                    | Temporary area for saving         |
| 75-76                             | original pointer to current BASIC |
|                                   | instruction during GET, INPUT and |
|                                   | READ.                             |
+-----------------------------------+-----------------------------------+
| \$004D\                           | Comparison operator indicator.    |
| 77                                | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #1: 1 = \"\>\" (greater   |
|                                   |     than) is present in           |
|                                   |     expression.                   |
|                                   |                                   |
|                                   | -   Bit #2: 1 = \"=\" (equal to)  |
|                                   |     is present in expression.     |
|                                   |                                   |
|                                   | -   Bit #3: 1 = \"\<\" (less      |
|                                   |     than) is present in           |
|                                   |     expression.                   |
+-----------------------------------+-----------------------------------+
| \$004E-\$004F\                    | Pointer to current FN function.   |
| 78-79                             |                                   |
+-----------------------------------+-----------------------------------+
| \$0050-\$0051\                    | Pointer to current string         |
| 80-81                             | variable during memory            |
|                                   | allocation.                       |
+-----------------------------------+-----------------------------------+
| \$0052\                           | Unused.                           |
| 82                                |                                   |
+-----------------------------------+-----------------------------------+
| \$0053\                           | Step size of garbage collection.  |
| 83                                | Values: \$03; \$07.               |
+-----------------------------------+-----------------------------------+
| \$0054-\$0056\                    | JMP ABS machine instruction, jump |
| 84-86                             | to current BASIC function.\       |
|                                   | \$0055-\$0056, 85-86: Execution   |
|                                   | address of current BASIC          |
|                                   | function.                         |
+-----------------------------------+-----------------------------------+
| \$0057-\$005B\                    | Arithmetic register #3 (5 bytes). |
| 87-91                             |                                   |
+-----------------------------------+-----------------------------------+
| \$005C-\$0060\                    | Arithmetic register #4 (5 bytes). |
| 92-96                             |                                   |
+-----------------------------------+-----------------------------------+
| \$0061-\$0065\                    | FAC, arithmetic register #1 (5    |
| 97-101                            | bytes).                           |
+-----------------------------------+-----------------------------------+
| \$0066\                           | Sign of FAC. Bits:                |
| 102                               |                                   |
|                                   | -   Bit #7: 0 = Positive; 1 =     |
|                                   |     Negative.                     |
+-----------------------------------+-----------------------------------+
| \$0067\                           | Number of degrees during          |
| 103                               | polynomial evaluation.            |
+-----------------------------------+-----------------------------------+
| \$0068\                           | Temporary area for various        |
| 104                               | operations.                       |
+-----------------------------------+-----------------------------------+
| \$0069-\$006D\                    | ARG, arithmetic register #2 (5    |
| 105-109                           | bytes).                           |
+-----------------------------------+-----------------------------------+
| \$006E\                           | Sign of ARG. Bits:                |
| 110                               |                                   |
|                                   | -   Bit #7: 0 = Positive; 1 =     |
|                                   |     Negative.                     |
+-----------------------------------+-----------------------------------+
| \$006F-\$0070\                    | Pointer to first string           |
| 111-112                           | expression during string          |
|                                   | comparison.                       |
+-----------------------------------+-----------------------------------+
| \$0071-\$0072\                    | Auxiliary pointer during array    |
| 113-114                           | operations.\                      |
|                                   | Temporary area for saving         |
|                                   | original pointer to current BASIC |
|                                   | instruction during VAL().\        |
|                                   | Pointer to current item of        |
|                                   | polynomial table during           |
|                                   | polynomial evaluation.            |
+-----------------------------------+-----------------------------------+
| \$0073-\$008A\                    | CHRGET. Machine code routine to   |
| 115-138                           | read next byte from BASIC program |
|                                   | or direct command (24 bytes).\    |
|                                   | \$0079, 121: CHRGOT. Read current |
|                                   | byte from BASIC program or direct |
|                                   | command.\                         |
|                                   | \$007A-\$007B, 122-123: Pointer   |
|                                   | to current byte in BASIC program  |
|                                   | or direct command.                |
+-----------------------------------+-----------------------------------+
| \$008B-\$008F\                    | Previous result of RND().         |
| 139-143                           |                                   |
+-----------------------------------+-----------------------------------+
| \$0090\                           | Value of ST variable, device      |
| 144                               | status for serial bus and         |
|                                   | datasette input/output. Serial    |
|                                   | bus bits:                         |
|                                   |                                   |
|                                   | -   Bit #0: Transfer direction    |
|                                   |     during which the timeout      |
|                                   |     occured; 0 = Input; 1 =       |
|                                   |     Output.                       |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Timeout occurred. |
|                                   |                                   |
|                                   | -   Bit #4: 1 = VERIFY error      |
|                                   |     occurred (only during         |
|                                   |     VERIFY), the file read from   |
|                                   |     the device did not match that |
|                                   |     in the memory.                |
|                                   |                                   |
|                                   | -   Bit #6: 1 = End of file has   |
|                                   |     been reached.                 |
|                                   |                                   |
|                                   | -   Bit #7: 1 = Device is not     |
|                                   |     present.                      |
|                                   |                                   |
|                                   | Datasette bits:                   |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Block is too      |
|                                   |     short (shorter than 192       |
|                                   |     bytes).                       |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Block is too long |
|                                   |     (longer than 192 bytes).      |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Not all bytes     |
|                                   |     read with error during pass 1 |
|                                   |     could be corrected during     |
|                                   |     pass 2, or a VERIFY error     |
|                                   |     occurred, the file read from  |
|                                   |     the device did not match that |
|                                   |     in the memory.                |
|                                   |                                   |
|                                   | -   Bit #5: 1 = Checksum error    |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #6: 1 = End of file has   |
|                                   |     been reached (only during     |
|                                   |     reading data files).          |
+-----------------------------------+-----------------------------------+
| \$0091\                           | Stop key indicator. Values:       |
| 145                               |                                   |
|                                   | -   \$7F: Stop key is pressed.    |
|                                   |                                   |
|                                   | -   \$FF: Stop key is not         |
|                                   |     pressed.                      |
+-----------------------------------+-----------------------------------+
| \$0092\                           | Unknown. (Timing constant during  |
| 146                               | datasette input.)                 |
+-----------------------------------+-----------------------------------+
| \$0093\                           | LOAD/VERIFY switch. Values:       |
| 147                               |                                   |
|                                   | -   \$00: LOAD.                   |
|                                   |                                   |
|                                   | -   \$01-\$FF: VERIFY.            |
+-----------------------------------+-----------------------------------+
| \$0094\                           | Serial bus output cache status.   |
| 148                               | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #7: 1 = Output cache      |
|                                   |     dirty, must transfer cache    |
|                                   |     contents upon next output to  |
|                                   |     serial bus.                   |
+-----------------------------------+-----------------------------------+
| \$0095\                           | Serial bus output cache, previous |
| 149                               | byte to be sent to serial bus.    |
+-----------------------------------+-----------------------------------+
| \$0096\                           | Unknown. (End of tape indicator   |
| 150                               | during datasette input/output.)   |
+-----------------------------------+-----------------------------------+
| \$0097\                           | Temporary area for saving         |
| 151                               | original value of Y register      |
|                                   | during input from RS232.\         |
|                                   | Temporary area for saving         |
|                                   | original value of X register      |
|                                   | during input from datasette.      |
+-----------------------------------+-----------------------------------+
| \$0098\                           | Number of files currently open.   |
| 152                               | Values: \$00-\$0A, 0-10.          |
+-----------------------------------+-----------------------------------+
| \$0099\                           | Current input device number.\     |
| 153                               | Default: \$00, keyboard.          |
+-----------------------------------+-----------------------------------+
| \$009A\                           | Current output device number.\    |
| 154                               | Default: \$03, screen.            |
+-----------------------------------+-----------------------------------+
| \$009B\                           | Unknown. (Parity bit during       |
| 155                               | datasette input/output.)          |
+-----------------------------------+-----------------------------------+
| \$009C\                           | Unknown. (Byte ready indicator    |
| 156                               | during datasette input/output.)   |
+-----------------------------------+-----------------------------------+
| \$009D\                           | System error display switch.      |
| 157                               | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #6: 0 = Suppress I/O      |
|                                   |     error messages; 1 = Display   |
|                                   |     them.                         |
|                                   |                                   |
|                                   | -   Bit #7: 0 = Suppress system   |
|                                   |     messages; 1 = Display them.   |
+-----------------------------------+-----------------------------------+
| \$009E\                           | Byte to be put into output buffer |
| 158                               | during RS232 and datasette        |
|                                   | output.\                          |
|                                   | Block header type during          |
|                                   | datasette input/output.\          |
|                                   | Length of file name during        |
|                                   | datasette input/output.\          |
|                                   | Error counter during LOAD from    |
|                                   | datasette. Values: \$00-\$3E,     |
|                                   | 0-62.                             |
+-----------------------------------+-----------------------------------+
| \$009F\                           | Auxiliary counter for writing     |
| 159                               | file name into datasette buffer.\ |
|                                   | Auxiliary counter for comparing   |
|                                   | requested file name with file     |
|                                   | name read from datasette during   |
|                                   | datasette input.\                 |
|                                   | Error correction counter during   |
|                                   | LOAD from datasette. Values:      |
|                                   | \$00-\$3E, 0-62.                  |
+-----------------------------------+-----------------------------------+
| \$00A0-\$00A2\                    | Value of TI variable, time of     |
| 160-162                           | day, increased by 1 every 1/60    |
|                                   | second (on PAL machines). Values: |
|                                   | \$000000-\$4F19FF, 0-518399 (on   |
|                                   | PAL machines).                    |
+-----------------------------------+-----------------------------------+
| \$00A3\                           | EOI switch during serial bus      |
| 163                               | output. Bits:                     |
|                                   |                                   |
|                                   | -   Bit #7: 0 = Send byte right   |
|                                   |     after handshake; 1 = Do EOI   |
|                                   |     delay first.                  |
|                                   |                                   |
|                                   | Bit counter during datasette      |
|                                   | output.                           |
+-----------------------------------+-----------------------------------+
| \$00A4\                           | Byte buffer during serial bus     |
| 164                               | input.\                           |
|                                   | Parity during datasette           |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$00A5\                           | Bit counter during serial bus     |
| 165                               | input/output.\                    |
|                                   | Counter for sync mark during      |
|                                   | datasette output.                 |
+-----------------------------------+-----------------------------------+
| \$00A6\                           | Offset of current byte in         |
| 166                               | datasette buffer.                 |
+-----------------------------------+-----------------------------------+
| \$00A7\                           | Bit buffer during RS232 input.    |
| 167                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00A8\                           | Bit counter during RS232 input.   |
| 168                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00A9\                           | Stop bit switch during RS232      |
| 169                               | input. Values:                    |
|                                   |                                   |
|                                   | -   \$00: Data bit.               |
|                                   |                                   |
|                                   | -   \$01-\$FF: Stop bit.          |
+-----------------------------------+-----------------------------------+
| \$00AA\                           | Byte buffer during RS232 input.   |
| 170                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00AB\                           | Parity during RS232 input.\       |
| 171                               | Computed block checksum during    |
|                                   | datasette input.                  |
+-----------------------------------+-----------------------------------+
| \$00AC-\$00AD\                    | Start address for SAVE to serial  |
| 172-173                           | bus.\                             |
|                                   | Pointer to current byte during    |
|                                   | SAVE to serial bus or datasette.\ |
|                                   | Pointer to line in screen memory  |
|                                   | to be scrolled during scrolling   |
|                                   | the screen.                       |
+-----------------------------------+-----------------------------------+
| \$00AE-\$00AF\                    | Load address read from input file |
| 174-175                           | and pointer to current byte       |
|                                   | during LOAD/VERIFY from serial    |
|                                   | bus.\                             |
|                                   | End address after LOAD/VERIFY     |
|                                   | from serial bus or datasette.\    |
|                                   | End address for SAVE to serial    |
|                                   | bus or datasette.\                |
|                                   | Pointer to line in Color RAM to   |
|                                   | be scrolled during scrolling the  |
|                                   | screen.                           |
+-----------------------------------+-----------------------------------+
| \$00B0-\$00B1\                    | Unknown.                          |
| 176-177                           |                                   |
+-----------------------------------+-----------------------------------+
| \$00B2-\$00B3\                    | Pointer to datasette buffer.\     |
| 178-179                           | Default: \$033C, 828.             |
+-----------------------------------+-----------------------------------+
| \$00B4\                           | Bit counter and stop bit switch   |
| 180                               | during RS232 output. Bits:        |
|                                   |                                   |
|                                   | -   Bits #0-#6: Bit count.        |
|                                   |                                   |
|                                   | -   Bit #7: 0 = Data bit; 1 =     |
|                                   |     Stop bit.                     |
|                                   |                                   |
|                                   | Bit counter during datasette      |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$00B5\                           | Bit buffer (in bit #2) during     |
| 181                               | RS232 output.                     |
+-----------------------------------+-----------------------------------+
| \$00B6\                           | Byte buffer during RS232 output.  |
| 182                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00B7\                           | Length of file name or disk       |
| 183                               | command; first parameter of LOAD, |
|                                   | SAVE and VERIFY or fourth         |
|                                   | parameter of OPEN. Values:        |
|                                   |                                   |
|                                   | -   \$00: No parameter.           |
|                                   |                                   |
|                                   | -   \$01-\$FF: Parameter length.  |
+-----------------------------------+-----------------------------------+
| \$00B8\                           | Logical number of current file.   |
| 184                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00B9\                           | Secondary address of current      |
| 185                               | file.                             |
+-----------------------------------+-----------------------------------+
| \$00BA\                           | Device number of current file.    |
| 186                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00BB-\$00BC\                    | Pointer to current file name or   |
| 187-188                           | disk command; first parameter of  |
|                                   | LOAD, SAVE and VERIFY or fourth   |
|                                   | parameter of OPEN.                |
+-----------------------------------+-----------------------------------+
| \$00BD\                           | Parity during RS232 output.\      |
| 189                               | Byte buffer during datasette      |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$00BE\                           | Block counter during datasette    |
| 190                               | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$00BF\                           | Unknown.                          |
| 191                               |                                   |
+-----------------------------------+-----------------------------------+
| \$00C0\                           | Datasette motor switch. Values:   |
| 192                               |                                   |
|                                   | -   \$00: No button was pressed,  |
|                                   |     motor has been switched off.  |
|                                   |     If a button is pressed on the |
|                                   |     datasette, must switch motor  |
|                                   |     on.                           |
|                                   |                                   |
|                                   | -   \$01-\$FF: Motor is on.       |
+-----------------------------------+-----------------------------------+
| \$00C1-\$00C2\                    | Start address during SAVE to      |
| 193-194                           | serial bus, LOAD and VERIFY from  |
|                                   | datasette and SAVE to datasette.\ |
|                                   | Pointer to current byte during    |
|                                   | memory test.                      |
+-----------------------------------+-----------------------------------+
| \$00C3-\$00C4\                    | Start address for a secondary     |
| 195-196                           | address of 0 for LOAD and VERIFY  |
|                                   | from serial bus or datasette.\    |
|                                   | Pointer to ROM table of default   |
|                                   | vectors during initialization of  |
|                                   | I/O vectors.                      |
+-----------------------------------+-----------------------------------+
| \$00C5\                           | Matrix code of key previously     |
| 197                               | pressed. Values:                  |
|                                   |                                   |
|                                   | -   \$00-\$3F: Keyboard matrix    |
|                                   |     code.                         |
|                                   |                                   |
|                                   | -   \$40: No key was pressed at   |
|                                   |     the time of previous check.   |
+-----------------------------------+-----------------------------------+
| \$00C6\                           | Length of keyboard buffer.        |
| 198                               | Values:                           |
|                                   |                                   |
|                                   | -   \$00, 0: Buffer is empty.     |
|                                   |                                   |
|                                   | -   \$01-\$0A, 1-10: Buffer       |
|                                   |     length.                       |
+-----------------------------------+-----------------------------------+
| \$00C7\                           | Reverse mode switch. Values:      |
| 199                               |                                   |
|                                   | -   \$00: Normal mode.            |
|                                   |                                   |
|                                   | -   \$12: Reverse mode.           |
+-----------------------------------+-----------------------------------+
| \$00C8\                           | Length of line minus 1 during     |
| 200                               | screen input. Values: \$27, 39;   |
|                                   | \$4F, 79.                         |
+-----------------------------------+-----------------------------------+
| \$00C9\                           | Cursor row during screen input.   |
| 201                               | Values: \$00-\$18, 0-24.          |
+-----------------------------------+-----------------------------------+
| \$00CA\                           | Cursor column during screen       |
| 202                               | input. Values: \$00-\$27, 0-39.   |
+-----------------------------------+-----------------------------------+
| \$00CB\                           | Matrix code of key currently      |
| 203                               | being pressed. Values:            |
|                                   |                                   |
|                                   | -   \$00-\$3F: Keyboard matrix    |
|                                   |     code.                         |
|                                   |                                   |
|                                   | -   \$40: No key is currently     |
|                                   |     pressed.                      |
+-----------------------------------+-----------------------------------+
| \$00CC\                           | Cursor visibility switch. Values: |
| 204                               |                                   |
|                                   | -   \$00: Cursor is on.           |
|                                   |                                   |
|                                   | -   \$01-\$FF: Cursor is off.     |
+-----------------------------------+-----------------------------------+
| \$00CD\                           | Delay counter for changing cursor |
| 205                               | phase. Values:                    |
|                                   |                                   |
|                                   | -   \$00, 0: Must change cursor   |
|                                   |     phase.                        |
|                                   |                                   |
|                                   | -   \$01-\$14, 1-20: Delay.       |
+-----------------------------------+-----------------------------------+
| \$00CE\                           | Screen code of character under    |
| 206                               | cursor.                           |
+-----------------------------------+-----------------------------------+
| \$00CF\                           | Cursor phase switch. Values:      |
| 207                               |                                   |
|                                   | -   \$00: Cursor off phase,       |
|                                   |     original character visible.   |
|                                   |                                   |
|                                   | -   \$01: Cursor on phase,        |
|                                   |     reverse character visible.    |
+-----------------------------------+-----------------------------------+
| \$00D0\                           | End of line switch during screen  |
| 208                               | input. Values:                    |
|                                   |                                   |
|                                   | -   \$00: Return character        |
|                                   |     reached, end of line.         |
|                                   |                                   |
|                                   | -   \$01-\$FF: Still reading      |
|                                   |     characters from line.         |
+-----------------------------------+-----------------------------------+
| \$00D1-\$00D2\                    | Pointer to current line in screen |
| 209-210                           | memory.                           |
+-----------------------------------+-----------------------------------+
| \$00D3\                           | Current cursor column. Values:    |
| 211                               | \$00-\$27, 0-39.                  |
+-----------------------------------+-----------------------------------+
| \$00D4\                           | Quotation mode switch. Values:    |
| 212                               |                                   |
|                                   | -   \$00: Normal mode.            |
|                                   |                                   |
|                                   | -   \$01: Quotation mode.         |
+-----------------------------------+-----------------------------------+
| \$00D5\                           | Length of current screen line     |
| 213                               | minus 1. Values: \$27, 39; \$4F,  |
|                                   | 79.                               |
+-----------------------------------+-----------------------------------+
| \$00D6\                           | Current cursor row. Values:       |
| 214                               | \$00-\$18, 0-24.                  |
+-----------------------------------+-----------------------------------+
| \$00D7\                           | PETSCII code of character during  |
| 215                               | screen input/output.\             |
|                                   | Bit buffer during datasette       |
|                                   | input.\                           |
|                                   | Block checksum during datasette   |
|                                   | output.                           |
+-----------------------------------+-----------------------------------+
| \$00D8\                           | Number of insertions. Values:     |
| 216                               |                                   |
|                                   | -   \$00: No insertions made,     |
|                                   |     normal mode, control codes    |
|                                   |     change screen layout or       |
|                                   |     behavior.                     |
|                                   |                                   |
|                                   | -   \$01-\$FF: Number of          |
|                                   |     insertions, when inputting    |
|                                   |     this many character next,     |
|                                   |     those must be turned into     |
|                                   |     control codes, similarly to   |
|                                   |     quotation mode.               |
+-----------------------------------+-----------------------------------+
| \$00D9-\$00F1\                    | High byte of pointers to each     |
| 217-241                           | line in screen memory (25 bytes). |
|                                   | Values:                           |
|                                   |                                   |
|                                   | -   \$00-\$7F: Pointer high byte. |
|                                   |                                   |
|                                   | -   \$80-\$FF: No pointer, line   |
|                                   |     is an extension of previous   |
|                                   |     line on screen.               |
+-----------------------------------+-----------------------------------+
| \$00F2\                           | Temporary area during scrolling   |
| 242                               | the screen.                       |
+-----------------------------------+-----------------------------------+
| \$00F3-\$00F4\                    | Pointer to current line in Color  |
| 243-244                           | RAM.                              |
+-----------------------------------+-----------------------------------+
| \$00F5-\$00F6\                    | Pointer to current conversion     |
| 245-246                           | table during conversion from      |
|                                   | keyboard matrix codes to PETSCII  |
|                                   | codes.                            |
+-----------------------------------+-----------------------------------+
| \$00F7-\$00F8\                    | Pointer to RS232 input buffer.    |
| 247-248                           | Values:                           |
|                                   |                                   |
|                                   | -   \$0000-\$00FF: No buffer      |
|                                   |     defined, a new buffer must be |
|                                   |     allocated upon RS232 input.   |
|                                   |                                   |
|                                   | -   \$0100-\$FFFF: Buffer         |
|                                   |     pointer.                      |
+-----------------------------------+-----------------------------------+
| \$00F9-\$00FA\                    | Pointer to RS232 output buffer.   |
| 249-250                           | Values:                           |
|                                   |                                   |
|                                   | -   \$0000-\$00FF: No buffer      |
|                                   |     defined, a new buffer must be |
|                                   |     allocated upon RS232 output.  |
|                                   |                                   |
|                                   | -   \$0100-\$FFFF: Buffer         |
|                                   |     pointer.                      |
+-----------------------------------+-----------------------------------+
| \$00FB-\$00FE\                    | Unused (4 bytes).                 |
| 251-254                           |                                   |
+-----------------------------------+-----------------------------------+
| \$00FF-\$010A\                    | Buffer for conversion from        |
| 255-266                           | floating point to string (12      |
|                                   | bytes.)                           |
|                                   |                                   |
|                                   | []{#page01}[]{#cpustack}          |
+-----------------------------------+-----------------------------------+
| **\$0100-\$01FF, 256-511\         |                                   |
| Processor stack**                 |                                   |
+-----------------------------------+-----------------------------------+
| \$00FF-\$010A\                    | Buffer for conversion from        |
| 255-266                           | floating point to string (12      |
|                                   | bytes.)                           |
+-----------------------------------+-----------------------------------+
| \$0100-\$013D\                    | Pointers to bytes read with error |
| 256-317                           | during datasette input (62 bytes, |
|                                   | 31 entries).                      |
+-----------------------------------+-----------------------------------+
| \$0100-\$01FF\                    | Processor stack. Also used for    |
| 256-511                           | storing data related to FOR and   |
|                                   | GOSUB.                            |
|                                   |                                   |
|                                   | []{#page02}                       |
+-----------------------------------+-----------------------------------+
| **\$0200-\$02FF, 512-767**        |                                   |
+-----------------------------------+-----------------------------------+
| \$0200-\$0258\                    | Input buffer, storage area for    |
| 512-600                           | data read from screen (89 bytes). |
+-----------------------------------+-----------------------------------+
| \$0259-\$0262\                    | Logical numbers assigned to files |
| 601-610                           | (10 bytes, 10 entries).           |
+-----------------------------------+-----------------------------------+
| \$0263-\$026C\                    | Device numbers assigned to files  |
| 611-620                           | (10 bytes, 10 entries).           |
+-----------------------------------+-----------------------------------+
| \$026D-\$0276\                    | Secondary addresses assigned to   |
| 621-630                           | files (10 bytes, 10 entries).     |
+-----------------------------------+-----------------------------------+
| \$0277-\$0280\                    | Keyboard buffer (10 bytes, 10     |
| 631-640                           | entries).                         |
+-----------------------------------+-----------------------------------+
| \$0281-\$0282\                    | Pointer to beginning of BASIC     |
| 641-642                           | area after memory test.\          |
|                                   | Default: \$0800, 2048.            |
+-----------------------------------+-----------------------------------+
| \$0283-\$0284\                    | Pointer to end of BASIC area      |
| 643-644                           | after memory test.\               |
|                                   | Default: \$A000, 40960.           |
+-----------------------------------+-----------------------------------+
| \$0285\                           | Unused. (Serial bus timeout.)     |
| 645                               |                                   |
+-----------------------------------+-----------------------------------+
| \$0286\                           | Current color, cursor color.      |
| 646                               | Values: \$00-\$0F, 0-15.          |
+-----------------------------------+-----------------------------------+
| \$0287\                           | Color of character under cursor.  |
| 647                               | Values: \$00-\$0F, 0-15.          |
+-----------------------------------+-----------------------------------+
| \$0288\                           | High byte of pointer to screen    |
| 648                               | memory for screen input/output.\  |
|                                   | Default: \$04, \$0400, 1024.      |
+-----------------------------------+-----------------------------------+
| \$0289\                           | Maximum length of keyboard        |
| 649                               | buffer. Values:                   |
|                                   |                                   |
|                                   | -   \$00, 0: No buffer.           |
|                                   |                                   |
|                                   | -   \$01-\$0F, 1-15: Buffer size. |
+-----------------------------------+-----------------------------------+
| \$028A\                           | Keyboard repeat switch. Bits:     |
| 650                               |                                   |
|                                   | -   Bits #6-#7: %00 = Only cursor |
|                                   |     up/down, cursor left/right,   |
|                                   |     Insert/Delete and Space       |
|                                   |     repeat; %01 = No key repeats; |
|                                   |     %1x = All keys repeat.        |
+-----------------------------------+-----------------------------------+
| \$028B\                           | Delay counter during repeat       |
| 651                               | sequence, for delaying between    |
|                                   | successive repeats. Values:       |
|                                   |                                   |
|                                   | -   \$00, 0: Must repeat key.     |
|                                   |                                   |
|                                   | -   \$01-\$04, 1-4: Delay         |
|                                   |     repetition.                   |
+-----------------------------------+-----------------------------------+
| \$028C\                           | Repeat sequence delay counter,    |
| 652                               | for delaying before first         |
|                                   | repetition. Values:               |
|                                   |                                   |
|                                   | -   \$00, 0: Must start repeat    |
|                                   |     sequence.                     |
|                                   |                                   |
|                                   | -   \$01-\$10, 1-16: Delay repeat |
|                                   |     sequence.                     |
+-----------------------------------+-----------------------------------+
| \$028D\                           | Shift key indicator. Bits:        |
| 653                               |                                   |
|                                   | -   Bit #0: 1 = One or more of    |
|                                   |     left Shift, right Shift or    |
|                                   |     Shift Lock is currently being |
|                                   |     pressed or locked.            |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Commodore is      |
|                                   |     currently being pressed.      |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Control is        |
|                                   |     currently being pressed.      |
+-----------------------------------+-----------------------------------+
| \$028E\                           | Previous value of shift key       |
| 654                               | indicator. Bits:                  |
|                                   |                                   |
|                                   | -   Bit #0: 1 = One or more of    |
|                                   |     left Shift, right Shift or    |
|                                   |     Shift Lock was pressed or     |
|                                   |     locked at the time of         |
|                                   |     previous check.               |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Commodore was     |
|                                   |     pressed at the time of        |
|                                   |     previous check.               |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Control was       |
|                                   |     pressed at the time of        |
|                                   |     previous check.               |
+-----------------------------------+-----------------------------------+
| \$028F-\$0290\                    | Execution address of routine      |
| 655-656                           | that, based on the status of      |
|                                   | shift keys, sets the pointer at   |
|                                   | memory address \$00F5-\$00F6 to   |
|                                   | the appropriate conversion table  |
|                                   | for converting keyboard matrix    |
|                                   | codes to PETSCII codes.\          |
|                                   | Default: \$EB48.                  |
+-----------------------------------+-----------------------------------+
| \$0291\                           | Commodore-Shift switch. Bits:     |
| 657                               |                                   |
|                                   | -   Bit #7: 0 = Commodore-Shift   |
|                                   |     is enabled, the key           |
|                                   |     combination will toggle       |
|                                   |     between the                   |
|                                   |     uppercase/graphics and        |
|                                   |     lowercase/uppercase character |
|                                   |     set; 1 = Commodore-Shift is   |
|                                   |     disabled.                     |
+-----------------------------------+-----------------------------------+
| \$0292\                           | Scroll direction switch during    |
| 658                               | scrolling the screen. Values:     |
|                                   |                                   |
|                                   | -   \$00: Insertion of line       |
|                                   |     before current line, current  |
|                                   |     line and all lines below it   |
|                                   |     must be scrolled 1 line       |
|                                   |     downwards.                    |
|                                   |                                   |
|                                   | -   \$01-\$FF: Bottom of screen   |
|                                   |     reached, complete screen must |
|                                   |     be scrolled 1 line upwards.   |
+-----------------------------------+-----------------------------------+
| \$0293\                           | RS232 control register. Bits:     |
| 659                               |                                   |
|                                   | -   Bits #0-#3: Baud rate,        |
|                                   |     transfer speed. Values:       |
|                                   |                                   |
|                                   |     -   %0000: User specified.    |
|                                   |                                   |
|                                   |     -   %0001: 50 bit/s.          |
|                                   |                                   |
|                                   |     -   %0010: 75 bit/s.          |
|                                   |                                   |
|                                   |     -   %0011: 110 bit/s.         |
|                                   |                                   |
|                                   |     -   %0100: 150 bit/s.         |
|                                   |                                   |
|                                   |     -   %0101: 300 bit/s.         |
|                                   |                                   |
|                                   |     -   %0110: 600 bit/s.         |
|                                   |                                   |
|                                   |     -   %0111: 1200 bit/s.        |
|                                   |                                   |
|                                   |     -   %1000: 2400 bit/s.        |
|                                   |                                   |
|                                   |     -   %1001: 1800 bit/s.        |
|                                   |                                   |
|                                   |     -   %1010: 2400 bit/s.        |
|                                   |                                   |
|                                   |     -   %1011: 3600 bit/s.        |
|                                   |                                   |
|                                   |     -   %1100: 4800 bit/s.        |
|                                   |                                   |
|                                   |     -   %1101: 7200 bit/s.        |
|                                   |                                   |
|                                   |     -   %1110: 9600 bit/s.        |
|                                   |                                   |
|                                   |     -   %1111: 19200 bit/s.       |
|                                   |                                   |
|                                   | -   Bits #5-#6: Byte size, number |
|                                   |     of data bits per byte; %00 =  |
|                                   |     8; %01 = 7, %10 = 6; %11 = 5. |
|                                   |                                   |
|                                   | -   Bit #7: Number of stop bits;  |
|                                   |     0 = 1 stop bit; 1 = 2 stop    |
|                                   |     bits.                         |
+-----------------------------------+-----------------------------------+
| \$0294\                           | RS232 command register. Bits:     |
| 660                               |                                   |
|                                   | -   Bit #0: Synchronization type; |
|                                   |     0 = 3 lines; 1 = X lines.     |
|                                   |                                   |
|                                   | -   Bit #4: Transmission type; 0  |
|                                   |     = Duplex; 1 = Half duplex.    |
|                                   |                                   |
|                                   | -   Bits #5-#7: Parity mode.      |
|                                   |     Values:                       |
|                                   |                                   |
|                                   |     -   %xx0: No parity check,    |
|                                   |         bit #7 does not exist.    |
|                                   |                                   |
|                                   |     -   %001: Odd parity.         |
|                                   |                                   |
|                                   |     -   %011: Even parity.        |
|                                   |                                   |
|                                   |     -   %101: No parity check,    |
|                                   |         bit #7 is always 1.       |
|                                   |                                   |
|                                   |     -   %111: No parity check,    |
|                                   |         bit #7 is always 0.       |
+-----------------------------------+-----------------------------------+
| \$0295-\$0296\                    | Default value of RS232 output     |
| 661-662                           | timer, based on baud rate. (Must  |
|                                   | be filled with actual value       |
|                                   | before RS232 input/output if baud |
|                                   | rate is \"user specified\" in     |
|                                   | RS232 control register, memory    |
|                                   | address \$0293.)                  |
+-----------------------------------+-----------------------------------+
| \$0297\                           | Value of ST variable, device      |
| 663                               | status for RS232 input/output.    |
|                                   | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Parity error      |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Frame error, a    |
|                                   |     stop bit with the value of 0, |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Input buffer      |
|                                   |     underflow occurred, too much  |
|                                   |     data has arrived but it has   |
|                                   |     not been read from the buffer |
|                                   |     in time.                      |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Input buffer is   |
|                                   |     empty, nothing to read.       |
|                                   |                                   |
|                                   | -   Bit #4: 0 = Sender is Clear   |
|                                   |     To Send; 1 = Sender is not    |
|                                   |     ready to send data to         |
|                                   |     receiver.                     |
|                                   |                                   |
|                                   | -   Bit #6: 0 = Receiver reports  |
|                                   |     Data Set Ready; 1 = Receiver  |
|                                   |     is not ready to receive data. |
|                                   |                                   |
|                                   | -   Bit #7: 1 = Carrier loss, a   |
|                                   |     stop bit and a data byte both |
|                                   |     with the value of 0,          |
|                                   |     detected.                     |
+-----------------------------------+-----------------------------------+
| \$0298\                           | RS232 byte size, number of data   |
| 664                               | bits per data byte, default value |
|                                   | for bit counters.                 |
+-----------------------------------+-----------------------------------+
| \$0299-\$029A\                    | Default value of RS232 input      |
| 665-666                           | timer, based on baud rate.        |
|                                   | (Calculated automatically from    |
|                                   | default value of RS232 output     |
|                                   | timer, at memory address          |
|                                   | \$0295-\$0296.)                   |
+-----------------------------------+-----------------------------------+
| \$029B\                           | Offset of byte received in RS232  |
| 667                               | input buffer.                     |
+-----------------------------------+-----------------------------------+
| \$029C\                           | Offset of current byte in RS232   |
| 668                               | input buffer.                     |
+-----------------------------------+-----------------------------------+
| \$029D\                           | Offset of byte to send in RS232   |
| 669                               | output buffer.                    |
+-----------------------------------+-----------------------------------+
| \$029E\                           | Offset of current byte in RS232   |
| 670                               | output buffer.                    |
+-----------------------------------+-----------------------------------+
| \$029F-\$02A0\                    | Temporary area for saving pointer |
| 671-672                           | to original interrupt service     |
|                                   | routine during datasette input    |
|                                   | output. Values:                   |
|                                   |                                   |
|                                   | -   \$0000-\$00FF: No datasette   |
|                                   |     input/output took place yet   |
|                                   |     or original pointer has been  |
|                                   |     already restored.             |
|                                   |                                   |
|                                   | -   \$0100-\$FFFF: Original       |
|                                   |     pointer, datasette            |
|                                   |     input/output currently in     |
|                                   |     progress.                     |
+-----------------------------------+-----------------------------------+
| \$02A1\                           | Temporary area for saving         |
| 673                               | original value of CIA#2 interrupt |
|                                   | control register, at memory       |
|                                   | address \$DD0D, during RS232      |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$02A2\                           | Temporary area for saving         |
| 674                               | original value of CIA#1 timer #1  |
|                                   | control register, at memory       |
|                                   | address \$DC0E, during datasette  |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$02A3\                           | Temporary area for saving         |
| 675                               | original value of CIA#1 interrupt |
|                                   | control register, at memory       |
|                                   | address \$DC0D, during datasette  |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$02A4\                           | Temporary area for saving         |
| 676                               | original value of CIA#1 timer #1  |
|                                   | control register, at memory       |
|                                   | address \$DC0E, during datasette  |
|                                   | input/output.                     |
+-----------------------------------+-----------------------------------+
| \$02A5\                           | Number of line currently being    |
| 677                               | scrolled during scrolling the     |
|                                   | screen.                           |
+-----------------------------------+-----------------------------------+
| \$02A6\                           | PAL/NTSC switch, for selecting    |
| 678                               | RS232 baud rate from the proper   |
|                                   | table. Values:                    |
|                                   |                                   |
|                                   | -   \$00: NTSC.                   |
|                                   |                                   |
|                                   | -   \$01: PAL.                    |
+-----------------------------------+-----------------------------------+
| \$02A7-\$02FF\                    | Unused (89 bytes).                |
| 679-767                           |                                   |
|                                   | []{#page03}                       |
+-----------------------------------+-----------------------------------+
| **\$0300-\$03FF, 768-1023**       |                                   |
+-----------------------------------+-----------------------------------+
| \$0300-\$0301\                    | Execution address of warm reset,  |
| 768-769                           | displaying optional BASIC error   |
|                                   | message and entering BASIC idle   |
|                                   | loop.\                            |
|                                   | Default: \$E38B.                  |
+-----------------------------------+-----------------------------------+
| \$0302-\$0303\                    | Execution address of BASIC idle   |
| 770-771                           | loop.\                            |
|                                   | Default: \$A483.                  |
+-----------------------------------+-----------------------------------+
| \$0304-\$0305\                    | Execution address of BASIC line   |
| 772-773                           | tokenizater routine.\             |
|                                   | Default: \$A57C.                  |
+-----------------------------------+-----------------------------------+
| \$0306-\$0307\                    | Execution address of BASIC token  |
| 774-775                           | decoder routine.\                 |
|                                   | Default: \$A71A.                  |
+-----------------------------------+-----------------------------------+
| \$0308-\$0309\                    | Execution address of BASIC        |
| 776-777                           | instruction executor routine.\    |
|                                   | Default: \$A7E4.                  |
+-----------------------------------+-----------------------------------+
| \$030A-\$030B\                    | Execution address of routine      |
| 778-779                           | reading next item of BASIC        |
|                                   | expression.\                      |
|                                   | Default: \$AE86.                  |
+-----------------------------------+-----------------------------------+
| \$030C\                           | Default value of register A for   |
| 780                               | SYS.\                             |
|                                   | Value of register A after SYS.    |
+-----------------------------------+-----------------------------------+
| \$030D\                           | Default value of register X for   |
| 781                               | SYS.\                             |
|                                   | Value of register X after SYS.    |
+-----------------------------------+-----------------------------------+
| \$030E\                           | Default value of register Y for   |
| 782                               | SYS.\                             |
|                                   | Value of register Y after SYS.    |
+-----------------------------------+-----------------------------------+
| \$030F\                           | Default value of status register  |
| 783                               | for SYS.\                         |
|                                   | Value of status register after    |
|                                   | SYS.                              |
+-----------------------------------+-----------------------------------+
| \$0310-\$0312\                    | JMP ABS machine instruction, jump |
| 784-786                           | to USR() function.\               |
|                                   | \$0311-\$0312, 785-786: Execution |
|                                   | address of USR() function.        |
+-----------------------------------+-----------------------------------+
| \$0313\                           | Unused.                           |
| 787                               |                                   |
+-----------------------------------+-----------------------------------+
| \$0314-\$0315\                    | Execution address of interrupt    |
| 788-789                           | service routine.\                 |
|                                   | Default: \$EA31.                  |
+-----------------------------------+-----------------------------------+
| \$0316-\$0317\                    | Execution address of BRK service  |
| 790-791                           | routine.\                         |
|                                   | Default: \$FE66.                  |
+-----------------------------------+-----------------------------------+
| \$0318-\$0319\                    | Execution address of non-maskable |
| 792-793                           | interrupt service routine.\       |
|                                   | Default: \$FE47.                  |
+-----------------------------------+-----------------------------------+
| \$031A-\$031B\                    | Execution address of OPEN,        |
| 794-795                           | routine opening files.\           |
|                                   | Default: \$F34A.                  |
+-----------------------------------+-----------------------------------+
| \$031C-\$031D\                    | Execution address of CLOSE,       |
| 796-797                           | routine closing files.\           |
|                                   | Default: \$F291.                  |
+-----------------------------------+-----------------------------------+
| \$031E-\$031F\                    | Execution address of CHKIN,       |
| 798-799                           | routine defining file as default  |
|                                   | input.\                           |
|                                   | Default: \$F20E.                  |
+-----------------------------------+-----------------------------------+
| \$0320-\$0321\                    | Execution address of CHKOUT,      |
| 800-801                           | routine defining file as default  |
|                                   | output.\                          |
|                                   | Default: \$F250.                  |
+-----------------------------------+-----------------------------------+
| \$0322-\$0323\                    | Execution address of CLRCHN,      |
| 802-803                           | routine initializating            |
|                                   | input/output.\                    |
|                                   | Default: \$F333.                  |
+-----------------------------------+-----------------------------------+
| \$0324-\$0325\                    | Execution address of CHRIN, data  |
| 804-805                           | input routine, except for         |
|                                   | keyboard and RS232 input.\        |
|                                   | Default: \$F157.                  |
+-----------------------------------+-----------------------------------+
| \$0326-\$0327\                    | Execution address of CHROUT,      |
| 806-807                           | general purpose data output       |
|                                   | routine.\                         |
|                                   | Default: \$F1CA.                  |
+-----------------------------------+-----------------------------------+
| \$0328-\$0329\                    | Execution address of STOP,        |
| 808-809                           | routine checking the status of    |
|                                   | Stop key indicator, at memory     |
|                                   | address \$0091.\                  |
|                                   | Default: \$F6ED.                  |
+-----------------------------------+-----------------------------------+
| \$032A-\$032B\                    | Execution address of GETIN,       |
| 810-811                           | general purpose data input        |
|                                   | routine.\                         |
|                                   | Default: \$F13E.                  |
+-----------------------------------+-----------------------------------+
| \$032C-\$032D\                    | Execution address of CLALL,       |
| 812-813                           | routine initializing input/output |
|                                   | and clearing all file assignment  |
|                                   | tables.\                          |
|                                   | Default: \$F32F.                  |
+-----------------------------------+-----------------------------------+
| \$032E-\$032F\                    | Unused.\                          |
| 814-815                           | Default: \$FE66.                  |
+-----------------------------------+-----------------------------------+
| \$0330-\$0331\                    | Execution address of LOAD,        |
| 816-817                           | routine loading files.\           |
|                                   | Default: \$F4A5.                  |
+-----------------------------------+-----------------------------------+
| \$0332-\$0333\                    | Execution address of SAVE,        |
| 818-819                           | routine saving files.\            |
|                                   | Default: \$F5ED.                  |
+-----------------------------------+-----------------------------------+
| \$0334-\$033B\                    | Unused (8 bytes).                 |
| 820-827                           |                                   |
+-----------------------------------+-----------------------------------+
| \$033C-\$03FB\                    | Datasette buffer (192 bytes).     |
| 828-1019                          |                                   |
+-----------------------------------+-----------------------------------+
| \$03FC-\$03FF\                    | Unused (4 bytes).                 |
| 1020-1023                         |                                   |
|                                   | []{#page04}[]{#screen}            |
+-----------------------------------+-----------------------------------+
| **\$0400-\$07FF, 1024-2047\       |                                   |
| Default screen memory**           |                                   |
+-----------------------------------+-----------------------------------+
| \$0400-\$07E7\                    | Default area of screen memory     |
| 1024-2023                         | (1000 bytes).                     |
+-----------------------------------+-----------------------------------+
| \$07E8-\$07F7\                    | Unused (16 bytes).                |
| 2024-2039                         |                                   |
+-----------------------------------+-----------------------------------+
| \$07F8-\$07FF\                    | Default area for sprite pointers  |
| 2040-2047                         | (8 bytes).                        |
|                                   |                                   |
|                                   | []{#page08}[]{#basicram}          |
+-----------------------------------+-----------------------------------+
| **\$0800-\$9FFF, 2048-40959\      |                                   |
| BASIC area**                      |                                   |
+-----------------------------------+-----------------------------------+
| \$0800\                           | Unused. (Must contain a value of  |
| 2048                              | 0 so that the BASIC program can   |
|                                   | be RUN.)                          |
+-----------------------------------+-----------------------------------+
| \$0801-\$9FFF\                    | Default BASIC area (38911 bytes). |
| 2049-40959                        |                                   |
+-----------------------------------+-----------------------------------+
| \$8000-\$9FFF\                    | Optional cartridge ROM (8192      |
| 32768-40959                       | bytes).\                          |
|                                   | \$8000-\$8001, 32768-32769:       |
|                                   | Execution address of cold reset.\ |
|                                   | \$8002-\$8003, 32770-32771:       |
|                                   | Execution address of non-maskable |
|                                   | interrupt service routine.\       |
|                                   | \$8004-\$8008, 32772-32776:       |
|                                   | Cartridge signature. If contains  |
|                                   | the uppercase PETSCII string      |
|                                   | \"CBM80\"                         |
|                                   | (\$C3,\$C2,\$CD,\$38,\$30) then   |
|                                   | the routine vectors are accepted  |
|                                   | by the KERNAL.                    |
|                                   |                                   |
|                                   | []{#pagea0}[]{#basicrom}          |
+-----------------------------------+-----------------------------------+
| **\$A000-\$BFFF, 40960-49151\     |                                   |
| BASIC ROM**                       |                                   |
+-----------------------------------+-----------------------------------+
| \$A000-\$BFFF\                    | BASIC ROM or RAM area (8192       |
| 40960-49151                       | bytes); depends on the value of   |
|                                   | bits #0-#2 of the processor port  |
|                                   | at memory address \$0001:         |
|                                   |                                   |
|                                   | -   %x00, %x01 or %x10: RAM area. |
|                                   |                                   |
|                                   | -   %x11: BASIC ROM.              |
|                                   |                                   |
|                                   | []{#pagec0}[]{#upperram}          |
+-----------------------------------+-----------------------------------+
| **\$C000-\$CFFF, 49152-53247\     |                                   |
| Upper RAM area**                  |                                   |
+-----------------------------------+-----------------------------------+
| \$C000-\$CFFF\                    | Upper RAM area (4096 bytes).      |
| 49152-53247                       |                                   |
|                                   | []{#ioarea}                       |
+-----------------------------------+-----------------------------------+
| **\$D000-\$DFFF, 53248-57343\     |                                   |
| I/O Area**                        |                                   |
+-----------------------------------+-----------------------------------+
| \$D000-\$DFFF\                    | I/O Area (memory mapped chip      |
| 53248-57343                       | registers), Character ROM or RAM  |
|                                   | area (4096 bytes); depends on the |
|                                   | value of bits #0-#2 of the        |
|                                   | processor port at memory address  |
|                                   | \$0001:                           |
|                                   |                                   |
|                                   | -   %x00: RAM area.               |
|                                   |                                   |
|                                   | -   %0xx: Character ROM. (Except  |
|                                   |     for the value %000, see       |
|                                   |     above.)                       |
|                                   |                                   |
|                                   | -   %1xx: I/O Area. (Except for   |
|                                   |     the value %100, see above.)   |
|                                   |                                   |
|                                   | []{#charrom}                      |
+-----------------------------------+-----------------------------------+
| **\$D000-\$DFFF, 53248-57343\     |                                   |
| Character ROM**                   |                                   |
+-----------------------------------+-----------------------------------+
| \$D000-\$DFFF\                    | Character ROM, shape of           |
| 53248-57343                       | characters (4096 bytes).          |
+-----------------------------------+-----------------------------------+
| \$D000-\$D7FF\                    | Shape of characters in            |
| 53248-55295                       | uppercase/graphics character set  |
|                                   | (2048 bytes, 256 entries).        |
+-----------------------------------+-----------------------------------+
| \$D800-\$DFFF\                    | Shape of characters in            |
| 55295-57343                       | lowercase/uppercase character set |
|                                   | (2048 bytes, 256 entries).        |
|                                   |                                   |
|                                   | []{#paged0}[]{#vicchip}           |
+-----------------------------------+-----------------------------------+
| **\$D000-\$D3FF, 53248-54271\     |                                   |
| VIC-II; video display**           |                                   |
+-----------------------------------+-----------------------------------+
| \$D000\                           | Sprite #0 X-coordinate (only bits |
| 53248                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D001\                           | Sprite #0 Y-coordinate.           |
| 53249                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D002\                           | Sprite #1 X-coordinate (only bits |
| 53250                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D003\                           | Sprite #1 Y-coordinate.           |
| 53251                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D004\                           | Sprite #2 X-coordinate (only bits |
| 53252                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D005\                           | Sprite #2 Y-coordinate.           |
| 53253                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D006\                           | Sprite #3 X-coordinate (only bits |
| 53254                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D007\                           | Sprite #3 Y-coordinate.           |
| 53255                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D008\                           | Sprite #4 X-coordinate (only bits |
| 53256                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D009\                           | Sprite #4 Y-coordinate.           |
| 53257                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D00A\                           | Sprite #5 X-coordinate (only bits |
| 53258                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D00B\                           | Sprite #5 Y-coordinate.           |
| 53259                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D00C\                           | Sprite #6 X-coordinate (only bits |
| 53260                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D00D\                           | Sprite #6 Y-coordinate.           |
| 53261                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D00E\                           | Sprite #7 X-coordinate (only bits |
| 53262                             | #0-#7).                           |
+-----------------------------------+-----------------------------------+
| \$D00F\                           | Sprite #7 Y-coordinate.           |
| 53263                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D010\                           | Sprite #0-#7 X-coordinates (bit   |
| 53264                             | #8). Bits:                        |
|                                   |                                   |
|                                   | -   Bit #x: Sprite #x             |
|                                   |     X-coordinate bit #8.          |
+-----------------------------------+-----------------------------------+
| \$D011\                           | Screen control register #1. Bits: |
| 53265                             |                                   |
|                                   | -   Bits #0-#2: Vertical raster   |
|                                   |     scroll.                       |
|                                   |                                   |
|                                   | -   Bit #3: Screen height; 0 = 24 |
|                                   |     rows; 1 = 25 rows.            |
|                                   |                                   |
|                                   | -   Bit #4: 0 = Screen off,       |
|                                   |     complete screen is covered by |
|                                   |     border; 1 = Screen on, normal |
|                                   |     screen contents are visible.  |
|                                   |                                   |
|                                   | -   Bit #5: 0 = Text mode; 1 =    |
|                                   |     Bitmap mode.                  |
|                                   |                                   |
|                                   | -   Bit #6: 1 = Extended          |
|                                   |     background mode on.           |
|                                   |                                   |
|                                   | -   Bit #7: Read: Current raster  |
|                                   |     line (bit #8).\               |
|                                   |     Write: Raster line to         |
|                                   |     generate interrupt at (bit    |
|                                   |     #8).                          |
|                                   |                                   |
|                                   | Default: \$1B, %00011011.         |
+-----------------------------------+-----------------------------------+
| \$D012\                           | Read: Current raster line (bits   |
| 53266                             | #0-#7).\                          |
|                                   | Write: Raster line to generate    |
|                                   | interrupt at (bits #0-#7).        |
+-----------------------------------+-----------------------------------+
| \$D013\                           | Light pen X-coordinate (bits      |
| 53267                             | #1-#8).\                          |
|                                   | Read-only.                        |
+-----------------------------------+-----------------------------------+
| \$D014\                           | Light pen Y-coordinate.\          |
| 53268                             | Read-only.                        |
+-----------------------------------+-----------------------------------+
| \$D015\                           | Sprite enable register. Bits:     |
| 53269                             |                                   |
|                                   | -   Bit #x: 1 = Sprite #x is      |
|                                   |     enabled, drawn onto the       |
|                                   |     screen.                       |
+-----------------------------------+-----------------------------------+
| \$D016\                           | Screen control register #2. Bits: |
| 53270                             |                                   |
|                                   | -   Bits #0-#2: Horizontal raster |
|                                   |     scroll.                       |
|                                   |                                   |
|                                   | -   Bit #3: Screen width; 0 = 38  |
|                                   |     columns; 1 = 40 columns.      |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Multicolor mode   |
|                                   |     on.                           |
|                                   |                                   |
|                                   | Default: \$C8, %11001000.         |
+-----------------------------------+-----------------------------------+
| \$D017\                           | Sprite double height register.    |
| 53271                             | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #x: 1 = Sprite #x is      |
|                                   |     stretched to double height.   |
+-----------------------------------+-----------------------------------+
| \$D018\                           | Memory setup register. Bits:      |
| 53272                             |                                   |
|                                   | -   Bits #1-#3: In text mode,     |
|                                   |     pointer to character memory   |
|                                   |     (bits #11-#13), relative to   |
|                                   |     VIC bank, memory address      |
|                                   |     \$DD00. Values:               |
|                                   |                                   |
|                                   |     -   %000, 0: \$0000-\$07FF,   |
|                                   |         0-2047.                   |
|                                   |                                   |
|                                   |     -   %001, 1: \$0800-\$0FFF,   |
|                                   |         2048-4095.                |
|                                   |                                   |
|                                   |     -   %010, 2: \$1000-\$17FF,   |
|                                   |         4096-6143.                |
|                                   |                                   |
|                                   |     -   %011, 3: \$1800-\$1FFF,   |
|                                   |         6144-8191.                |
|                                   |                                   |
|                                   |     -   %100, 4: \$2000-\$27FF,   |
|                                   |         8192-10239.               |
|                                   |                                   |
|                                   |     -   %101, 5: \$2800-\$2FFF,   |
|                                   |         10240-12287.              |
|                                   |                                   |
|                                   |     -   %110, 6: \$3000-\$37FF,   |
|                                   |         12288-14335.              |
|                                   |                                   |
|                                   |     -   %111, 7: \$3800-\$3FFF,   |
|                                   |         14336-16383.              |
|                                   |                                   |
|                                   |     Values %010 and %011 in VIC   |
|                                   |     bank #0 and #2 select         |
|                                   |     Character ROM instead.\       |
|                                   |     In bitmap mode, pointer to    |
|                                   |     bitmap memory (bit #13),      |
|                                   |     relative to VIC bank, memory  |
|                                   |     address \$DD00. Values:       |
|                                   |                                   |
|                                   |     -   %0xx, 0: \$0000-\$1FFF,   |
|                                   |         0-8191.                   |
|                                   |                                   |
|                                   |     -   %1xx, 4: \$2000-\$3FFF,   |
|                                   |         8192-16383.               |
|                                   |                                   |
|                                   | -   Bits #4-#7: Pointer to screen |
|                                   |     memory (bits #10-#13),        |
|                                   |     relative to VIC bank, memory  |
|                                   |     address \$DD00. Values:       |
|                                   |                                   |
|                                   |     -   %0000, 0: \$0000-\$03FF,  |
|                                   |         0-1023.                   |
|                                   |                                   |
|                                   |     -   %0001, 1: \$0400-\$07FF,  |
|                                   |         1024-2047.                |
|                                   |                                   |
|                                   |     -   %0010, 2: \$0800-\$0BFF,  |
|                                   |         2048-3071.                |
|                                   |                                   |
|                                   |     -   %0011, 3: \$0C00-\$0FFF,  |
|                                   |         3072-4095.                |
|                                   |                                   |
|                                   |     -   %0100, 4: \$1000-\$13FF,  |
|                                   |         4096-5119.                |
|                                   |                                   |
|                                   |     -   %0101, 5: \$1400-\$17FF,  |
|                                   |         5120-6143.                |
|                                   |                                   |
|                                   |     -   %0110, 6: \$1800-\$1BFF,  |
|                                   |         6144-7167.                |
|                                   |                                   |
|                                   |     -   %0111, 7: \$1C00-\$1FFF,  |
|                                   |         7168-8191.                |
|                                   |                                   |
|                                   |     -   %1000, 8: \$2000-\$23FF,  |
|                                   |         8192-9215.                |
|                                   |                                   |
|                                   |     -   %1001, 9: \$2400-\$27FF,  |
|                                   |         9216-10239.               |
|                                   |                                   |
|                                   |     -   %1010, 10: \$2800-\$2BFF, |
|                                   |         10240-11263.              |
|                                   |                                   |
|                                   |     -   %1011, 11: \$2C00-\$2FFF, |
|                                   |         11264-12287.              |
|                                   |                                   |
|                                   |     -   %1100, 12: \$3000-\$33FF, |
|                                   |         12288-13311.              |
|                                   |                                   |
|                                   |     -   %1101, 13: \$3400-\$37FF, |
|                                   |         13312-14335.              |
|                                   |                                   |
|                                   |     -   %1110, 14: \$3800-\$3BFF, |
|                                   |         14336-15359.              |
|                                   |                                   |
|                                   |     -   %1111, 15: \$3C00-\$3FFF, |
|                                   |         15360-16383.              |
+-----------------------------------+-----------------------------------+
| \$D019\                           | Interrupt status register. Read   |
| 53273                             | bits:                             |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Current raster    |
|                                   |     line is equal to the raster   |
|                                   |     line to generate interrupt    |
|                                   |     at.                           |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Sprite-background |
|                                   |     collision occurred.           |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Sprite-sprite     |
|                                   |     collision occurred.           |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Light pen signal  |
|                                   |     arrived.                      |
|                                   |                                   |
|                                   | -   Bit #7: 1 = An event (or more |
|                                   |     events), that may generate an |
|                                   |     interrupt, occurred and it    |
|                                   |     has not been (not all of them |
|                                   |     have been) acknowledged yet.  |
|                                   |                                   |
|                                   | Write bits:                       |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Acknowledge       |
|                                   |     raster interrupt.             |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Acknowledge       |
|                                   |     sprite-background collision   |
|                                   |     interrupt.                    |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Acknowledge       |
|                                   |     sprite-sprite collision       |
|                                   |     interrupt.                    |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Acknowledge light |
|                                   |     pen interrupt.                |
+-----------------------------------+-----------------------------------+
| \$D01A\                           | Interrupt control register. Bits: |
| 53274                             |                                   |
|                                   | -   Bit #0: 1 = Raster interrupt  |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Sprite-background |
|                                   |     collision interrupt enabled.  |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Sprite-sprite     |
|                                   |     collision interrupt enabled.  |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Light pen         |
|                                   |     interrupt enabled.            |
+-----------------------------------+-----------------------------------+
| \$D01B\                           | Sprite priority register. Bits:   |
| 53275                             |                                   |
|                                   | -   Bit #x: 0 = Sprite #x is      |
|                                   |     drawn in front of screen      |
|                                   |     contents; 1 = Sprite #x is    |
|                                   |     behind screen contents.       |
+-----------------------------------+-----------------------------------+
| \$D01C\                           | Sprite multicolor mode register.  |
| 53276                             | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #x: 0 = Sprite #x is      |
|                                   |     single color; 1 = Sprite #x   |
|                                   |     is multicolor.                |
+-----------------------------------+-----------------------------------+
| \$D01D\                           | Sprite double width register.     |
| 53277                             | Bits:                             |
|                                   |                                   |
|                                   | -   Bit #x: 1 = Sprite #x is      |
|                                   |     stretched to double width.    |
+-----------------------------------+-----------------------------------+
| \$D01E\                           | Sprite-sprite collision register. |
| 53278                             | Read bits:                        |
|                                   |                                   |
|                                   | -   Bit #x: 1 = Sprite #x         |
|                                   |     collided with another sprite. |
|                                   |                                   |
|                                   | Write: Enable further detection   |
|                                   | of sprite-sprite collisions.      |
+-----------------------------------+-----------------------------------+
| \$D01F\                           | Sprite-background collision       |
| 53279                             | register. Read bits:              |
|                                   |                                   |
|                                   | -   Bit #x: 1 = Sprite #x         |
|                                   |     collided with background.     |
|                                   |                                   |
|                                   | Write: Enable further detection   |
|                                   | of sprite-background collisions.  |
+-----------------------------------+-----------------------------------+
| \$D020\                           | Border color (only bits #0-#3).   |
| 53280                             |                                   |
+-----------------------------------+-----------------------------------+
| \$D021\                           | Background color (only bits       |
| 53281                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D022\                           | Extra background color #1 (only   |
| 53282                             | bits #0-#3).                      |
+-----------------------------------+-----------------------------------+
| \$D023\                           | Extra background color #2 (only   |
| 53283                             | bits #0-#3).                      |
+-----------------------------------+-----------------------------------+
| \$D024\                           | Extra background color #3 (only   |
| 53284                             | bits #0-#3).                      |
+-----------------------------------+-----------------------------------+
| \$D025\                           | Sprite extra color #1 (only bits  |
| 53285                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D026\                           | Sprite extra color #2 (only bits  |
| 53286                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D027\                           | Sprite #0 color (only bits        |
| 53287                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D028\                           | Sprite #1 color (only bits        |
| 53288                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D029\                           | Sprite #2 color (only bits        |
| 53289                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D02A\                           | Sprite #3 color (only bits        |
| 53290                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D02B\                           | Sprite #4 color (only bits        |
| 53291                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D02C\                           | Sprite #5 color (only bits        |
| 53292                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D02D\                           | Sprite #6 color (only bits        |
| 53293                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D02E\                           | Sprite #7 color (only bits        |
| 53294                             | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$D02F-\$D03F\                    | Unusable (17 bytes).              |
| 53295-53311                       |                                   |
+-----------------------------------+-----------------------------------+
| \$D040-\$D3FF\                    | VIC-II register images (repeated  |
| 53312-54271                       | every \$40, 64 bytes).            |
|                                   |                                   |
|                                   | []{#paged4}[]{#sidchip}           |
+-----------------------------------+-----------------------------------+
| **\$D400-\$D7FF, 54272-55295\     |                                   |
| SID; audio**                      |                                   |
+-----------------------------------+-----------------------------------+
| \$D400-\$D401\                    | Voice #1 frequency.\              |
| 54272-54273                       | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D402-\$D403\                    | Voice #1 pulse width.\            |
| 54274-54275                       | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D404\                           | Voice #1 control register. Bits:  |
| 54276                             |                                   |
|                                   | -   Bit #0: 0 = Voice off,        |
|                                   |     Release cycle; 1 = Voice on,  |
|                                   |     Attack-Decay-Sustain cycle.   |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Synchronization   |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Ring modulation   |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Disable voice,    |
|                                   |     reset noise generator.        |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Triangle waveform |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #5: 1 = Saw waveform      |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #6: 1 = Rectangle         |
|                                   |     waveform enabled.             |
|                                   |                                   |
|                                   | -   Bit #7: 1 = Noise enabled.    |
|                                   |                                   |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D405\                           | Voice #1 Attack and Decay length. |
| 54277                             | Bits:                             |
|                                   |                                   |
|                                   | -   Bits #0-#3: Decay length.     |
|                                   |     Values:                       |
|                                   |                                   |
|                                   |     -   %0000, 0: 6 ms.           |
|                                   |                                   |
|                                   |     -   %0001, 1: 24 ms.          |
|                                   |                                   |
|                                   |     -   %0010, 2: 48 ms.          |
|                                   |                                   |
|                                   |     -   %0011, 3: 72 ms.          |
|                                   |                                   |
|                                   |     -   %0100, 4: 114 ms.         |
|                                   |                                   |
|                                   |     -   %0101, 5: 168 ms.         |
|                                   |                                   |
|                                   |     -   %0110, 6: 204 ms.         |
|                                   |                                   |
|                                   |     -   %0111, 7: 240 ms.         |
|                                   |                                   |
|                                   |     -   %1000, 8: 300 ms.         |
|                                   |                                   |
|                                   |     -   %1001, 9: 750 ms.         |
|                                   |                                   |
|                                   |     -   %1010, 10: 1.5 s.         |
|                                   |                                   |
|                                   |     -   %1011, 11: 2.4 s.         |
|                                   |                                   |
|                                   |     -   %1100, 12: 3 s.           |
|                                   |                                   |
|                                   |     -   %1101, 13: 9 s.           |
|                                   |                                   |
|                                   |     -   %1110, 14: 15 s.          |
|                                   |                                   |
|                                   |     -   %1111, 15: 24 s.          |
|                                   |                                   |
|                                   | -   Bits #4-#7: Attack length.    |
|                                   |     Values:                       |
|                                   |                                   |
|                                   |     -   %0000, 0: 2 ms.           |
|                                   |                                   |
|                                   |     -   %0001, 1: 8 ms.           |
|                                   |                                   |
|                                   |     -   %0010, 2: 16 ms.          |
|                                   |                                   |
|                                   |     -   %0011, 3: 24 ms.          |
|                                   |                                   |
|                                   |     -   %0100, 4: 38 ms.          |
|                                   |                                   |
|                                   |     -   %0101, 5: 56 ms.          |
|                                   |                                   |
|                                   |     -   %0110, 6: 68 ms.          |
|                                   |                                   |
|                                   |     -   %0111, 7: 80 ms.          |
|                                   |                                   |
|                                   |     -   %1000, 8: 100 ms.         |
|                                   |                                   |
|                                   |     -   %1001, 9: 250 ms.         |
|                                   |                                   |
|                                   |     -   %1010, 10: 500 ms.        |
|                                   |                                   |
|                                   |     -   %1011, 11: 800 ms.        |
|                                   |                                   |
|                                   |     -   %1100, 12: 1 s.           |
|                                   |                                   |
|                                   |     -   %1101, 13: 3 s.           |
|                                   |                                   |
|                                   |     -   %1110, 14: 5 s.           |
|                                   |                                   |
|                                   |     -   %1111, 15: 8 s.           |
|                                   |                                   |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D406\                           | Voice #1 Sustain volume and       |
| 54278                             | Release length. Bits:             |
|                                   |                                   |
|                                   | -   Bits #0-#3: Release length.   |
|                                   |     Values:                       |
|                                   |                                   |
|                                   |     -   %0000, 0: 6 ms.           |
|                                   |                                   |
|                                   |     -   %0001, 1: 24 ms.          |
|                                   |                                   |
|                                   |     -   %0010, 2: 48 ms.          |
|                                   |                                   |
|                                   |     -   %0011, 3: 72 ms.          |
|                                   |                                   |
|                                   |     -   %0100, 4: 114 ms.         |
|                                   |                                   |
|                                   |     -   %0101, 5: 168 ms.         |
|                                   |                                   |
|                                   |     -   %0110, 6: 204 ms.         |
|                                   |                                   |
|                                   |     -   %0111, 7: 240 ms.         |
|                                   |                                   |
|                                   |     -   %1000, 8: 300 ms.         |
|                                   |                                   |
|                                   |     -   %1001, 9: 750 ms.         |
|                                   |                                   |
|                                   |     -   %1010, 10: 1.5 s.         |
|                                   |                                   |
|                                   |     -   %1011, 11: 2.4 s.         |
|                                   |                                   |
|                                   |     -   %1100, 12: 3 s.           |
|                                   |                                   |
|                                   |     -   %1101, 13: 9 s.           |
|                                   |                                   |
|                                   |     -   %1110, 14: 15 s.          |
|                                   |                                   |
|                                   |     -   %1111, 15: 24 s.          |
|                                   |                                   |
|                                   | -   Bits #4-#7: Sustain volume.   |
|                                   |                                   |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D407-\$D408\                    | Voice #2 frequency.\              |
| 54279-54280                       | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D409-\$D40A\                    | Voice #2 pulse width.\            |
| 54281-54282                       | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D40B\                           | Voice #2 control register.\       |
| 54283                             | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D40C\                           | Voice #2 Attack and Decay         |
| 54284                             | length.\                          |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D40D\                           | Voice #2 Sustain volume and       |
| 54285                             | Release length.\                  |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D40E-\$D40F\                    | Voice #3 frequency.\              |
| 54286-54287                       | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D410-\$D411\                    | Voice #3 pulse width.\            |
| 54288-54289                       | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D412\                           | Voice #3 control register.\       |
| 54290                             | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D413\                           | Voice #3 Attack and Decay         |
| 54291                             | length.\                          |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D414\                           | Voice #3 Sustain volume and       |
| 54292                             | Release length.\                  |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D415\                           | Filter cut off frequency (bits    |
| 54293                             | #0-#2).\                          |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D416\                           | Filter cut off frequency (bits    |
| 54294                             | #3-#10).\                         |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D417\                           | Filter control. Bits:             |
| 54295                             |                                   |
|                                   | -   Bit #0: 1 = Voice #1          |
|                                   |     filtered.                     |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Voice #2          |
|                                   |     filtered.                     |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Voice #3          |
|                                   |     filtered.                     |
|                                   |                                   |
|                                   | -   Bit #3: 1 = External voice    |
|                                   |     filtered.                     |
|                                   |                                   |
|                                   | -   Bits #4-#7: Filter resonance. |
|                                   |                                   |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D418\                           | Volume and filter modes. Bits:    |
| 54296                             |                                   |
|                                   | -   Bits #0-#3: Volume.           |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Low pass filter   |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #5: 1 = Band pass filter  |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #6: 1 = High pass filter  |
|                                   |     enabled.                      |
|                                   |                                   |
|                                   | -   Bit #7: 1 = Voice #3          |
|                                   |     disabled.                     |
|                                   |                                   |
|                                   | Write-only.                       |
+-----------------------------------+-----------------------------------+
| \$D419\                           | X value of paddle selected at     |
| 54297                             | memory address \$DC00. (Updates   |
|                                   | at every 512 system cycles.)\     |
|                                   | Read-only.                        |
+-----------------------------------+-----------------------------------+
| \$D41A\                           | Y value of paddle selected at     |
| 54298                             | memory address \$DC00. (Updates   |
|                                   | at every 512 system cycles.)\     |
|                                   | Read-only.                        |
+-----------------------------------+-----------------------------------+
| \$D41B\                           | Voice #3 waveform output.\        |
| 54299                             | Read-only.                        |
+-----------------------------------+-----------------------------------+
| \$D41C\                           | Voice #3 ADSR output.\            |
| 54300                             | Read-only.                        |
+-----------------------------------+-----------------------------------+
| \$D41D-\$D41F\                    | Unusable (3 bytes).               |
| 54301-54303                       |                                   |
+-----------------------------------+-----------------------------------+
| \$D420-\$D7FF\                    | SID register images (repeated     |
| 54304-55295                       | every \$20, 32 bytes).            |
|                                   |                                   |
|                                   | []{#paged8}[]{#colorram}          |
+-----------------------------------+-----------------------------------+
| **\$D800-\$DBFF, 55296-56319\     |                                   |
| Color RAM**                       |                                   |
+-----------------------------------+-----------------------------------+
| \$D800-\$DBE7\                    | Color RAM (1000 bytes, only bits  |
| 55296-56295                       | #0-#3).                           |
+-----------------------------------+-----------------------------------+
| \$DBE8-\$DBFF\                    | Unused (24 bytes, only bits       |
| 56296-56319                       | #0-#3).                           |
|                                   |                                   |
|                                   | []{#pagedc}[]{#cia1chip}          |
+-----------------------------------+-----------------------------------+
| **\$DC00-\$DCFF, 56320-56575\     |                                   |
| CIA#1; inputs (keyboard,          |                                   |
| joystick, mouse), datasette, IRQ  |                                   |
| control**                         |                                   |
+-----------------------------------+-----------------------------------+
| \$DC00\                           | Port A, keyboard matrix columns   |
| 56320                             | and joystick #2. Read bits:       |
|                                   |                                   |
|                                   | -   Bit #0: 0 = Port 2 joystick   |
|                                   |     up pressed.                   |
|                                   |                                   |
|                                   | -   Bit #1: 0 = Port 2 joystick   |
|                                   |     down pressed.                 |
|                                   |                                   |
|                                   | -   Bit #2: 0 = Port 2 joystick   |
|                                   |     left pressed.                 |
|                                   |                                   |
|                                   | -   Bit #3: 0 = Port 2 joystick   |
|                                   |     right pressed.                |
|                                   |                                   |
|                                   | -   Bit #4: 0 = Port 2 joystick   |
|                                   |     fire pressed.                 |
|                                   |                                   |
|                                   | Write bits:                       |
|                                   |                                   |
|                                   | -   Bit #x: 0 = Select keyboard   |
|                                   |     matrix column #x.             |
|                                   |                                   |
|                                   | -   Bits #6-#7: Paddle selection; |
|                                   |     %01 = Paddle #1; %10 = Paddle |
|                                   |     #2.                           |
+-----------------------------------+-----------------------------------+
| \$DC01\                           | Port B, keyboard matrix rows and  |
| 56321                             | joystick #1. Bits:                |
|                                   |                                   |
|                                   | -   Bit #x: 0 = A key is          |
|                                   |     currently being pressed in    |
|                                   |     keyboard matrix row #x, in    |
|                                   |     the column selected at memory |
|                                   |     address \$DC00.               |
|                                   |                                   |
|                                   | -   Bit #0: 0 = Port 1 joystick   |
|                                   |     up pressed.                   |
|                                   |                                   |
|                                   | -   Bit #1: 0 = Port 1 joystick   |
|                                   |     down pressed.                 |
|                                   |                                   |
|                                   | -   Bit #2: 0 = Port 1 joystick   |
|                                   |     left pressed.                 |
|                                   |                                   |
|                                   | -   Bit #3: 0 = Port 1 joystick   |
|                                   |     right pressed.                |
|                                   |                                   |
|                                   | -   Bit #4: 0 = Port 1 joystick   |
|                                   |     fire pressed.                 |
+-----------------------------------+-----------------------------------+
| \$DC02\                           | Port A data direction register.   |
| 56322                             |                                   |
|                                   | -   Bit #x: 0 = Bit #x in port A  |
|                                   |     can only be read; 1 = Bit #x  |
|                                   |     in port A can be read and     |
|                                   |     written.                      |
+-----------------------------------+-----------------------------------+
| \$DC03\                           | Port B data direction register.   |
| 56323                             |                                   |
|                                   | -   Bit #x: 0 = Bit #x in port B  |
|                                   |     can only be read; 1 = Bit #x  |
|                                   |     in port B can be read and     |
|                                   |     written.                      |
+-----------------------------------+-----------------------------------+
| \$DC04-\$DC05\                    | Timer A. Read: Current timer      |
| 56324-56325                       | value.\                           |
|                                   | Write: Set timer start value.     |
+-----------------------------------+-----------------------------------+
| \$DC06-\$DC07\                    | Timer B. Read: Current timer      |
| 56326-56327                       | value.\                           |
|                                   | Write: Set timer start value.     |
+-----------------------------------+-----------------------------------+
| \$DC08\                           | Time of Day, tenth seconds (in    |
| 56328                             | BCD). Values: \$00-\$09. Read:    |
|                                   | Current TOD value.\               |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DC09\                           | Time of Day, seconds (in BCD).    |
| 56329                             | Values: \$00-\$59. Read: Current  |
|                                   | TOD value.\                       |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DC0A\                           | Time of Day, minutes (in BCD).    |
| 56330                             | Values: \$00-\$59. Read: Current  |
|                                   | TOD value.\                       |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DC0B\                           | Time of Day, hours (in BCD). Read |
| 56331                             | bits:                             |
|                                   |                                   |
|                                   | -   Bits #0-#5: Hours.            |
|                                   |                                   |
|                                   | -   Bit #7: 0 = AM; 1 = PM.       |
|                                   |                                   |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DC0C\                           | Serial shift register. (Bits are  |
| 56332                             | read and written upon every       |
|                                   | positive edge of the CNT pin.)    |
+-----------------------------------+-----------------------------------+
| \$DC0D\                           | Interrupt control and status      |
| 56333                             | register. Read bits:              |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Timer A underflow |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Timer B underflow |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #2: 1 = TOD is equal to   |
|                                   |     alarm time.                   |
|                                   |                                   |
|                                   | -   Bit #3: 1 = A complete byte   |
|                                   |     has been received into or     |
|                                   |     sent from serial shift        |
|                                   |     register.                     |
|                                   |                                   |
|                                   | -   Bit #4: Signal level on FLAG  |
|                                   |     pin, datasette input.         |
|                                   |                                   |
|                                   | -   Bit #7: An interrupt has been |
|                                   |     generated.                    |
|                                   |                                   |
|                                   | Write bits:                       |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Enable interrupts |
|                                   |     generated by timer A          |
|                                   |     underflow.                    |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Enable interrupts |
|                                   |     generated by timer B          |
|                                   |     underflow.                    |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Enable TOD alarm  |
|                                   |     interrupt.                    |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Enable interrupts |
|                                   |     generated by a byte having    |
|                                   |     been received/sent via serial |
|                                   |     shift register.               |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Enable interrupts |
|                                   |     generated by positive edge on |
|                                   |     FLAG pin.                     |
|                                   |                                   |
|                                   | -   Bit #7: Fill bit; bits #0-#6, |
|                                   |     that are set to 1, get their  |
|                                   |     values from this bit; bits    |
|                                   |     #0-#6, that are set to 0, are |
|                                   |     left unchanged.               |
+-----------------------------------+-----------------------------------+
| \$DC0E\                           | Timer A control register. Bits:   |
| 56334                             |                                   |
|                                   | -   Bit #0: 0 = Stop timer; 1 =   |
|                                   |     Start timer.                  |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Indicate timer    |
|                                   |     underflow on port B bit #6.   |
|                                   |                                   |
|                                   | -   Bit #2: 0 = Upon timer        |
|                                   |     underflow, invert port B bit  |
|                                   |     #6; 1 = upon timer underflow, |
|                                   |     generate a positive edge on   |
|                                   |     port B bit #6 for 1 system    |
|                                   |     cycle.                        |
|                                   |                                   |
|                                   | -   Bit #3: 0 = Timer restarts    |
|                                   |     upon underflow; 1 = Timer     |
|                                   |     stops upon underflow.         |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Load start value  |
|                                   |     into timer.                   |
|                                   |                                   |
|                                   | -   Bit #5: 0 = Timer counts      |
|                                   |     system cycles; 1 = Timer      |
|                                   |     counts positive edges on CNT  |
|                                   |     pin.                          |
|                                   |                                   |
|                                   | -   Bit #6: Serial shift register |
|                                   |     direction; 0 = Input, read; 1 |
|                                   |     = Output, write.              |
|                                   |                                   |
|                                   | -   Bit #7: TOD speed; 0 = 60 Hz; |
|                                   |     1 = 50 Hz.                    |
+-----------------------------------+-----------------------------------+
| \$DC0F\                           | Timer B control register. Bits:   |
| 56335                             |                                   |
|                                   | -   Bit #0: 0 = Stop timer; 1 =   |
|                                   |     Start timer.                  |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Indicate timer    |
|                                   |     underflow on port B bit #7.   |
|                                   |                                   |
|                                   | -   Bit #2: 0 = Upon timer        |
|                                   |     underflow, invert port B bit  |
|                                   |     #7; 1 = upon timer underflow, |
|                                   |     generate a positive edge on   |
|                                   |     port B bit #7 for 1 system    |
|                                   |     cycle.                        |
|                                   |                                   |
|                                   | -   Bit #3: 0 = Timer restarts    |
|                                   |     upon underflow; 1 = Timer     |
|                                   |     stops upon underflow.         |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Load start value  |
|                                   |     into timer.                   |
|                                   |                                   |
|                                   | -   Bits #5-#6: %00 = Timer       |
|                                   |     counts system cycles; %01 =   |
|                                   |     Timer counts positive edges   |
|                                   |     on CNT pin; %10 = Timer       |
|                                   |     counts underflows of timer A; |
|                                   |     %11 = Timer counts underflows |
|                                   |     of timer A occurring along    |
|                                   |     with a positive edge on CNT   |
|                                   |     pin.                          |
|                                   |                                   |
|                                   | -   Bit #7: 0 = Writing into TOD  |
|                                   |     registers sets TOD; 1 =       |
|                                   |     Writing into TOD registers    |
|                                   |     sets alarm time.              |
+-----------------------------------+-----------------------------------+
| \$DC10-\$DCFF\                    | CIA#1 register images (repeated   |
| 56336-56575                       | every \$10, 16 bytes).            |
|                                   |                                   |
|                                   | []{#pagedd}[]{#cia2chip}          |
+-----------------------------------+-----------------------------------+
| **\$DD00-\$DDFF, 56576-56831\     |                                   |
| CIA#2; serial bus, RS232, NMI     |                                   |
| control**                         |                                   |
+-----------------------------------+-----------------------------------+
| \$DD00\                           | Port A, serial bus access. Bits:  |
| 56576                             |                                   |
|                                   | -   Bits #0-#1: VIC bank. Values: |
|                                   |                                   |
|                                   |     -   %00, 0: Bank #3,          |
|                                   |         \$C000-\$FFFF,            |
|                                   |         49152-65535.              |
|                                   |                                   |
|                                   |     -   %01, 1: Bank #2,          |
|                                   |         \$8000-\$BFFF,            |
|                                   |         32768-49151.              |
|                                   |                                   |
|                                   |     -   %10, 2: Bank #1,          |
|                                   |         \$4000-\$7FFF,            |
|                                   |         16384-32767.              |
|                                   |                                   |
|                                   |     -   %11, 3: Bank #0,          |
|                                   |         \$0000-\$3FFF, 0-16383.   |
|                                   |                                   |
|                                   | -   Bit #2: RS232 TXD line,       |
|                                   |     output bit.                   |
|                                   |                                   |
|                                   | -   Bit #3: Serial bus ATN OUT; 0 |
|                                   |     = High; 1 = Low.              |
|                                   |                                   |
|                                   | -   Bit #4: Serial bus CLOCK OUT; |
|                                   |     0 = High; 1 = Low.            |
|                                   |                                   |
|                                   | -   Bit #5: Serial bus DATA OUT;  |
|                                   |     0 = High; 1 = Low.            |
|                                   |                                   |
|                                   | -   Bit #6: Serial bus CLOCK IN;  |
|                                   |     0 = Low; 1 = High.            |
|                                   |                                   |
|                                   | -   Bit #7: Serial bus DATA IN; 0 |
|                                   |     = Low; 1 = High.              |
+-----------------------------------+-----------------------------------+
| \$DD01\                           | Port B, RS232 access. Read bits:  |
| 56577                             |                                   |
|                                   | -   Bit #0: RS232 RXD line, input |
|                                   |     bit.                          |
|                                   |                                   |
|                                   | -   Bit #3: RS232 RI line.        |
|                                   |                                   |
|                                   | -   Bit #4: RS232 DCD line.       |
|                                   |                                   |
|                                   | -   Bit #5: User port H pin.      |
|                                   |                                   |
|                                   | -   Bit #6: RS232 CTS line; 1 =   |
|                                   |     Sender is ready to send.      |
|                                   |                                   |
|                                   | -   Bit #7: RS232 DSR line; 1 =   |
|                                   |     Receiver is ready to receive. |
|                                   |                                   |
|                                   | Write bits:                       |
|                                   |                                   |
|                                   | -   Bit #1: RS232 RTS line. 1 =   |
|                                   |     Sender is ready to send.      |
|                                   |                                   |
|                                   | -   Bit #2: RS232 DTR line. 1 =   |
|                                   |     Receiver is ready to receive. |
|                                   |                                   |
|                                   | -   Bit #3: RS232 RI line.        |
|                                   |                                   |
|                                   | -   Bit #4: RS232 DCD line.       |
|                                   |                                   |
|                                   | -   Bit #5: User port H pin.      |
+-----------------------------------+-----------------------------------+
| \$DD02\                           | Port A data direction register.   |
| 56578                             |                                   |
|                                   | -   Bit #x: 0 = Bit #x in port A  |
|                                   |     can only be read; 1 = Bit #x  |
|                                   |     in port A can be read and     |
|                                   |     written.                      |
+-----------------------------------+-----------------------------------+
| \$DD03\                           | Port B data direction register.   |
| 56579                             |                                   |
|                                   | -   Bit #x: 0 = Bit #x in port B  |
|                                   |     can only be read; 1 = Bit #x  |
|                                   |     in port B can be read and     |
|                                   |     written.                      |
+-----------------------------------+-----------------------------------+
| \$DD04-\$DD05\                    | Timer A. Read: Current timer      |
| 56580-56581                       | value.\                           |
|                                   | Write: Set timer start value.     |
+-----------------------------------+-----------------------------------+
| \$DD06-\$DD07\                    | Timer B. Read: Current timer      |
| 56582-56583                       | value.\                           |
|                                   | Write: Set timer start value.     |
+-----------------------------------+-----------------------------------+
| \$DD08\                           | Time of Day, tenth seconds (in    |
| 56584                             | BCD). Values: \$00-\$09. Read:    |
|                                   | Current TOD value.\               |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DD09\                           | Time of Day, seconds (in BCD).    |
| 56585                             | Values: \$00-\$59. Read: Current  |
|                                   | TOD value.\                       |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DD0A\                           | Time of Day, minutes (in BCD).    |
| 56586                             | Values: \$00-\$59. Read: Current  |
|                                   | TOD value.\                       |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DD0B\                           | Time of Day, hours (in BCD). Read |
| 56587                             | bits:                             |
|                                   |                                   |
|                                   | -   Bits #0-#5: Hours.            |
|                                   |                                   |
|                                   | -   Bit #7: 0 = AM; 1 = PM.       |
|                                   |                                   |
|                                   | Write: Set TOD or alarm time.     |
+-----------------------------------+-----------------------------------+
| \$DD0C\                           | Serial shift register. (Bits are  |
| 56588                             | read and written upon every       |
|                                   | positive edge of the CNT pin.)    |
+-----------------------------------+-----------------------------------+
| \$DD0D\                           | Interrupt control and status      |
| 56589                             | register. Read bits:              |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Timer A underflow |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Timer B underflow |
|                                   |     occurred.                     |
|                                   |                                   |
|                                   | -   Bit #2: 1 = TOD is equal to   |
|                                   |     alarm time.                   |
|                                   |                                   |
|                                   | -   Bit #3: 1 = A complete byte   |
|                                   |     has been received into or     |
|                                   |     sent from serial shift        |
|                                   |     register.                     |
|                                   |                                   |
|                                   | -   Bit #4: Signal level on FLAG  |
|                                   |     pin.                          |
|                                   |                                   |
|                                   | -   Bit #7: A non-maskable        |
|                                   |     interrupt has been generated. |
|                                   |                                   |
|                                   | Write bits:                       |
|                                   |                                   |
|                                   | -   Bit #0: 1 = Enable            |
|                                   |     non-maskable interrupts       |
|                                   |     generated by timer A          |
|                                   |     underflow.                    |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Enable            |
|                                   |     non-maskable interrupts       |
|                                   |     generated by timer B          |
|                                   |     underflow.                    |
|                                   |                                   |
|                                   | -   Bit #2: 1 = Enable TOD alarm  |
|                                   |     non-maskable interrupt.       |
|                                   |                                   |
|                                   | -   Bit #3: 1 = Enable            |
|                                   |     non-maskable interrupts       |
|                                   |     generated by a byte having    |
|                                   |     been received/sent via serial |
|                                   |     shift register.               |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Enable            |
|                                   |     non-maskable interrupts       |
|                                   |     generated by positive edge on |
|                                   |     FLAG pin.                     |
|                                   |                                   |
|                                   | -   Bit #7: Fill bit; bits #0-#6, |
|                                   |     that are set to 1, get their  |
|                                   |     values from this bit; bits    |
|                                   |     #0-#6, that are set to 0, are |
|                                   |     left unchanged.               |
+-----------------------------------+-----------------------------------+
| \$DD0E\                           | Timer A control register. Bits:   |
| 56590                             |                                   |
|                                   | -   Bit #0: 0 = Stop timer; 1 =   |
|                                   |     Start timer.                  |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Indicate timer    |
|                                   |     underflow on port B bit #6.   |
|                                   |                                   |
|                                   | -   Bit #2: 0 = Upon timer        |
|                                   |     underflow, invert port B bit  |
|                                   |     #6; 1 = upon timer underflow, |
|                                   |     generate a positive edge on   |
|                                   |     port B bit #6 for 1 system    |
|                                   |     cycle.                        |
|                                   |                                   |
|                                   | -   Bit #3: 0 = Timer restarts    |
|                                   |     upon underflow; 1 = Timer     |
|                                   |     stops upon underflow.         |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Load start value  |
|                                   |     into timer.                   |
|                                   |                                   |
|                                   | -   Bit #5: 0 = Timer counts      |
|                                   |     system cycles; 1 = Timer      |
|                                   |     counts positive edges on CNT  |
|                                   |     pin.                          |
|                                   |                                   |
|                                   | -   Bit #6: Serial shift register |
|                                   |     direction; 0 = Input, read; 1 |
|                                   |     = Output, write.              |
|                                   |                                   |
|                                   | -   Bit #7: TOD speed; 0 = 60 Hz; |
|                                   |     1 = 50 Hz.                    |
+-----------------------------------+-----------------------------------+
| \$DD0F\                           | Timer B control register. Bits:   |
| 56591                             |                                   |
|                                   | -   Bit #0: 0 = Stop timer; 1 =   |
|                                   |     Start timer.                  |
|                                   |                                   |
|                                   | -   Bit #1: 1 = Indicate timer    |
|                                   |     underflow on port B bit #7.   |
|                                   |                                   |
|                                   | -   Bit #2: 0 = Upon timer        |
|                                   |     underflow, invert port B bit  |
|                                   |     #7; 1 = upon timer underflow, |
|                                   |     generate a positive edge on   |
|                                   |     port B bit #7 for 1 system    |
|                                   |     cycle.                        |
|                                   |                                   |
|                                   | -   Bit #3: 0 = Timer restarts    |
|                                   |     upon underflow; 1 = Timer     |
|                                   |     stops upon underflow.         |
|                                   |                                   |
|                                   | -   Bit #4: 1 = Load start value  |
|                                   |     into timer.                   |
|                                   |                                   |
|                                   | -   Bits #5-#6: %00 = Timer       |
|                                   |     counts system cycles; %01 =   |
|                                   |     Timer counts positive edges   |
|                                   |     on CNT pin; %10 = Timer       |
|                                   |     counts underflows of timer A; |
|                                   |     %11 = Timer counts underflows |
|                                   |     of timer A occurring along    |
|                                   |     with a positive edge on CNT   |
|                                   |     pin.                          |
|                                   |                                   |
|                                   | -   Bit #7: 0 = Writing into TOD  |
|                                   |     registers sets TOD; 1 =       |
|                                   |     Writing into TOD registers    |
|                                   |     sets alarm time.              |
+-----------------------------------+-----------------------------------+
| \$DD10-\$DDFF\                    | CIA#2 register images (repeated   |
| 56592-56831                       | every \$10, 16 bytes).            |
|                                   |                                   |
|                                   | []{#pagede}[]{#ioarea1}           |
+-----------------------------------+-----------------------------------+
| **\$DE00-\$DEFF, 56832-57087\     |                                   |
| I/O Area #1**                     |                                   |
+-----------------------------------+-----------------------------------+
| \$DE00-\$DEFF\                    | I/O Area #1, memory mapped        |
| 56832-57087                       | registers or machine code         |
|                                   | routines of optional external     |
|                                   | devices (256 bytes). Layout and   |
|                                   | contents depend on the actual     |
|                                   | device.                           |
|                                   |                                   |
|                                   | []{#pagedf}[]{#ioarea2}           |
+-----------------------------------+-----------------------------------+
| **\$DF00-\$DFFF, 57088-57343\     |                                   |
| I/O Area #2**                     |                                   |
+-----------------------------------+-----------------------------------+
| \$DF00-\$DFFF\                    | I/O Area #2, memory mapped        |
| 57088-57343                       | registers or machine code         |
|                                   | routines of optional external     |
|                                   | devices (256 bytes). Layout and   |
|                                   | contents depend on the actual     |
|                                   | device. []{#pagee0}[]{#kernalrom} |
+-----------------------------------+-----------------------------------+
| **\$E000-\$FFFF, 57344-65535\     |                                   |
| KERNAL ROM**                      |                                   |
+-----------------------------------+-----------------------------------+
| \$E000-\$FFFF\                    | KERNAL ROM or RAM area (8192      |
| 57344-65535                       | bytes); depends on the value of   |
|                                   | bits #0-#2 of the processor port  |
|                                   | at memory address \$0001:         |
|                                   |                                   |
|                                   | -   %x0x: RAM area.               |
|                                   |                                   |
|                                   | -   %x1x: KERNAL ROM.             |
|                                   |                                   |
|                                   | []{#hwvector}                     |
+-----------------------------------+-----------------------------------+
| **\$FFFA-\$FFFF, 65530-65535\     |                                   |
| Hardware vectors**                |                                   |
+-----------------------------------+-----------------------------------+
| \$FFFA-\$FFFB\                    | Execution address of non-maskable |
| 65530-65531                       | interrupt service routine.\       |
|                                   | Default: \$FE43.                  |
+-----------------------------------+-----------------------------------+
| \$FFFC-\$FFFD\                    | Execution address of cold reset.\ |
| 65532-65533                       | Default: \$FCE2.                  |
+-----------------------------------+-----------------------------------+
| \$FFFE-\$FFFF\                    | Execution address of interrupt    |
| 65534-65535                       | service routine.\                 |
|                                   | Default: \$FF48.                  |
+-----------------------------------+-----------------------------------+

\
