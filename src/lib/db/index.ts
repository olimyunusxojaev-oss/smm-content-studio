import Dexie, { type Table } from 'dexie';
import { HistoryItem } from '@/types/post';

export class ContentStudioDatabase extends Dexie {
  history!: Table<HistoryItem, string>;

  constructor() {
    super('SMMContentStudioDB');
    this.version(1).stores({
      history: 'id, platform, createdAt, isFavorite, topic'
    });
  }
}

export const db = new ContentStudioDatabase();
