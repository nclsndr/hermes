/* ------------------------------------------
   Dashboard static server
--------------------------------------------- */
const path = require('path')
const fs = require('fs')

const getFileStructure = require('hermes-dashboard')
const Router = require('express').Router

const createDashboardRouter = () => {
  const router = Router()
  const { rootPath } = getFileStructure() // { list }
  const indexPath = path.join(rootPath, 'index.html')
  router.get('/*', (req, res) => {
    const maybeFilePath = path.resolve(rootPath, ...req.url.split('/'))
    fs.stat(maybeFilePath, (err, stats) => {
      if (err) {
        return res.sendFile(indexPath)
      }
      if (stats.isDirectory()) {
        return res.sendFile(indexPath)
      }
      return res.sendFile(maybeFilePath)
    })
  })
  return router
}

module.exports = createDashboardRouter
