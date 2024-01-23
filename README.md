<p align="center"><img
  src="logo.svg"
  alt="nouvell logo" /></p>
 
 <p align="center">
 <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/ZyriabDsgn/polaris-file-explorer">
<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/zyriabdsgn/polaris-file-explorer">
<img alt="GitHub" src="https://img.shields.io/github/license/zyriabdsgn/polaris-file-explorer">
</p>

File explorer made with Shopify's React library "Polaris", React hooks and Buckaroo (SDK)

## Installation

Until a NPM package is made available, you need to download this repo's content and include the files inside the `src` folder in your frontend folders.  
For example, you can put the files in `your_project/src/utils/pfx/`.

**Note**: This implementation makes use of Auth0, but I'd like to let the user (dev) choose in future versions. At the moment, you need to wrap your application in Auth0 `AuthProvider` component in order for it to work.

Lastly, install PFx dependencies with the following commands:  
`npm install typescript @auth0/auth0-react @shopify/polaris @shopify/polaris-icons papaparse react react-i18next normalize-path`  
`npm install -D @types/papaparse @types/normalize-path @types/node @types/react`

Since this implementation of PFx is currently based on Buckaroo, I recommend you check out [Buckaroo-SDK](https://www.github.com/ZyriabDsgn/Buckaroo) and, optionnaly, [Buckaroo](https://www.github.com/ZyriabDsgn/Buckaroo) to understand what is going on behind the scenes.

## Usage

Simply import the hook `useFileExplorer` from `your_project/src/utils/pfx/utils/hooks` and use the components it returns.

**Note**: some parts of this hook are pretty opinionated because this is a little side-project originally made to be used with ShopiCSV and I upgrade it as I need (i.e.: the use of `papaparse` and CSV-oriented hardcoded stuff).  
I will eventually make PFx way more multi-usage and less-opinionated as I'd like to transform it to a true file explorer for any kind of projects making use of AWS S3 with pretty much all types of files.

### Example

Simplified version of the PFx implementation you can find in [ShopiCSV](https://demo.shopicsv.app/).

```tsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useFileExplorer from './utils/pfx/hooks/useFileExplorer';
import { FileInput } from './utils/pfx/definitions/custom';
import { deleteObject } from './utils/pfx/utils/buckaroo/deleteObject';
import { Layout } from '@shopify/polaris';

async function foo() {
  const [isLoading, setIsLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();
  const { FileCard, fileCardProps, PreviewCard, previewCardProps } =
    useFileExplorer({
      path: '', // get the entirety of the connected user folder's contents
      fileType: 'text/csv', // only CSV is supported in v0.1.x,
      onFileLoad: handleFileLoad,
      onDelete: handleDelete,
    });

  async function handleFileLoad(args: {
    file: File;
    path: string;
    versionId?: string;
  }) {
    setIsLoading(true);
    const tmpParsed: RowData[] = [];

    Papa.parse<string[]>(args.file, {
      worker: true,
      step: (row: any) => {
        const dt = { data: row.data, id: tmpParsed.length };
        tmpParsed.push(dt);
      },
      complete: async () => {
        // Call rendering logic
        setIsLoading(false);
      },
    });
  }

  async function handleDeleteFile(args: FileInput) {
    const alreadyLoading = isLoading;

    setIsLoading(true);

    const token = await getAccessTokenSilently();

    try {
      await deleteObject({ ...args, token });
    } catch (e) {
      console.log(e);
    }

    setIsLoading(alreadyLoading ? true : false);
  }

  return (
    <Layout>
      <Layout.Section secondary>
        <FileCard {...fileCardProps} />
      </Layout.Section>
      <Layout.Section>
        <PreviewCard {...previewCardProps} />
      </Layout.Section>
    </Layout>
  );
}
```

## Contributing

This project has a long way to go, feel free to send a PR, this is a small side project and if you want to add a feature, spot any error in the code or README, I would appreciate your help 🙂

## License

This software is under the [MIT](https://choosealicense.com/licenses/mit/) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. (Do whatever you want with it 🤙).
