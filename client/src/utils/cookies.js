const setCookie = (name, value, days) => {
    let date = new Date()
    date.setTime(date.getTime() + (days * 1000 * 60 * 60 * 24));
    let expires = date.toUTCString();
    document.cookie = `${name}=${value};expires=${expires};path=/;`
    console.log(document.cookie)
  }
  
const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
  
  
export { setCookie, getCookie }