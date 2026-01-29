module.exports = {
  babel: {
    plugins: [
      [
        '@nutanix-ui/babel-plugin-prism-import',
        {
          libraryName: '@nutanix-ui/prism-reactjs',
          style: 'css',
        },
      ],
    ],
  },
};
