export type RowData = { id: number; data: string[] };

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

export interface BucketObjectVersion<T> {
  id: string;
  size: number;
  path: string;
  content: T;
  lastModified: Date;
}

export interface BucketObject<T> {
  id: string;
  name: string;
  path: string;
  size: number;
  content: T;
  lastModified: Date;
  versions?: BucketObjectVersion<T>[];
}

export type SignedPost = {
  __typename?: 'SignedPost';
  fields: any;
  url: string;
};

export type Version = {
  __typename?: 'Version';
  id: string;
  lastModified: string;
  name: string;
  path: string;
  size: number;
};

export type File = {
  __typename?: 'File';
  id?: string;
  lastModified: string;
  name: string;
  path: string;
  size: number;
  versions?: Version[];
};

export type Directory = {
  __typename?: 'Directory';
  bucketName?: string;
  name: string;
  path: string;
};
