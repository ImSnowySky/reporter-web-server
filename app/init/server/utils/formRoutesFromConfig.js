const getAllObjectKeysAsRouteObject = object => {
  const keys = Object.keys(object);
  const pathes = keys.map(key => ({ name: key, childs: [] }));

  pathes.forEach(path => {
    const { name } = path;
    const innerObject = object[name];
    if (!Array.isArray(innerObject)) {
      path.childs = getAllObjectKeysAsRouteObject(innerObject);
    } else {
      path.methods = innerObject;
    }
  });
  return pathes;
};

const getRouteObjectAsURLArray = routeObject => {
  let urls = [];
  if (routeObject.childs && routeObject.childs.length > 0) {
    routeObject.childs.forEach(child => {
      const objectURLS = getRouteObjectAsURLArray(child);
      objectURLS.forEach(url => {
        const updatedURL = url;
        updatedURL.path = `${routeObject.name}\\${url.path}`;
        urls.push(updatedURL);
      })
    });
    return urls;
  } else {
    urls.push({ methods: routeObject.methods, path: routeObject.name })
    return urls;
  }
}

const makeURLsArrayAsSingle = URLs => {
  const singleArray = [];
  URLs.forEach(URLgroup =>
    URLgroup.forEach(URL => singleArray.push(URL)  )  
  );
  return singleArray;
}

const formRoutesFromConfig = config => {
  const routeObjects = getAllObjectKeysAsRouteObject(config);
  const urlsArray = routeObjects.map(routeObject => getRouteObjectAsURLArray(routeObject));
  const routes = makeURLsArrayAsSingle(urlsArray);
  return routes;
}

module.exports = formRoutesFromConfig;