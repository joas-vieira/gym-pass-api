export class LateCheckInError extends Error {
  constructor() {
    super('Check-in can only be validated within 20 minutes of creation');
  }
}
