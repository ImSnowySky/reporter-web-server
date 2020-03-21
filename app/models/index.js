const Filehound = require('filehound');

const getModels = async () => {
  const modelPaths = await Filehound.create()
    .path('app/models')
    .directory()
    .find();

  return modelPaths.map(path => path.replace('app\\models\\', '').replace('Model', ''))
}

module.exports = { getModels };
