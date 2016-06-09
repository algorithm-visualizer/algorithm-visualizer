function getPosUp(pos) {
  return (pos === alphabet.length - 1) ? 0 : pos + 1;
}

function getPosDown(pos) {
  return (pos === 0) ? alphabet.length - 1 : pos - 1;
}

function getNextChar(currChar, direction) {
  var pos = alphabetMap[currChar];
  var nextPos = direction === 'up' ? getPosUp(pos) : getPosDown(pos);
  var nextChar = alphabet.charAt(nextPos);

  logger._print(currChar + ' -> ' + nextChar);
  return nextChar;
}

function cipher(str, rotation, direction, cipherTracer) {
  if (!str) return '';

  for (var i = 0; i < str.length; i++) {

    cipherTracer._wait();

    var currChar = str.charAt(i);
    if (typeof alphabetMap[currChar] === 'number') { // don't encrpt/decrypt characters not in  alphabetMap
      var r = rotation;

      logger._print('Rotating ' + currChar + ' ' + direction + ' ' + rotation + ' times');
      cipherTracer._select(i)._wait();

      // perform given amount of rotations in the given direction
      while (r-- > 0) {
        currChar = getNextChar(currChar, direction);
        cipherTracer._notify(i, currChar)._wait();
      }
    } else {
      logger._print('Ignore this character');
    }
    str = str.substring(0, i) + currChar + str.substring(i + 1);
    logger._print('Current result: ' + str);
  }

  return str;
}

function encrypt(str, rotation) {
  logger._print('Encrypting: ' + str);
  return cipher(str, rotation, 'up', encryptTracer);
}

function decrypt(str, rotation) {
  logger._print('Decrypting: ' + str);
  return cipher(str, rotation, 'down', decryptTracer);
}

var encrypted = encrypt(string, rotation);
logger._print('Encrypted result: ' + encrypted);

decryptTracer._setData(encrypted);
var decrypted = decrypt(encrypted, rotation);
logger._print('Decrypted result: ' + decrypted);
