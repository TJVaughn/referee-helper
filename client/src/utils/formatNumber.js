const formatNumber = (number) => {
    if (number > 99 && number < 10000){
        number = number.toString().split('').reverse()
        number.splice(2, 0, '.').join('')
        number = number.toString().split(',').reverse().join('')
    } else if (number > 9999 && number < 100000){
        number = number.toString().split('').reverse()
        number.splice(2, 0, '.').join('')
        number = number.toString().split(',').reverse().join('')
    } else if (number > 99999){
        number = number.toString().split('').reverse()
        number.splice(2, 0, '.')
        number.splice(6, 0, ',')
        number = number.join('').split('').reverse().join('')
    }

    return number
}
export default formatNumber