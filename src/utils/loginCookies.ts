const requiredCookieNames = ['DedeUserID', 'DedeUserID__ckMd5', 'SESSDATA', 'bili_jct'] as const
const cookieNames = new Set<string>([...requiredCookieNames, 'sid'])

export function loginCookiesFromResponse(headers: Headers): string {
    const setCookie = headers.get('set-cookie')
    if (!setCookie) {
        throw new Error('扫码登录响应未包含 Set-Cookie')
    }

    // Headers 会合并同名响应头；Expires 属性中的逗号不是 Cookie 分隔符。
    const cookies = new Map<string, string>()
    for (const entry of setCookie.split(/,\s*(?=[^\s,;=]+=)/)) {
        const pair = entry.split(';', 1)[0]
        const separator = pair.indexOf('=')
        const name = pair.slice(0, separator).trim()
        const value = pair.slice(separator + 1).trim()
        if (separator > 0 && cookieNames.has(name) && value) {
            cookies.set(name, value)
        }
    }

    const missing = requiredCookieNames.filter(name => !cookies.has(name))
    if (missing.length) {
        throw new Error(`扫码登录响应缺少 Cookie：${missing.join(', ')}`)
    }
    return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ')
}
