var DefaultLargeFile = 5000000

async function ReadFileToURL(file,MaxFileSize) {
     return new Promise((resolve, reject) => {

          if (!file) {
               reject("Error! No File! ┑(￣Д ￣)┍")
          }

          console.log(file.size)

          if (MaxFileSize == null) {
               MaxFileSize = DefaultLargeFile
          }

          if (file.size > MaxFileSize && !confirm(`⚠️NEWTUBE WARNING!⚠️

Your file size : ${numberWithCommas(file.size)} bytes.
Recommend file size : lower than ${numberWithCommas(MaxFileSize)} bytes.

Your file is quite large. (It may cause lag!)

I recommend do one of these.
- compress file
- (image) resize it
- (image) Use image URL instead 
- Use Upload api (Make this is the last choice)

Are you want to continue?`)) {
     reject("Error! You cancel to upload!")
}

          var reader = new FileReader();

          reader.addEventListener('loadend', async () => {
               resolve(reader.result)
          })

          try {
               reader.readAsDataURL(file);
          } catch (error) {
               reject(error)
          }
          
     })
}