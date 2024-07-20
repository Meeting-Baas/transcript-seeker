interface StorageBucket {
  name: string;
  getDirectory(): Promise<FileSystemDirectoryHandle>;
}

interface NavigatorStorage extends Navigator {
  storageBuckets: {
    open(
      name: string,
      options?: { durability?: 'relaxed' | 'strict'; persisted?: boolean },
    ): Promise<StorageBucket>;
  };
}

export class StorageBucketAPI {
  private bucketName: string;
  private bucket: StorageBucket | null;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
    this.bucket = null;
  }

  async init(): Promise<void> {
    try {
      this.bucket = await (navigator as NavigatorStorage).storageBuckets.open(this.bucketName, {
        durability: 'relaxed',
        persisted: true,
      });
      console.log(`Bucket ${this.bucket.name} initialized.`);
    } catch (error) {
      console.error(`Failed to initialize bucket: ${(error as Error).message}`);
    }
  }

  async set(fileName: string, content: string | Blob): Promise<void> {
    try {
      if (!this.bucket) {
        throw new Error('Bucket not initialized');
      }
      const directoryHandle = await this.bucket.getDirectory();
      let fileHandle: FileSystemFileHandle;
      try {
        fileHandle = await directoryHandle.getFileHandle(fileName);
      } catch (error) {
        console.log(`File ${fileName} does not exist. Creating new file.`);
        fileHandle = await directoryHandle.getFileHandle(fileName, {
          create: true,
        });
      }

      const writable = await fileHandle.createWritable({
        keepExistingData: true,
      });
      await writable.write(content);
      await writable.close();
      console.log(`Content successfully written to ${fileName} in bucket ${this.bucket.name}`);
    } catch (error) {
      console.error(`Failed to write to file: ${(error as Error).message}`);
    }
  }

  async get(fileName: string): Promise<Blob | undefined> {
    try {
      if (!this.bucket) {
        throw new Error('Bucket not initialized');
      }
      const directoryHandle = await this.bucket.getDirectory();
      const fileHandle = await directoryHandle.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const blob = await file.slice();
      console.log(`Retrieved blob from ${fileName}`);
      return blob;
    } catch (error) {
      console.error(`Failed to read file: ${(error as Error).message}`);
    }
  }

  async del(fileName: string): Promise<void> {
    try {
      if (!this.bucket) {
        throw new Error('Bucket not initialized');
      }
      const directoryHandle = await this.bucket.getDirectory();
      await directoryHandle.removeEntry(fileName);
      console.log(`File ${fileName} deleted from bucket ${this.bucket.name}`);
    } catch (error) {
      console.error(`Failed to delete file: ${(error as Error).message}`);
    }
  }
}
