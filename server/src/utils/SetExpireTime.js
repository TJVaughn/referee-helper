const setExpireTime = (days=1) => {
    let date = new Date();
    date.setTime(date.getTime() + (1000 * 60 * 60 * 24 * days));
    let expires = date.toUTCString();
    return expires
}
module.exports = {
    setExpireTime
}