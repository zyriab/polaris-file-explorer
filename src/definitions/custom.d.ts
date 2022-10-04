export type RowData = { id: number; data: string[] };

export interface BucketObjectVersion {
  id: string;
  size: number;
  path: string;
  content: RowData[];
  lastModified: Date;
}

export interface BucketObject {
  id: string;
  name: string;
  path: string;
  size: number;
  content: RowData[];
  lastModified: Date;
  versions?: BucketObjectVersion[];
}

export interface BucketObjectInfo {
  fileName: string;
  path: string;
  versionId?: string;
}

export interface FileInput {
  fileName: string;
  path: string;
  root?: string;
  versionId?: string;
  bucketName?: string;
}

export interface TokenizedFileInput extends FileInput {
  token: string;
}
