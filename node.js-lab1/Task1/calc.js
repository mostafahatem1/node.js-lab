const [, , action, ...numbers] = process.argv;

function sum(numbers) {
  return numbers.reduce((a, c) => a + Number(c), 0);
}

function sub(numbers) {
  return numbers.slice(1).reduce((a, c) => a - Number(c), Number(numbers[0]));
}

function mult(numbers) {
  return numbers.reduce((a, c) => a * Number(c), 1);
}
function div(numbers) {
    return Number(numbers[1]) === 0 ? console.log("can not divide by zero") :
    numbers.slice(1).reduce((a, c) => a / Number(c), Number(numbers[0]));
} 

let result;

switch (action) {
  case "sum":
    result = sum(numbers);
    break;
  case "sub":
    result = sub(numbers);
    break;
  case "mult":
    result = mult(numbers);
    break;
  case "div":
    result = div(numbers);
    break;
  default:
    console.log("invalid action");
}

console.log("your result is: ", result);