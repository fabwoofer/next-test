// codegen.ts — GraphQL Code Generator configuration
//
// Workflow: edit or add a .graphql file in lib/graphql/query/, then run
// `yarn codegen` to regenerate lib/graphql/generated/. Commit both the
// .graphql source and the generated output.
//
// Note: the generated types in lib/graphql/generated/ are NOT currently used
// by the app — queries.ts has hand-written types instead. The generated output
// is available if you want to migrate to it.
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://develop.api.samansa.com/graphql',
  documents: ['lib/graphql/query/*.graphql'],
  generates: {
    './lib/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: [],
    },
  },
};

export default config;
