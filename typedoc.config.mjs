import categories from './tools/doccategory.mjs';
import contractMap from './tools/doccontract.mjs';

/** @type {import('typedoc').TypeDocOptions} */
const options = {
  entryPoints: ['./src/index.ts'],
  out: 'docs',
  validation: {
    notDocumented: true,
  },
  treatWarningsAsErrors: true,
  excludePrivate: true,
  categoryOrder: categories,
  excludeExternals: true,
  externalPattern: [],
  externalSymbolLinkMappings: {
    global: contractMap,
  },
};
export default options;
