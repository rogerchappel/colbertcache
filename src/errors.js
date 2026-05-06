export class ColbertCacheError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ColbertCacheError';
    this.details = details;
  }
}
