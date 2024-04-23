function downloadFile(url, callbackRef){
    const xhr = new XMLHttpRequest();

    //error handler
    xhr.onerror = (e) => console.log("error");

    //onload handler
    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        console.log(`headers = ${headers}`);
        console.log(`jsonString = ${jsonString}`);
        callbackRef(jsonString);
    }

    xhr.open("GET", url);

    xhr.send();
}

export {downloadFile};