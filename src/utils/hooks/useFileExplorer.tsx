import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import FileExplorerFileCard, {
  FileExplorerFileCardProps,
} from '../../components/FileExplorerFileCard/FileExplorerFileCard';
import FileExplorerPreviewCard, {
  FileExplorerPreviewCardProps,
} from '../../components/FileExplorerPreviewCard/FileExplorerPreviewCard';
import FileExplorerTopBar, {
  FileExplorerTopBarProps,
} from '../../components/FileExplorerTopBar/FileExplorerTopBar';
import { listBucketContent } from '../buckaroo/utils/queries.utils';
import {
  BucketObjectInfo,
  FileInput,
  BucketObject,
} from '../../definitions/custom';
import getPathRelativeName from '../tools/getPathRelativeName.utils';
import isDirectory from '../tools/isDirectory.utils';

import './FileExplorer.css';

interface useFileExplorerProps {
  path: string;
  fileType: string;
  onFileLoad: (args: {
    file: File;
    path: string;
    versionId?: string;
    token?: string;
  }) => Promise<void>;
  onUpload: (objInfo: BucketObjectInfo, file: File) => Promise<void>;
  onDelete: (args: FileInput) => Promise<void>;
}

//  TODO: add dropzone

export default function useFileExplorer(props: useFileExplorerProps) {
  const [path, setPath] = useState<string[]>([]);
  const [filesContent, setFilesContent] = useState<BucketObject[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [isFetchingObjects, setIsFetchingObjects] = useState(false);

  const isMounted = useRef(false);
  const fileInputEl = useRef<HTMLInputElement>(null);

  const { getAccessTokenSilently } = useAuth0();

  // file card
  const [selectedFileId, setSelectedFileId] = useState<string>();

  function handleClickUpload() {
    fileInputEl.current?.click();
  }

  async function handleUpload(file: File) {
    if (props.onUpload == null) {
      return;
    }

    const objInfo = {
      fileName: file.name,
      path: [props.path, ...path].join('/'),
      versionId:
        selectedFileId && Number.isNaN(+selectedFileId)
          ? selectedFileId
          : undefined,
    };

    await props.onUpload(objInfo, file);
  }

  async function handleDelete(fileInput: FileInput) {
    setFilesContent((content) =>
      content.filter(
        (o) =>
          o.name !== fileInput.fileName &&
          o.path
            .split('/')
            .slice(1, o.path.length - 1)
            .join('/') !== fileInput.path
      )
    );
    await props.onDelete(fileInput);
  }

  function handleOpenDirectory(name: string, path: string[]) {
    setSelectedFileId(undefined);
    setPath((current) => [...current, ...[getPathRelativeName(name, path)]]);
  }

  function handleClickObject(id: string) {
    const doubleClicked = id === selectedFileId;

    if (doubleClicked) {
      const obj = filesContent.find((x) => x.id === id);

      if (obj == null) {
        return;
      }

      const name = `${obj.path}/${obj.name}`;

      if (obj && isDirectory(getPathRelativeName(name, path))) {
        handleOpenDirectory(name, path);
      }
      return;
    }

    setSelectedFileId(id);
  }

  const fetchData = useCallback(async () => {
    if (isMounted.current) {
      setIsFetchingObjects(true);

      const token = await getAccessTokenSilently();
      const files = await listBucketContent({ token, path: props.path });

      setIsFetchingObjects(false);

      setFilesContent(files);
    }
  }, [getAccessTokenSilently]);

  const fileUploadEl = (
    <input
      ref={fileInputEl}
      onChange={async (e) =>
        e?.target.files ? await handleUpload(e.target.files[0]) : undefined
      }
      type="file"
      accept={props.fileType}
      className="display-none"
      title="Files explorer file upload"
    />
  );

  useEffect(() => {
    // making sure fileInputEl is set
    if (shouldUpdate) setShouldUpdate(false);
  }, [shouldUpdate]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* COMPONENTS PROPS */
  const topBarProps = {
    onClickNewFolder: () => {},
    onClickUpload: handleClickUpload,
    onClickRefresh: fetchData,
  };

  const fileCardProps = {
    content: filesContent,
    selected: selectedFileId,
    setSelected: setSelectedFileId,
    isLoading: isFetchingObjects,
    path,
    setPath,
    onClickUpload: handleClickUpload,
    onClickObject: handleClickObject,
  };

  const previewCardProps = {
    content: filesContent,
    selected: selectedFileId,
    path,
    onLoad: props.onFileLoad,
    onDelete: handleDelete,
    onOpenDirectory: (name: string) => handleOpenDirectory(name, path),
  };

  return {
    TopBar,
    FileCard,
    PreviewCard,
    topBarProps,
    fileCardProps,
    previewCardProps,
    fileUploadEl,
  };
}

function TopBar(props: FileExplorerTopBarProps) {
  return <FileExplorerTopBar {...props} />;
}

function FileCard(props: FileExplorerFileCardProps) {
  return <FileExplorerFileCard {...props} />;
}

function PreviewCard(props: FileExplorerPreviewCardProps) {
  return <FileExplorerPreviewCard {...props} />;
}
