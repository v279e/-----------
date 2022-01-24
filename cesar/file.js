function cesar(str,shift,action) {
//от 1072 до 1103 - русский алфавит 
let newstr="";
if(action=="encode"){
    for(let i=0; i<str.length; i++){
        if(str.codePointAt(i)>=1072 && str.codePointAt(i)<=1103) {
            newstr+=String.fromCharCode((str.charCodeAt(i) + +shift - 1072)%32+1072);
        } 
        else { //для пробелов
            newstr +=String.fromCharCode(str.charCodeAt(i));
        }
    }
}
else {
    for(let i=0; i<str.length; i++){
        if(str.codePointAt(i)>=1072 && str.codePointAt(i)<=1103) {
            newstr+=String.fromCharCode((str.charCodeAt(i) - (+shift) - 1072)%32+1072);
        } 
        else { //для пробелов
            newstr +=String.fromCharCode(str.charCodeAt(i));
        }
    }
}
alert(newstr);
console.log(newstr);
}
let str=prompt("Введите текст(маленькими русскими буквами), который необходимо зашифровать или расшифровать","");

let shift=prompt("Введите сдвиг для шифра Цезаря", "3");

let question=prompt("Введите, что надо сделать 'зашифровать' или 'расшифровать'?", "зашифровать");

if(question=="зашифровать") {
    action = 'encode';
}
 else if(question=="раcшифровать") {
    action = 'encode';
}
else{
    alert("Вы ввели неверный текст");
}
cesar(str,shift,action);