import { randomElement } from "/src/utils.js";

let words1;
let words2;
let words3;

const loadBabble = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = callback;
    xhr.onerror = e => console.log(`In onerror = HTTP Status Code = ${e.target.status}`);
    xhr.open("GET",url);
    xhr.send();
}

const babbleLoaded = (e) => {
    //console.log(`In onload = HTTP Status Code = ${e.target.status}`);
    const xml = e.target.responseText;
    const json = JSON.parse(xml);
    words1 = json.words1;
    words2 = json.words2;
    words3 = json.words3;

    generateTechno(1);

    document.querySelector("#button-gen-1").onclick = () => {generateTechno(1);}
    document.querySelector("#button-gen-5").onclick = () => {generateTechno(5);}
}

const generateTechno = (num) =>{
    let html = ``;
    for(let i = 0; i<num; i++){
        //console.log(words1);
        //console.log(words1.length);
        html += `<p>${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}</p>`;
    }
    //console.log(html);
    document.querySelector("#output").innerHTML = html;
}

const init = () =>{
    loadBabble("data/babble-data.json", babbleLoaded)
}

window.onload = init;
