import { generatePublicKey, generateExtensionId } from './utils.js';
import { expect, describe, test } from 'vitest';

const PRIVATE_KEY_STRING = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC576q7PopiYZtu
QXEUFEbesb3WhdNUTkSMpKkkhv42LMXOhhp/7Bar1rWV+KAbjIEUDmvQVD/3HBAv
itUbi99fMq6wnuO9r2ltufdVo1qfE54N4ROl969cbyEyKE/e2wVW7ShTkJJa0d4R
bFCtXxvB8L7c92McrpWnNoHyEUpk1uDmhuYp2OyHNlxR2s3752Hjx8CMW86xZ9Mg
QGTVGAyaTXrSYPshq83w9QnWpa0lMVr0tJjNV49lYZDs18nx2tsUE6OHeQJC08+A
zeSNNoWumcvdfM7/Yl3M2h+01sQGRb7JAsDWrIDP+xuzXAcCfNthbjmAlMl1gry2
7RRZwBd9AgMBAAECggEAJYo/woO/PVs/Hizcx4TLhTlGHoqQ7w/JU8sH8l3F9Aqo
mkilj4fLUQDt0xxqOP2ubu31cw+bhYj3NJ4XZjMgk3AgaHz/9qN0igiWqQXs7Tqw
+dTkWmkuUN+ICIAulgxK4PDLaEnDXs5KA2MGy+YsrMSuSF8zNc6C3QqKhGTczAxl
Jpiq2LH7vfxvXlrqkFfzRmcntSskM5NeGeodlIhdUPi0vmlHHHZoAv9J6UQTvO/8
4RHWdUPnacAOh6tw9ufxUVExdbDHOHpOc4qdQHB/1kh46yN+LrD8ph7Dyv4evHdM
j3+k/xexJdwo1VW15CKb7IxuKYKTxUMwwXALDV4d+QKBgQDfgYznOHK4uZjHdZ7+
OeLtFmX1H8JmD0I+YAxQ8iUNUzJAFWd09pOS0jURzyjQjQAgS15k9d6Af3XXZ/GF
f1sbdtr0eN8qwbN+Hbp7eypvtnEKF9uqjCv7SqS17xxFPhNDe+h4qekIVi1KD7Z6
Y11w+bQ6Gt1/oNBH/U9z914QKQKBgQDU99djqdJsWzJImgpo1tSBmnm65TCQFVhA
2aQdHz3a7pdwwP0mu408H4rKGi/ud2TiqxpSXrHONkGy+a+QmMUdQWEL/B/ZNjF3
RuoWoBYN1ocF8zksQ0kgN68iWytlvW88n9VBXWT6Y0SadyRXzSK7ilFUNnDYCs2I
RK8VOFynNQKBgH3IGJXfbKCMwnAtv4Zu6Uhn/IUQlIR/PdaAky3SuAthsLvjz89B
HRfZeMhG/z8uus1x3POQcuF52cWZ15A7dfhk0SAYDe+wBuWIsXPggqdP0xnNB3BZ
Zj8LaNqCcDR/lLO7vb56UIzCgsZVRWpnFSUJQeYZTGIRDGYXJmmq4qLRAoGBAL0h
EQYwNXAHGUPCkQYD6xrh7cMdcKA0ZHjLD2TRbuQzyQfYS7kPDGFdfar30KNNIqnt
2+VUtUD1jCj+dnzKPxs5CY9UK5CCATH1J0RKjOtjHewZ0SdO5e0Xpo+zOXoT3mqP
Yxq2b0uxxqYKsprK0VKNhqZr5pDmHxsqK/aDZD0VAoGBANS3JnX/n4q1cO44ooYo
6kwv5Pc8RNJJd6pH3jJvkh8sv6a3n9fKVO2ZaEOSBGjAWkY/PKDLS0bWlQx82HUF
Q8KEcKHwAdHCwWziYGSHACAbCmPrDbid2bwAjO8mlWkweU1bPMJW5JQxKXi0kF1G
W9ee/10CB8HY9H9UwW9nL/lG
-----END PRIVATE KEY-----`;
const EXPECTED_PUBLIC_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAue+quz6KYmGbbkFxFBRG3rG91oXTVE5EjKSpJIb+NizFzoYaf+wWq9a1lfigG4yBFA5r0FQ/9xwQL4rVG4vfXzKusJ7jva9pbbn3VaNanxOeDeETpfevXG8hMihP3tsFVu0oU5CSWtHeEWxQrV8bwfC+3PdjHK6VpzaB8hFKZNbg5obmKdjshzZcUdrN++dh48fAjFvOsWfTIEBk1RgMmk160mD7IavN8PUJ1qWtJTFa9LSYzVePZWGQ7NfJ8drbFBOjh3kCQtPPgM3kjTaFrpnL3XzO/2JdzNoftNbEBkW+yQLA1qyAz/sbs1wHAnzbYW45gJTJdYK8tu0UWcAXfQIDAQAB';
const EXPECTED_EXTENSION_ID = 'hppoagodbmldkonkdegheeibaflkedkm';

describe('generate publickey and extensionId', () => {
  test('should generate a extension id from a private key', () => {
    const publicKey = generatePublicKey(PRIVATE_KEY_STRING);

    expect(publicKey).toBe(EXPECTED_PUBLIC_KEY);
    const extensionId = generateExtensionId(EXPECTED_PUBLIC_KEY);

    expect(extensionId).toBe(EXPECTED_EXTENSION_ID);
  });
});
