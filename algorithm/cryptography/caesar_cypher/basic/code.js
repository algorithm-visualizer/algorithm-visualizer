function getPosUp(pos) {
  if (pos === alphabet.length - 1) {
    return 0;
  } else {
    return pos + 1;
  }
}

function getPosDown(pos) {
  if (pos === 0) {
    return alphabet.length - 1;
  } else {
    return pos - 1;
  }
}

function getNextChar(c, direction) {
  var pos = alphabetMap[c];
  var nextPos = direction === 'up' ? getPosUp(pos) : getPosDown(pos);
  return alphabet.charAt(nextPos);
}

function cypher(str, rotation, direction, cypherTracer) {
  if (!str) return '';

  var result = '';
  for (var i = 0; i < str.length; i++) {

    var currChar = str.charAt(i);
    var r = rotation;

    logger._print('Rotating ' + currChar + ' ' + direction + ' ' + rotation + ' times');
    cypherTracer._select(i)._wait();

    // perform given amount of rotations in the given direction
    while (--r > 0) {
      currChar = getNextChar(currChar, direction);
      cypherTracer._setValue(currChar, i)._wait();
    }
    cypherTracer._deselect(i)._notify(i)._wait();

    logger._print('Rotation result: ' + currChar);

    str = str.substring(0, i) + currChar + str.substring(i + 1);

    logger._print('Current result: ' + str);
  }

  return str;
}

function encrypt(str, rotation) {
  logger._print('Encrypting: ' + str);
  return cypher(str, rotation, 'down', encryptTracer);
}

function decrypt(str, rotation) {
  logger._print('Decrypting: ' + str);
  return cypher(str, rotation, 'up', decryptTracer);
}

var encrypted = encrypt(string, rotation);

decryptTracer._setData(encrypted);
decrypt(encrypted, rotation);