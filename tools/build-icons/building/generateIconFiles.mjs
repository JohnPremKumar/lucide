import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { readSvg, toPascalCase } from '../../../scripts/helpers.mjs';

export default ({
  iconNodes,
  outputDirectory,
  template,
  showLog = true,
  iconFileExtension = '.js',
  pretty = true,
  iconsDir,
}) => {
  const icons = Object.keys(iconNodes);
  const iconsDistDirectory = path.join(outputDirectory, `icons`);

  if (!fs.existsSync(iconsDistDirectory)) {
    fs.mkdirSync(iconsDistDirectory);
  }

  const writeIconFiles = icons.map(async (iconName) => {
    const location = path.join(iconsDistDirectory, `${iconName}${iconFileExtension}`);
    const componentName = toPascalCase(iconName);

    let { children } = iconNodes[iconName];
    children = children.map(({ name, attributes }) => [name, attributes]);

    const getSvg = () => readSvg(`${iconName}.svg`, iconsDir);

    const elementTemplate = template({ componentName, iconName, children, getSvg });
    const output = pretty
      ? prettier.format(elementTemplate, {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          parser: 'babel',
        })
      : elementTemplate;

    await fs.promises.writeFile(location, output, 'utf-8');
  });

  Promise.all(writeIconFiles)
    .then(() => {
      if (showLog) {
        console.log('Successfully built', icons.length, 'icons.');
      }
    })
    .catch((error) => {
      throw new Error(`Something went wrong generating icon files,\n ${error}`);
    });
};
