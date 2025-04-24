import { SiteConfig, defaultConfig } from './siteConfig';

export class ConfigService {
  private static instance: ConfigService;
  private configUrl: string;

  private constructor() {
    // Default to a local JSON file, but this can be changed to any external source
    this.configUrl = '/config.json';
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public setConfigUrl(url: string): void {
    this.configUrl = url;
  }

  public async fetchConfig(): Promise<SiteConfig> {
    try {
      const response = await fetch(this.configUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }
      const config = await response.json();
      return this.validateConfig(config);
    } catch (error) {
      console.error('Error fetching config:', error);
      return defaultConfig;
    }
  }

  private validateConfig(config: any): SiteConfig {
    // Basic validation to ensure the config has the required structure
    const requiredSections = ['business', 'about', 'services', 'testimonials', 'contact'];
    const missingSections = requiredSections.filter(section => !config[section]);
    
    if (missingSections.length > 0) {
      console.error(`Missing required sections in config: ${missingSections.join(', ')}`);
      return defaultConfig;
    }

    return config as SiteConfig;
  }
} 