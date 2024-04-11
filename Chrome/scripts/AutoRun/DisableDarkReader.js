async function DisableDarkReader() {
     var lock = document.createElement('meta');
     lock.name = 'darkreader-lock';
     var Head = await GetDocumentHead()
     Head.appendChild(lock);
} 

DisableDarkReader()