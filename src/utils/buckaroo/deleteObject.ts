import { deleteOneFile, deleteDirectory } from './utils/queries.utils';
import isDirectory from './utils/isDirectory.utils';
import formatPath from './utils/formatPath.utils';
import { TokenizedFileInput } from './definitions/custom';

export default async function deleteObject(args: TokenizedFileInput) {
  try {
    if (isDirectory(args.fileName)) {
      await deleteDirectory({
        ...args,
        path: formatPath(`${args.path}/${args.fileName}`),
      });
      return;
    }

    await deleteOneFile(args);
  } catch (e) {
    throw e;
  }
}
