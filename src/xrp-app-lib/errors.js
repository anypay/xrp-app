class XError extends Error {
    constructor(message) {
        super(message)
        this.message = message
        Error.captureStackTrace(this, this.constructor)
    }
}

class InvalidPrivateKey extends Error {
    constructor(message) {
        super(message)
        this.type = 'InvalidPrivateKey'
    }
}

class InvalidPublicKey extends Error {
    constructor(message) {
        super(message)
        this.type = 'InvalidPublicKey'
    }
}

export default {
  InvalidPrivateKey: InvalidPrivateKey,
  InvalidPublicKey: InvalidPublicKey
};

