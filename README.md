**\*\*This library is still under development 0.x and should not be used for production, the API could change and it is not recommended for use at the current moment in time.\*\***

---

# recharts-toolkit
Recharts-toolkit is the **unofficial** wrapper library that provides out of the box interactive graphing components and more. While Recharts aims to keep its "API surface small and straightforward", it's quite limited and requires tedious workarounds for more complex requirements. The purpose of this library is to make recharts more extensible and provide tools to make your graphs interactive all while being a 'thin' layer on top of recharts. Recharts-toolkit is compatible with your existing recharts graph definition. 

## Example

```javascript
<Toolkit>
    <ToolBar>
        <ZoomIn />
        <ZoomOut />
    </ToolBar>

    <LineChart
        width={400}
        height={400}
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
        <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
    </LineChart>
</Toolkit>

```
see `/demo` for more examples
## installation

### npm/yarn

```
# latest stable
$ npm install recharts recharts-toolkit 

# or using yarn
$ yarn add recharts recharts-toolkit 
```

### umd
The UMD build is also available on unpkg.com:
```javascript
 <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
 <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
 <script src="https://unpkg.com/recharts/umd/Recharts.js"></script>
 <script src="https://unpkg.com/recharts-toolkit/umd/RechartsToolkit.js"></script>
```
Then you can find the library on `window.Recharts` and `window.RechartsToolkit`.

### dev build

```
$ git clone https://github.com/Heston1/recharts-toolkit.git
$ cd recharts-toolkit
$ npm install # or yarn
$ npm run build  #or yarn build
```

## Contribution
Feel free to contribute! 

## Limitations
`TODO`


