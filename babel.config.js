module.exports = function (api) {
  const isTest = api.env('test');
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};
