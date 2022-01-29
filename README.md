**This library is still under development 0.x and should not be used for production**

---

# recharts-toolkit
Recharts-toolkit is a wrapper library that provides out of the box interactive graphing components and more. While Recharts aims keeps its "API surface small and straightforward",
it's quite limited and requires tedious workarounds for more complex requirements. The purpose of this library is to make recharts more extensible and provide tools
to make your graphs interactive whilst remaining a 'thin' layer on top of recharts and compatible with existing graph definitions (including future versions). 

## installation

### npm/yarn

```
# latest stable
$ npm install recharts && recharts-toolkit 

# or using yarn
$ yarn add recharts && recharts-toolkit 
```

### umd
The UMD build is also available on unpkg.com:

```
 <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
 <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
 <script src="https://unpkg.com/recharts/umd/Recharts.min.js"></script>
 <script src="https://unpkg.com/recharts/umd/Recharts-toolkit.min.js"></script>
```

Then you can find the library on `window.Recharts` and `window.Recharts-toolkit`.

TODO

### dev build

```
$ git clone https://github.com/recharts/recharts-toolkit.git
$ cd recharts-toolkit
$ npm install #or yarn
$ npm run build #or yarn build
```

## Contribution
Feel free to contribute! 

## Limitations
TODO

