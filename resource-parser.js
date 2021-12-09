const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

function byteCode(codes) {
    var codeStr = '', binStr;
    for (var i = 0; i < codes.length; i += 2) {
        binStr = parseInt(codes.slice(i, i + 2), 16).toString(2);
        if (binStr.length < 8) {
            binStr = ('0000000' + binStr).slice(-8);
        }
        codeStr += binStr;
    }
    return codeStr
}

function base64encode(str) {
    var bb = byteCode(charToUtf8(str)), i, b6 = [], x, base64 = '', n;
    for (i = 0; i < bb.length; i += 6) {
        b6.push(bb.slice(i, i + 6));
    }
    for (x in b6) {
        if (Number(x) + 1 == b6.length) {
            b6[x] = (b6[x] + '00000').slice(0, 6)
        }
        base64 += base64Chars[parseInt(b6[x], 2)]
    }
    if (bb.length % 24 != 0) {
        n = (24 - bb.length % 24) / 8;
        if (n == 1) base64 += '=';
        else if (n == 2) base64 += '==';
    }
    return base64;
}

function base64decode(str) {
    var bc = str.replace(/=/g, '').split(""), y, z, c, b, bs = '';
    for (y in bc) {
        c = '';
        for (z in base64Chars) {
            if (bc[y] == base64Chars[z]) {
                c = z;
                break;
            }
        }
        if (c == '') return '编码有误';
        b = Number(c).toString(2);
        if (b.length < 6) {
            b = ('00000' + b).slice(-6)
        }
        bs += b
    }
    var j = Math.floor(bs.length / 8), i, ha = '', hb;
    for (i = 0; i < j; i++) {
        hb = parseInt(bs.slice(i * 8, i * 8 + 8), 2).toString(16);
        if (hb.length < 2) hb = ('00' + hb).slice(-2);
        ha += '%' + hb;
    }
    return decodeURIComponent(ha)
}

const ssPrefix = 'ss://';
const vmessPrefix = 'vmess://';

function convertSs(nodeInfo) {
    const split = nodeInfo.replace(ssPrefix, '').split('#');
    const detailInfo = base64decode(split[0]);
    const decode = decodeURI(split[1], 'utf-8');
    const split1 = detailInfo.split('@');
    const split2 = split1[0].split(':');
    return 'shadowsocks=' + split1[1] + ', method=' + split2[0] + ', password=' + split2[1] + ', fast-open=false, udp-relay=false, tag=' + decode
}

function convertVmess(nodeInfo) {
    const decode = base64decode(nodeInfo.replace(vmessPrefix, ''));
    const jsonObject = JSON.parse(decode);
    return 'vmess=' + jsonObject.add + ':' + jsonObject.port
        + ', method=' + jsonObject.type
        + ', password=' + jsonObject.id
        + ', fast-open=false, udp-relay=false, tag=' + jsonObject.ps
}

// const base64Str = 'c3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Um05UGFVZHNhMEZCT1hsUVJVZFFRRE00TGpZNExqRXpOQzR6TnpvM016QTIjJWU2JTliJWI0JWU2JTk2JWIwJWU2JTk3JWE1JWU2JTljJTlmMTIlZTYlOWMlODg3JWU2JTk3JWE1MTclM2EwMA0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2WnpWTlpVUTJSblF6UTFkc1NrbGtRRE00TGpZNExqRXpOQzR5TURJNk5UQXdNdz09IyVmMCU5ZiU4NyViYSVmMCU5ZiU4NyViOFVTXzE3MDUrJTdjKzkuNjhNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Wm1GQ1FXOUVOVFJyT0RkVlNrYzNRREV6TkM0eE9UVXVNVGsyTGpFeU9qSXpOelU9IyVmMCU5ZiU4ZiU4MVpaXzE4NjcrJTdjMTQyLjY2TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlMybDRUSFpMZW5kcVpXdEhNREJ5YlVBek9DNDJPQzR4TXpRdU1Ua3dPamd3T0RBPSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMjE4KyU3YysyLjQ4TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlVFTnVia2cyVTFGVGJtWnZVekkzUURFNU9DNDFOeTR5Tnk0eE9EUTZPREE1TUE9PSMlZjAlOWYlODclYTglZjAlOWYlODclYTZDQV8xOTArJTdjMTAxLjA4TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlMybDRUSFpMZW5kcVpXdEhNREJ5YlVBek9DNHhNRGN1TWpJMkxqUTRPamd3T0RBPSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMjAzKyU3YzE1NS40NE1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFETTRMalk0TGpFek5DNHpOem8zTXpBMyMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMjQ0KyU3YzcwLjA4TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNldUWlNPWEJCZEhaNGVIcHRSME5BTXpndU5qZ3VNVE0wTGpFNU1Eb3pNemc1IyVmMCU5ZiU4NyViYSVmMCU5ZiU4NyViOFVTXzEzMzArJTdjNDUuODJNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Y0V0RlZ6aEtVRUo1VkZaVVRIUk5RRE00TGpZNExqRXpOQzR5TURJNk5EUXojJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTUxMyslN2MyNy42NE1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZaelZOWlVRMlJuUXpRMWRzU2tsa1FETTRMakV3Tnk0eU1qWXVORGc2TlRBd013PT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTUxMSslN2MxNjIuNTlNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Y0V0RlZ6aEtVRUo1VkZaVVRIUk5RREV6TkM0eE9UVXVNVGsyTGpFeU9qUTBNdz09IyVmMCU5ZiU4ZiU4MVpaXzE4MjErJTdjMTAwLjk0TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlp6Vk5aVVEyUm5RelExZHNTa2xrUURFek5DNHhPVFV1TVRrMkxqRXlPalV3TURNPSMlZjAlOWYlOGYlODFaWl8xODE0KyU3YzE1MS4zME1iDQpzczovL1kyaGhZMmhoTWpBdGFXVjBaaTF3YjJ4NU1UTXdOVHBISVhsQ2QxQlhTRE5XWVc5QU1UUXhMamsxTGpBdU1qTTZPREF6IyVmMCU5ZiU4NyVhOSVmMCU5ZiU4NyVhYURFXzMzMCslN2M0MS42N01iDQpzczovL1kyaGhZMmhoTWpBdGFXVjBaaTF3YjJ4NU1UTXdOVHBISVhsQ2QxQlhTRE5XWVc5QU1UUXhMamsxTGpBdU1qTTZPREEyIyVmMCU5ZiU4NyVhOSVmMCU5ZiU4NyVhYURFXzMzNyslN2M0Mi4wN01iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFERTBNaTR5TURJdU5EZ3VNelE2TnpNd053PT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTIyNCslN2M5OC44NU1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZTMmw0VEhaTGVuZHFaV3RITURCeWJVQXpPQzQ1TVM0eE1EQXVNakF3T2pnd09EQT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTYyMCslN2MxNy4yME1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZaelZOWlVRMlJuUXpRMWRzU2tsa1FETTRMamcyTGpFek5TNHlOem8xTURBeiMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xNjU3KyU3YzM5Ljk2TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlp6Vk5aVVEyUm5RelExZHNTa2xrUURNNExqWTRMakV6TkM0eU1ESTZOVEF3TkE9PSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xNzE5KyU3YzE5LjY2TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlJtOVBhVWRzYTBGQk9YbFFSVWRRUURFek5DNHhPVFV1TVRrMkxqRXlPamN6TURZPSMlZjAlOWYlOGYlODFaWl8xODQzKyU3YzE1MS4yM01iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FERTVPQzQxTnk0eU55NHhPRFE2TWpNM05nPT0jJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMTgyKyU3YzkwLjI3TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlp6Vk5aVVEyUm5RelExZHNTa2xrUURFNU9DNDFOeTR5Tnk0eE5USTZOVEF3TXc9PSMlZjAlOWYlODclYTglZjAlOWYlODclYTZDQV8yMjUrJTdjMTAyLjE1TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlMybDRUSFpMZW5kcVpXdEhNREJ5YlVBeE5qY3VPRGd1TmpFdU1UTXdPamd3T0RBPSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMTk3KyU3YzczLjcxTWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlJtOVBhVWRzYTBGQk9YbFFSVWRRUURNNExqWTRMakV6TkM0eU1ESTZOek13Tmc9PSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMjgwKyU3YzE4LjI0TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlptRkNRVzlFTlRSck9EZFZTa2MzUURFME1pNHlNREl1TkRndU16UTZNak0zTlE9PSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xNDA5KyU3YzU1LjMwTWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlp6Vk5aVVEyUm5RelExZHNTa2xrUURNNExqRXdOeTR5TWpZdU5EZzZOVEF3TkE9PSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xNjY2KyU3YzEzOC4xNk1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FETTRMakV3Tnk0eU1qWXVORGc2TWpNM05RPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTQyMSslN2MxOTYuNDZNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Wm1GQ1FXOUVOVFJyT0RkVlNrYzNRREU1T0M0MU55NHlOeTR4T0RRNk1qTTNOUT09IyVmMCU5ZiU4NyVhOCVmMCU5ZiU4NyVhNkNBXzE4NCslN2MxNDMuMThNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2V1RaU09YQkJkSFo0ZUhwdFIwTkFNVFkzTGpnNExqWXpMall4T2pNek9Eaz0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTMxMCslN2MyMi4xOE1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFERTVPQzQxTnk0eU55NHhPRFE2TnpNd05nPT0jJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMjQ5KyU3YzE1Ni41M01iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FETTRMakV3Tnk0eU1qWXVORGc2TWpNM05nPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTM4NislN2MxNjUuMzdNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2WnpWTlpVUTJSblF6UTFkc1NrbGtRRE00TGpZNExqRXpOQzR4T1RBNk5UQXdNdz09IyVmMCU5ZiU4NyViYSVmMCU5ZiU4NyViOFVTXzE1OTArJTdjMTM2LjE2TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlp6Vk5aVVEyUm5RelExZHNTa2xrUURFek5DNHhPVFV1TVRrMkxqRXlPalV3TURRPSMlZjAlOWYlOGYlODFaWl8xNzgxKyU3YzIwLjQyTWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlVFTnVia2cyVTFGVGJtWnZVekkzUURFM01pNHhNRGN1TWpNekxqSXpORG80TURrdyMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18zMTkNCnNzOi8vWVdWekxUSTFOaTFuWTIwNmNFdEZWemhLVUVKNVZGWlVUSFJOUURFNU9DNDFOeTR5Tnk0eE9EUTZORFF6IyVmMCU5ZiU4NyVhOCVmMCU5ZiU4NyVhNkNBXzE1MyslN2MxMTEuMjdNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Wm1GQ1FXOUVOVFJyT0RkVlNrYzNRREUzTWk0eE1EY3VNak16TGpJek5Eb3lNemMyIyVmMCU5ZiU4NyViYSVmMCU5ZiU4NyViOFVTXzMxOA0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Um05UGFVZHNhMEZCT1hsUVJVZFFRRE00TGpZNExqRXpOQzR4T1RBNk56TXdOdz09IyVmMCU5ZiU4NyViYSVmMCU5ZiU4NyViOFVTXzEyNDErJTdjMTMwLjc1TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlJtOVBhVWRzYTBGQk9YbFFSVWRRUURFME1pNHlNREl1TkRndU16UTZOek13Tmc9PSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMjU3KyU3YzExMC4yOE1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZXVFpTT1hCQmRIWjRlSHB0UjBOQU1UUXlMakl3TWk0ME9DNHpORG96TXpnNSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMjk0KyU3YzE3LjkwTWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlJtOVBhVWRzYTBGQk9YbFFSVWRRUURFNU15NHhNRGd1TVRFNExqSTZOek13Tmc9PSMlZjAlOWYlODclYTklZjAlOWYlODclYWFERV8zMjQrJTdjNTYuNTFNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Y0V0RlZ6aEtVRUo1VkZaVVRIUk5RREU1T0M0MU55NHlOeTR4TlRJNk5EUXojJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMTU4KyU3YzEzNi40N01iDQpzczovL1kyaGhZMmhoTWpBdGFXVjBaaTF3YjJ4NU1UTXdOVHBISVhsQ2QxQlhTRE5XWVc5QU1UUXhMamsxTGpBdU1qTTZPREV3IyVmMCU5ZiU4NyVhOSVmMCU5ZiU4NyVhYURFXzM0MCslN2MzOS4yM01iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FETTRMamt4TGpFd01DNHhNekE2TWpNM05nPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTYzMSslN2MxNjEuMzVNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Wm1GQ1FXOUVOVFJyT0RkVlNrYzNRREV6TkM0eE9UVXVNVGsyTGpFeU9qSXpOelk9IyVmMCU5ZiU4ZiU4MVpaXzE5MTArJTdjMTI1Ljc4TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlVFTnVia2cyVTFGVGJtWnZVekkzUURFek5DNHhPVFV1TVRrMkxqRXlPamd3T1RBPSMlZjAlOWYlOGYlODFaWl8yMDI4KyU3YzEwNi43OE1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFEUTJMakk1TGpJeE9TNHlORFk2TnpNd053PT0jJWYwJTlmJTg3JWIzJWYwJTlmJTg3JWI0Tk9fNjI1KyU3Yys1LjA1TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlptRkNRVzlFTlRSck9EZFZTa2MzUURFME1pNHlNREl1TkRndU16UTZNak0zTmc9PSMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMzY4KyU3YzEyMC45Mk1iDQp2bWVzczovL2V3MEtJQ0FpZGlJNklDSXlJaXdOQ2lBZ0luQnpJam9nSXZDZmg3ZnduNGU2VWxWZk5qZzNJSHd5TWk0NU9FMWlJaXdOQ2lBZ0ltRmtaQ0k2SUNJeE9UUXVNVE0xTGpNeUxqSXdPQ0lzRFFvZ0lDSndiM0owSWpvZ0lqTXlOVFV4SWl3TkNpQWdJbWxrSWpvZ0lqbGtOREJoWldaakxUVTBaRGt0TVRGbFl5MWhaakprTFdZeVl6RTFOek0yTUdJeFpTSXNEUW9nSUNKaGFXUWlPaUFpTUNJc0RRb2dJQ0p1WlhRaU9pQWlkM01pTEEwS0lDQWlkSGx3WlNJNklDSnViMjVsSWl3TkNpQWdJbWh2YzNRaU9pQWlJaXdOQ2lBZ0luQmhkR2dpT2lBaUwxYzVjekk0YXpGcEx5SXNEUW9nSUNKMGJITWlPaUFpSWl3TkNpQWdJbk51YVNJNklDSWlEUXA5DQpzczovL1lXVnpMVEkxTmkxblkyMDZVRU51YmtnMlUxRlRibVp2VXpJM1FETTRMalk0TGpFek5DNHpOem80TURreCMlZjAlOWYlODclYmElZjAlOWYlODclYjhVU18xMTQ0KyU3Yzg5Ljc1TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlVFTnVia2cyVTFGVGJtWnZVekkzUURFNU9DNDFOeTR5Tnk0eE9EUTZPREE1TVE9PSMlZjAlOWYlODclYTglZjAlOWYlODclYTZDQV8xODgrJTdjMTYyLjYyTWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlVFTnVia2cyVTFGVGJtWnZVekkzUURFek5DNHhPVFV1TVRrMkxqRXlPamd3T1RFPSMlZjAlOWYlOGYlODFaWl8xOTMwKyU3YzEzMi43OU1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZTMmw0VEhaTGVuZHFaV3RITURCeWJVQXhOREl1TWpBeUxqUTRMak0wT2pnd09EQT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTE4NSslN2MyOS41Nk1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FETTRMalk0TGpFek5DNHlNREk2TWpNM05RPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTQyNSslN2M2NC45ME1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZVRU51YmtnMlUxRlRibVp2VXpJM1FERTVPQzQxTnk0eU55NHhOVEk2T0RBNU1RPT0jJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMTg1KyU3YzEwOC4yMU1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FERTNNaTR4TURjdU1qTXpMakl6TkRveU16YzEjJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTQ1OSslN2M1MS4zOU1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZaelZOWlVRMlJuUXpRMWRzU2tsa1FERTVPQzQxTnk0eU55NHhPRFE2TlRBd05BPT0jJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMTc4KyU3YzE1MC43Nk1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZaelZOWlVRMlJuUXpRMWRzU2tsa1FERTVPQzQxTnk0eU55NHhPRFE2TlRBd013PT0jJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMTg3KyU3YzE2OC4zOE1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFETTRMalk0TGpFek5DNHlNREk2TnpNd053PT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTI0OCslN2M1Ni45OU1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZabUZDUVc5RU5UUnJPRGRWU2tjM1FETTRMamt4TGpFd01DNHhNekE2TWpNM05RPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTYxMyslN2MxMjkuNjNNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2Um05UGFVZHNhMEZCT1hsUVJVZFFRRE00TGpreExqRXdNQzR4TXpBNk56TXdOdz09IyVmMCU5ZiU4NyViYSVmMCU5ZiU4NyViOFVTXzE2NzkrJTdjMTY5LjI4TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlMybDRUSFpMZW5kcVpXdEhNREJ5YlVBeE16UXVNVGsxTGpFNU5pNHhNam80TURndyMlZjAlOWYlOGYlODFaWl8xNzk5KyU3YzEwNy4xME1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZVRU51YmtnMlUxRlRibVp2VXpJM1FERTBNaTR5TURJdU5EZ3VNelE2T0RBNU1RPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfMTUxMislN2MxNy44Nk1iDQpzczovL1kyaGhZMmhoTWpBdGFXVjBaaTF3YjJ4NU1UTXdOVHBISVhsQ2QxQlhTRE5XWVc5QU1UUXhMamsxTGpBdU1qTTZPREE1IyVmMCU5ZiU4NyVhOSVmMCU5ZiU4NyVhYURFXzMwMSslN2MzOS45N01iDQpzczovL1kyaGhZMmhoTWpBdGFXVjBaaTF3YjJ4NU1UTXdOVHBISVhsQ2QxQlhTRE5XWVc5QU1UUXhMamsxTGpBdU1qTTZPREF4IyVmMCU5ZiU4NyVhOSVmMCU5ZiU4NyVhYURFXzY4DQpzczovL1lXVnpMVEkxTmkxblkyMDZVRU51YmtnMlUxRlRibVp2VXpJM1FETTRMakV3Tnk0eU1qWXVORGc2T0RBNU1BPT0jJWYwJTlmJTg3JWJhJWYwJTlmJTg3JWI4VVNfOTM5KyU3YzEwOS40N01iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFERTNNaTR4TURjdU1qTXpMakl6TkRvM016QTIjXzA3KyU3YzQ3LjU4TWINCnNzOi8vWVdWekxUSTFOaTFuWTIwNlp6Vk5aVVEyUm5RelExZHNTa2xrUURFME1TNHhOalF1TXpVdU5ERTZOVEF3TkE9PSMlZjAlOWYlODclYWYlZjAlOWYlODclYjVKUF81NDIrJTdjMjMuMzZNYg0Kc3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2WnpWTlpVUTJSblF6UTFkc1NrbGtRRE00TGpZNExqRXpOQzR6TnpvMU1EQXojXzA4KyU3YzEyMi4yNU1iDQpzczovL1lXVnpMVEkxTmkxblkyMDZSbTlQYVVkc2EwRkJPWGxRUlVkUVFERTVPQzQxTnk0eU55NHhPRFE2TnpNd053PT0jJWYwJTlmJTg3JWE4JWYwJTlmJTg3JWE2Q0FfMTc3KyU3YzE3MC43OU1iDQp2bWVzczovL2V3MEtJQ0FpZGlJNklDSXlJaXdOQ2lBZ0luQnpJam9nSXZDZmg3cnduNGU0VlZOZk1UYzBPU0I4T0RBdU56Vk5ZaUlzRFFvZ0lDSmhaR1FpT2lBaU1qTXVPRE11TWpJM0xqRXdOeUlzRFFvZ0lDSndiM0owSWpvZ0lqWXhNVGN6SWl3TkNpQWdJbWxrSWpvZ0lqbGtNVEEwTTJFMkxXVTROMlV0TkdKaU55MDRPRFU0TFdNeE1UZzFaVGxqTUdNellpSXNEUW9nSUNKaGFXUWlPaUFpT0NJc0RRb2dJQ0p1WlhRaU9pQWlkR053SWl3TkNpQWdJblI1Y0dVaU9pQWlibTl1WlNJc0RRb2dJQ0pvYjNOMElqb2dJaUlzRFFvZ0lDSndZWFJvSWpvZ0lpOGlMQTBLSUNBaWRHeHpJam9nSWlJc0RRb2dJQ0p6Ym1raU9pQWlJZzBLZlE9PQ0K'
const base64Str = $resource.content
const decode = base64decode(base64Str)
const strings = decode.split('\r\n');
let total = '';
let list = [];
for (let string of strings) {
    let temp = ''
    if (string.startsWith(ssPrefix)) {
        temp = convertSs(string);
    } else if (string.startsWith(vmessPrefix)) {
        temp = convertVmess(string);
    }else {
        continue
    }
    list.push(temp)
}

list.sort(function (a, b) {
    var aSplit = a.split('|');
    var aWeight = parseInt(aSplit.length == 2 ? aSplit[1] : 50);
    var bSplit = b.split('|');
    var bWeight = parseInt(bSplit.length == 2 ? bSplit[1] : 50);
    return bWeight - aWeight;//	降序，升序则反之
});
total = list.join('\r\n');
console.log(total)
$done({content: total});
