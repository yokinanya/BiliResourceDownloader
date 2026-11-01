import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { loginCookiesFromResponse } from '../src/utils/loginCookies.ts'

function responseHeaders(): Headers {
    const headers = new Headers()
    headers.append('set-cookie', 'SESSDATA=session%2Cvalue%3D; Path=/; Expires=Sat, 04 Mar 2028 07:30:09 GMT; HttpOnly')
    headers.append('set-cookie', 'DedeUserID=123; Path=/')
    headers.append('set-cookie', 'DedeUserID__ckMd5=hash; Path=/')
    headers.append('set-cookie', 'bili_jct=csrf; Path=/')
    headers.append('set-cookie', 'sid=abc; Path=/')
    headers.append('set-cookie', 'other=ignored; Path=/')
    return headers
}

test('extracts actual cookie values from merged Set-Cookie headers', () => {
    assert.equal(loginCookiesFromResponse(responseHeaders()),
        'SESSDATA=session%2Cvalue%3D; DedeUserID=123; DedeUserID__ckMd5=hash; bili_jct=csrf; sid=abc')
})

test('reports missing response headers or required cookies', () => {
    assert.throws(() => loginCookiesFromResponse(new Headers()), /未包含 Set-Cookie/)
    assert.throws(() => loginCookiesFromResponse(new Headers({ 'set-cookie': 'SESSDATA=value; Path=/' })), /DedeUserID/)
})
