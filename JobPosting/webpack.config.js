const path = require("path");

module.exports = {
    entry: ["./Scripts/ES6/main.js"],
    output: {
        path: path.resolve(__dirname, "./Scripts/build"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
};