module.exports = {
  getQuarter: function getQuarter(date) {
    if (date < 1458197999) {
      return "q1"
    } else if (date > 1458197999 && date < 1463036399) {
      return "q2"
    } else if (date > 1463036399 && date < 1467874799) {
      return "q3"
    } else if (date > 1467874799) {
      return "q4"
    }
  }
}
