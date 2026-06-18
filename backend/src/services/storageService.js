import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class StorageService {
  constructor() {
    this.dataDir = join(__dirname, '../../data');
    this.ensureDataDir();
    this.db = null;
    this.initialized = false;
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  async init() {
    if (this.initialized) return;
    
    const file = join(this.dataDir, 'db.json');
    const adapter = new JSONFile(file);
    this.db = new Low(adapter, { 
      proxies: { proxies: [] },
      traffic: { traffic: [] },
      scenarios: { scenarios: [] }
    });
    
    await this.db.read();
    this.initialized = true;
  }

  async read(collection) {
    await this.init();
    return this.db.data[collection] || null;
  }

  async write(collection, data) {
    await this.init();
    this.db.data[collection] = data;
    await this.db.write();
    return true;
  }

  async update(collection, updater) {
    await this.init();
    const data = await this.read(collection);
    const updated = updater(data);
    this.db.data[collection] = updated;
    await this.db.write();
    return updated;
  }
}

export const storageService = new StorageService();
