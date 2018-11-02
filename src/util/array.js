// used in a reduce function
export const tupleToObject = (acc, [key, val]) => {
  acc[key] = val
  return acc
}

// used in a reduce function
export const groupCollections = (collectionsAcc, collection) => {
  const foundCollection = collectionsAcc.find(
    inserted => inserted.static === collection.static
  )
  if (foundCollection) {
    foundCollection.push(...collection)
  } else {
    collectionsAcc.push(collection)
  }
  return collectionsAcc
}
