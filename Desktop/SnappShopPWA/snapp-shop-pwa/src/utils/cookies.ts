export function setCookie(cname: string, cvalue: any, exdays = 365) {
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie =
    cname + '=' + JSON.stringify(cvalue) + ';' + expires + ';path=/'
}

export function getCookie(cname: string) {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return JSON.parse(c.substring(name.length, c.length))
    }
  }
  return ''
}

export function checkCookie() {
  let user = getCookie('username') as string | null
  if (user != '') {
    alert('Welcome again ' + user)
  } else {
    user = prompt('Please enter your name:', '')
    if (user != '' && user != null) {
      setCookie('username', user, 365)
    }
  }
}
