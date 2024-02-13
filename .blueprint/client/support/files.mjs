const MAIN_DIR = 'src/main/';
const CLIENT_MAIN_SRC_DIR = `${MAIN_DIR}webapp/`;
const CLIENT_TEMPLATES_SRC_DIR = CLIENT_MAIN_SRC_DIR;
export const replaceEntityFilePath = (data, filepath) =>
  filepath
    .replace(/_entityFolder_/, data.entityFolderName)
    .replace(/_entityFile_/, data.entityFileName)
    .replace(/_entityModel_/, data.entityModelFileName);

export function clientRootTemplatesBlock(blockOrRelativePath = '') {
  return clientBlock({
    srcPath: '',
    destProperty: 'clientRootDir',
    blockOrRelativePath,
  });
}
export function clientSrcTemplatesBlock(blockOrRelativePath = '') {
  return clientBlock({
    srcPath: CLIENT_TEMPLATES_SRC_DIR,
    destProperty: 'clientSrcDir',
    blockOrRelativePath,
  });
}

export function clientApplicationTemplatesBlock(blockOrRelativePath = '') {
  return clientBlock({
    srcPath: CLIENT_TEMPLATES_SRC_DIR,
    relativeToSrc: 'app/',
    destProperty: 'clientSrcDir',
    blockOrRelativePath,
  });
}

function clientBlock({ srcPath, destProperty, blockOrRelativePath = '', relativeToSrc = '' }) {
  const block = typeof blockOrRelativePath !== 'string' ? blockOrRelativePath : undefined;
  const blockRenameTo = typeof block?.renameTo === 'function' ? block.renameTo : undefined;
  const relativePath = typeof blockOrRelativePath === 'string' ? blockOrRelativePath : blockOrRelativePath.relativePath ?? '';
  return {
    path: `${srcPath}${relativeToSrc}${relativePath}`,
    ...block,
    renameTo(data, filePath) {
      return `${data[destProperty]}${relativeToSrc}${replaceEntityFilePath(data, relativePath) ?? ''}${
        replaceEntityFilePath(data, blockRenameTo?.call?.(this, data, filePath) ?? filePath) ?? ''
      }`;
    },
  };
}
