const path = require('path')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const parser = require('gitignore-parser')

const extensions = ['.ts', '.tsx', '.js', '.jsx']

const root = process.cwd()

const createCopy = (isDev, source, dest) => {
  if (isDev) {
    chokidar.watch(source).on('all', (event, path) => {
      const destPath = path.replace(source, dest)
      switch (event) {
        case 'add':
        case 'change':
          return fs.copyFile(path, destPath)

        case 'addDir':
          return fs.mkdirSync(destPath, {recursive: true})

        case 'unlink':
        case 'unlinkDir':
          return fs.removeSync(destPath)
      }
    })
  } else {
    fs.copySync(source, dest)
  }
}

const routesConfig = isDev => {
  const pagesPath = path.resolve(root, 'src', 'pages')
  const sectionsPath = path.resolve(root, 'src', 'sections')

  const ignorePath = path.resolve(pagesPath, '.gitignore')
  const gitignore = parser.compile(fs.readFileSync(ignorePath, 'utf8'))

  // clear pages directory
  fs.readdirSync(pagesPath).forEach(pageName => {
    if (gitignore.denies(pageName)) {
      fs.removeSync(path.resolve(pagesPath, pageName))
    }
  })

  fs.readdirSync(sectionsPath).forEach(sectionName => {
    const sectionPath = path.resolve(sectionsPath, sectionName)
    const sectionPagesPath = path.resolve(sectionPath, 'pages')
    const routesPath = path.resolve(sectionPath, 'routes.js')

    const routes = require(routesPath)

    routes.forEach(route => {
      const page = route.page.replace(/^(\/|\\)/, '.$1')
      const pattern = route.pattern.replace(/^(\/|\\)/, '.$1')
      const source = path.resolve(sectionPagesPath, page)
      const dest = path.resolve(pagesPath, pattern)

      if (fs.existsSync(source)) {
        createCopy(isDev, source, dest)
      } else {
        extensions.forEach(ext => {
          if (fs.existsSync(source + ext)) {
            createCopy(isDev, source + ext, dest + ext)
          }
        })
      }
    })
  })
}

module.exports = routesConfig
