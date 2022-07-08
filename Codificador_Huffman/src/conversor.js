import {createInterface} from "readline"
import { readFile, writeFile } from 'fs';

//      node ./src/conversor.js

function encode(text, codes) {
    var result = [];
    for (var i = 0; i < text.length; i++) {
        result.push(codes.get(text[i]));
    }
    return result;
}

function decode(text, codes) {
    var result = '';
    var _loop_1 = function (i) {
        codes.forEach(function (code, symbol) {
            if (text[i] === code) {
                result += symbol;
            }
        });
    };
    for (var i = 0; i < text.length; i++) {
        _loop_1(i);
    }
    return result;
}

function getCodesFromText(text) {
    frequencyArr = getFrequency(text);
    var symbols = frequencyArr.map(function (item) { return item[0]; });
    var tree = getTree(frequencyArr);
    var codes = new Map(); 
    symbols.forEach(function (element) {
        codes.set(element, getSymbolCode(tree, element));
    });
    return codes;
}

function getSymbolCode(tree, symbol, code) {
    if (code === void 0) { code = ''; }
    var arr = [];
    if (typeof tree.leafs === undefined) {
        return code;
    }
    arr = tree.leafs;
    if (arr[0].symbols.length === 1 && arr[0].symbols[0] === symbol)
        return code + 0;
    if (arr[0].symbols.length === 1 && arr[0].symbols[0] !== symbol) {
        if (arr[1].symbols.length === 1 && arr[1].symbols[0] === symbol)
            return code + 1;
        if (arr[1].symbols.includes(symbol) === true)
            return getSymbolCode(arr[1], symbol, code + 1);
    }
    if (arr[1].symbols.length === 1 && arr[1].symbols[0] === symbol)
        return code + 1;
    if (arr[1].symbols.length === 1 && arr[1].symbols[0] !== symbol) {
        if (arr[0].symbols.length === 1 && arr[0].symbols[0] === symbol)
            return code + 0;
        if (arr[0].symbols.includes(symbol) === true)
            return getSymbolCode(arr[0], symbol, code + 0);
    }
    if (arr[0].symbols.length >= 2 && arr[0].symbols.includes(symbol))
        return getSymbolCode(arr[0], symbol, code + 0);
    if (arr[1].symbols.length >= 2 && arr[1].symbols.includes(symbol))
        return getSymbolCode(arr[1], symbol, code + 1);
}

function getFrequency(text) {
    let freq = new Map();
    for (var i = 0; i < text.length; i++) {
        var counter = 0;
        for (var j = 0; j < text.length; j++) {
            if (!freq.has(text[i])) {
                if (text[i] === text[j] && i !== j) {
                    counter++;
                }
            }
        }
        if (!freq.has(text[i])) {
            freq.set(text[i], counter + 1);
        }
    }
    return Array.from(freq).sort(function (a, b) { return b[1] - a[1]; }); //Descending sort
}

function getTree(arr) {
    arr = arr.map(function (elem) { return ({
        symbols: [elem[0]],
        weight: elem[1],
        leafs: [],
    }); });
    var min1;
    var min2;
    var node;
    while (arr.length > 2) {
        min1 = searchMinWeightNode(arr);
        arr.splice(arr.indexOf(min1), 1);
        min2 = searchMinWeightNode(arr);
        arr.splice(arr.indexOf(min2), 1);
        node = createNode(min1, min2);
        arr.push(node);
    }
    return createNode(arr[0], arr[1]);
}

function createNode(node1, node2) {
    var weight = node1.weight + node2.weight;
    var symbols = node1.symbols.concat(node2.symbols);
    var leafs = [node1, node2];
    return {
        symbols: symbols,
        weight: weight,
        leafs: leafs,
    };
}

function searchMinWeightNode(arr, minNumber) {
    if (minNumber === void 0) { minNumber = -1; }
    var min = 9999;
    var result;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].weight <= min && arr[i].weight >= minNumber) {
            min = arr[i].weight;
            result = arr[i];
        }
    }
    return result;
}

function getAscii(data) {
    let ascii = ''
    for (let i = 0; i < data.length; i++) {
        ascii += '00'.concat(data.charCodeAt(i).toString(2)).slice(-8) + ' ';
    }
    return ascii
}

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})
var frequencyArr;
let caminho = '';
let codes;
let txtEncode;
readline.question(`Digite o caminho do arquivo para codifica-lo ex:'./src/arquivo)':`, c => {
    caminho += ('' + c)
    readFile(caminho, 'utf-8', function (err, text) { 
        if(err) return err 
        codes = getCodesFromText(text);           
        txtEncode = encode(text, codes)
        let ascii = getAscii(text)
        writeFile('./src/cods/arq_codificado.txt', txtEncode.toString(), function(err){
            if(err) return err
             
            console.log("\nTexto: " + text + "\nTexto comprimido: " + txtEncode + "\nTamanho do texto comprimido: " + txtEncode.length +
                    "\nASCII: " + ascii + "\nTamanho em ASCII: " + ascii.length + "\nCompressao: " + txtEncode.length + ' / ' + ascii.length + ' = ' + (txtEncode.length / ascii.length).toFixed(4));

            console.log("\nArquivo codificado em ./src/cods/arq_codificado.txt\n") 
            
            //Decode
            caminho = '';
            readline.question(`Digite o caminho do arquivo para decodifica-lo ex:'./src/arquivo)':`, c => {
                caminho += ('' + c)
                readFile(caminho, 'utf-8', function (err, text) { 
                    if(err) return err                
                    let txtDecode = decode(text, codes)
                    writeFile('./src/cods/arq_decodificado.txt', txtDecode, function(err){
                        if(err){
                            return err
                        } 
                        console.log("\nTexto codificado: " + text + "\nTexto decodificado: " + txtDecode + "\nTamanho do texto decodificado: " + txtEncode.length)
            
            
                        console.log("\nArquivo decodificado em ./src/cods/arq_decodificado.txt\n")       
                    })
                                
                    readline.close()              
                });          
            });
            
        })
       
    });          
});

