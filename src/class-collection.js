export class ClassCollection extends Array {
  constructor(classDefinition, items = []) {
    super()
    this.push(...items)
    this.static = classDefinition
  }
}
