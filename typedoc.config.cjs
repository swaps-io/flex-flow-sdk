/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['./src/index.ts'],
  out: 'docs',
  validation: {
    notDocumented: true,
  },
  treatWarningsAsErrors: true,
  excludePrivate: true,
  categoryOrder: [
    '*',
  ],
  excludeExternals: true,
  externalPattern: [],
};
