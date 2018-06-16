/* ------------------------------------------
   File system backend helper
--------------------------------------------- */
const fs = require('fs')
const path = require('path')

const walkSync = (dir, base, filelist) => {
  const files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      base = path.join(base, file)
      filelist = walkSync(path.join(dir, file), base, filelist)
    } else {
      filelist.push(path.join(base, file))
    }
  })
  return filelist
}

const getFileStructure = (base = '') => {
  const buildPath = path.resolve(__dirname, 'build')
  return {
    rootPath: buildPath,
    list: walkSync(buildPath, base)
  }
}

module.exports = getFileStructure
