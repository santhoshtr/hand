export default class Events {
  constructor () {
    this.topics = {}
  }

  subscribe (topic, listener) {
    if (!topic) {
      throw Error('Undefined topic')
    }
    // Create the topic's object if not yet created
    if (!this.topics.hasOwnProperty(topic)) {
      this.topics[topic] = []
    }
    // Add the listener to queue
    let index = this.topics[topic].push(listener) - 1
    // Provide handle back for removal of topic
    return {
      remove: () => {
        delete this.topics[topic][index]
      }
    }
  }

  publish (topic, info) {
    if (!topic) {
      throw Error('Undefined topic')
    }
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if (!this.topics.hasOwnProperty(topic)) {
      return
    }
    // Cycle through topics queue, fire!
    this.topics[topic].forEach(function (item) {
      item(info !== undefined ? info : {})
    })
  }
}
