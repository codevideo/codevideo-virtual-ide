import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

export default  [
  // standard package
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
    },
    plugins: [typescript()],
    external: ["@fullstackcraftllc/codevideo-types", "@fullstackcraftllc/codevideo-virtual-file-explorer"]
  },
  // type declarations
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts", 
        format: "es",
      },
    ],
    plugins: [
      dts(),
    ],
    external: ["@fullstackcraftllc/codevideo-types", "@fullstackcraftllc/codevideo-virtual-file-explorer"]
  },
];

