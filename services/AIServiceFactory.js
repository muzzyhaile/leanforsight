import { OpenRouterAIService } from './OpenRouterAIService.js';

export class AIServiceFactory {
  /**
   * @param {'openrouter'} [provider]
   */
  static create(provider = 'openrouter') {
    switch (provider) {
      case 'openrouter':
        return new OpenRouterAIService();
      default:
        return new OpenRouterAIService();
    }
  }
}
