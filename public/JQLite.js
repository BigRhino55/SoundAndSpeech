// querySelector
class ElementCollection extends Array {}
function $(param) {
  if (typeof param === 'string' || param instanceof String) {
    return new ElementCollection(...document.querySelector(param));
  } else {
    return new ElementCollection(param);
  }
}

// getElementById
function getElementById() {}

// createElement
function createElement() {}
