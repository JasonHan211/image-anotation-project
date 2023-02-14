let obj = {a:1, b:2, c:{d:4, e:5, f:6}};

function copy(obj) {
    let clone = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {

            if (typeof obj[key] == 'object') {
                copy(obj[key]);
            }
            
            clone[key] = obj[key];

        }
    }

    return clone;
}

let obj2 = copy(obj);

obj2.c.f = 10;

console.log(obj);
console.log(obj2);

// Answer
function deepCopy(obj) {
    let newObj = {};
  
    for (let key in obj) {
      let value = obj[key];
      if (typeof value === 'object') {
        newObj[key] = deepCopy(value);
      } else {
        newObj[key] = value;
      }
    }
  
    return newObj;
}

//  lalit@thewalnut.ai
//  humza@thewalnut.ai
