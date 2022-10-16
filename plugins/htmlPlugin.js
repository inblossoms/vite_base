module.exports = function (option) {
  return {
    transformIndexHtml: {
      enforce: "pre",
      transform: (html, ctx) => {
        console.log("html: ", html);

        return html.replace(/<%= title %>/g, option.inject.data.title);
      },
    },
  };
};
