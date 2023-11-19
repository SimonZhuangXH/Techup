/*
var x = 1
console.log(x) //original value = 1
console.log(x++) // value of x pre-increment = 1
console.log(x) // new value of x = 2

var n = 3
var m = n++ // the value of n pre-increment (3) is assigned to m
console.log("new m:" + (m + 2))
//but if you did n or ++n (the value of n = the value of post increment n)
var m = n
console.log("new m:" + (m + 2))
*/
function fib(n) {
    
    if (n===1) {
        return [0]
    } else if (n===2) {
        return [0,1]
    } else {
        var output = [0,1]
        while (output.length < n) {
            output.push(output[output.length-1]+output[output.length-2])
        }
        return output
    }
}
console.log(fib(5))
