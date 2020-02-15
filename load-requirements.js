const fs = require('fs')

fs.readFile('./setup-requires.txt', 'utf8', (error, data) => {
  if (error) {
    if (error.errno === -2) return
    throw new Error(error.message)
  }

  console.log(
    ['']
      .concat(data.split('\n'))
      .join(' -r ')
      .trim()
  )
})
