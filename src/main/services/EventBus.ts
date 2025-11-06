import EventEmitter from 'node:events'

/**
 *  @description
 *  Register all `EventEmitters` across the app. \
 *  Remove them on electron quit.
 */
class EventBus {
  private emitters: Map<string, EventEmitter> = new Map()

  register(name: string): EventEmitter {
    this.emitters.set(name, new EventEmitter())
    return this.getEmitter(name)
  }

  unregister(name: string): void {
    this.emitters.delete(name)
  }

  getEmitter(name: string): EventEmitter {
    const ee = this.emitters.get(name)
    if (!ee) throw new Error('EE Not found')
    return ee
  }

  cleanupAll(): void {
    for (const emitter of this.emitters) {
      emitter[1].removeAllListeners()
    }
    this.emitters.clear()
  }
}
let ref: EventBus | undefined
if (!ref) ref = new EventBus()
export const AppEventBus = ref
