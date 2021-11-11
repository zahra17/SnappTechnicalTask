export class Lock {
  public status: boolean = false

  public promise: Promise<any> = Promise.resolve()

  private resolver: (value?: any) => void = () => {}

  createLock(): Lock {
    if (this.status) return this

    this.promise = new Promise(resolve => {
      this.status = true
      this.resolver = resolve
    })
    return this
  }

  resolveLock() {
    this.status = false
    this.resolver()
  }
}
