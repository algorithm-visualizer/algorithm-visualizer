/*
 code assumes that plainText contains ONLY LOWER CASE ALPHABETS
 */

Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

var keys = {a: 5, b: 7},
  N = 26;

function encrypt(plainText) {
  var cypherText = '';

  function cryptAlpha(alpha) {
    var index = alpha.charCodeAt(0) - 'a'.charCodeAt(0);
    var result = ((keys.a * index) + keys.b).mod(N);

    logger._print('Index of ' + alpha + ' = ' + index);

    result += 'a'.charCodeAt(0);
    return String.fromCharCode(result);
  }

  logger._print('Beginning Affine Encryption');
  logger._print('Encryption formula: <b>((keys.a * index_of_alphabet) + keys.b) % N</b>');
  logger._print('keys.a=' + keys.a + ', keys.b=' + keys.b + ', N=' + N);

  for (var i in plainText) {
    ptTracer._select(i)._wait();
    ptTracer._deselect(i);

    cypherText += cryptAlpha(plainText [i]);

    ptTracer._notify(i, cypherText.slice(-1))._wait();
    ptTracer._denotify(i);
  }

  return cypherText;
}

function decrypt(cypherText) {
  var plainText = '';
  var aInverse = (function () {
    for (var i = 1; i < N; i++) {
      if (((keys.a * i).mod(N)) === 1) {
        return i;
      }
    }
  })();

  logger._print('a<sup>-1</sup> = ' + aInverse);

  function decryptAlpha(alpha) {
    var index = alpha.charCodeAt(0) - 'a'.charCodeAt(0);
    var result = (aInverse * (index - keys.b)).mod(N);

    logger._print('Index of ' + alpha + ' = ' + index);

    result += 'a'.charCodeAt(0);
    return String.fromCharCode(result);
  }

  logger._print('Beginning Affine Decryption');
  logger._print('Decryption formula: <b>(a<sup>-1</sup> * (index - keys.b)) % N</b>');
  logger._print('keys.b=' + keys.b + ', N=' + N);

  for (var i in cypherText) {
    ctTracer._select(i)._wait();
    ctTracer._deselect(i)._wait();

    plainText += decryptAlpha(cypherText [i]);

    ctTracer._notify(i, plainText.slice(-1))._wait();
    ctTracer._denotify(i)._wait();
  }

  return plainText;
}

var cipherText = encrypt(plainText);
ctTracer._setData(cipherText);
decrypt(cipherText);