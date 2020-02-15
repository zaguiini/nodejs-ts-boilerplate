const fs = require('fs')

fs.readFile('./setup-requires.txt', 'utf8', (err, data) => {
  if (err) {
    if (err.errno === -2) return
    throw new Error(err.message)
  }

  console.log(
    ['']
      .concat(data.split('\n'))
      .join(' -r ')
      .trim()
  )
})
