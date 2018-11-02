import { ClassCollection } from '../class-collection'

// should be used in a reduce function
export const tupleToObject = (acc, [key, val]) => {
  acc[key] = val
  return acc
}

export const tupleToObjectOfArrays = ((acc, [key, val]) => {
  const array = acc[key] || val
  array.push(val)
  acc[key] = array
  return array
},
{})

export const tupleToGroupedCollections = (acc, [key, val]) => {
  const collection = acc.find(collection => collection.static === key)
  if (collection) {
    collection.push(val)
  } else {
    const newCollection = new ClassCollection(key)
    newCollection.push(val)
    acc.push(newCollection)
  }
  return acc
}

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

// export const findAndReplace = (findFunc) => (array, newItem) => {
// array.map(item =>
// findFunc(item) ?
// )
// findFunc(array, value)
// }
