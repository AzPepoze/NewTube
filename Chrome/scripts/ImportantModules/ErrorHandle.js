window.onerror = async function (msg, source, lineNo, columnNo, error) {
     console.log("--------------")
     console.log("NEWTUBE_ERROR")
     console.log(msg)
     console.log(lineNo)
     console.log("--------------")
     return true;
}