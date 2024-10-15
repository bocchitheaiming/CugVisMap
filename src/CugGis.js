/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

export default function CugGis() {
  let map = null;

  // 用 reactHook 形式加载地图
  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: "0c1cd8cf9a3534ac31d382a998de238d",
    };

    // 初始化地图
    AMapLoader.load({
      key: "303d13408f77cf102158a612bd67c19a", // 申请好的 Web 端开发者 Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale"], // 需要使用的的插件列表，如比例尺 'AMap.Scale'，支持添加多个如：['...', '...']
    })

      .then((AMap) => {

        var path = [
          [114.622101, 30.460426], [114.622252, 30.458667], [114.622309, 30.45795], [114.622404, 30.457445], [114.622498, 30.456614], [114.622574, 30.456093], [114.622838, 30.454724], [114.621818, 30.454577], [114.617943, 30.454398], [114.616242, 30.454773], [114.61439, 30.455653], [114.613369, 30.456093], [114.611782, 30.456712], [114.610269, 30.4572], [114.610307, 30.458667], [114.610345, 30.459661], [114.612972, 30.459921], [114.614503, 30.460003], [114.617943, 30.460166], [114.619947, 30.460312]
        ];

        var libraryPath = [
          [114.617528, 30.456566], [114.619063,30.456669], [114.61912, 30.456153], [114.61756, 30.456076]];

        var canteenPath = [[114.617976,30.4552], [114.618511,30.455229], [114.618542,30.454725], [114.618008,30.454695]];

        var stadiumPath = [[114.620822,30.458296], [114.62192,30.458371], [114.62198,30.457638], [114.62087,30.457561]];

        const mask = [path];

        var buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20], heightfactor: 2 });

        var options =
        {
          hideWithoutStyle: true,
          areas: [{
            path: path
          }]
        };

        buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle

        // 创建自定义多边形, 是以canteenPath为示例，其他也是一样，注意修改下述的变量名
        const canteenPolygon = new AMap.Polygon({
          path: libraryPath,
          strokeColor: "#2b8cbe",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#ccebc5",
          zIndex: 50,
        });

        map = new AMap.Map("container", { // 设置地图容器id
          mask: mask,
          viewMode: "3D", // 是否为3D地图模式
          zoom: 18, // 初始化地图级别，越大比例尺越小
          zooms: [5, 20], // 设置地图缩放范围
          center: [114.61716, 30.457544], // 初始化地图中心点位置
          pitch: 70, // 地图俯仰角度，有效范围 0 度- 83 度
          scrollWheel: true, // 启用滚轮缩放
          rotateEnable: true, // 是否开启地图旋转交互
          zoomEnable: true, // 是否开启地图缩放交互
          layers: [
            new AMap.TileLayer.Satellite({ tileSize: 256 }),
            new AMap.createDefaultLayer({
              zooms: [3, 20], // 可见级别
              visible: true, // 是否可见
              opacity: 1, // 透明度
              zIndex: 0, // 叠加层级
            }),
            buildingLayer
          ],
        });

        canteenPolygon.on('mouseover', () => {
          canteenPolygon.setOptions({
            fillOpacity: 0.7,
            fillColor: '#7bccc4'
          })
        })
        canteenPolygon.on('mouseout', () => {
          canteenPolygon.setOptions({
            fillOpacity: 0.5,
            fillColor: '#ccebc5'
          })
        })

        map.add(canteenPolygon);
        map.setFitView([canteenPolygon]);
      })

      .catch((e) => {
        console.log(e);
      });

    return () => {
      map?.destroy();
    };
  }, []);

  return (
    <div
      id="container"
      className="container"
      style={{ height: "800px" }}
    ></div>
  );
}

