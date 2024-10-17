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

        var libraryPath2 = [
          [114.617359, 30.456662], [114.619164, 30.456835], [114.619288, 30.456111], [114.617266, 30.456031]];
        var canteenPath2 = [[114.617893, 30.455249], [114.618554, 30.455309], [114.618619, 30.454683], [114.617941, 30.454627]];
        var stadiumPath2 = [[114.620597, 30.458387], [114.622098, 30.458489], [114.622118, 30.457573], [114.620751, 30.457489]];

        var libraryPath = [
          [114.617528, 30.456566], [114.619063, 30.456669], [114.61912, 30.456153], [114.61756, 30.456076]];
        var canteenPath = [[114.617976, 30.4552], [114.618511, 30.455229], [114.618542, 30.454725], [114.618008, 30.454695]];
        var stadiumPath = [[114.620822, 30.458296], [114.62192, 30.458371], [114.62198, 30.457638], [114.62087, 30.457561]];

        var librarycenter = [114.618256, 30.456352];
        var canteencenter = [114.618261, 30.454947];
        var stadiumcenter = [114.621402, 30.457974];


        const mask = [path];

        var buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20], heightfactor: 2 });
        var options =
        {
          hideWithoutStyle: true,
          areas: [{
            rejectTexture: true,//是否屏蔽自定义地图的纹理
            path: path
          }, { // Library building rendering
            color1: '#BBFFFF', // 楼顶颜色
            color2: '#AEEEEE', // 楼面颜色
            path: libraryPath2
          }, { // canteen building rendering
            color1: '#FFF68F',
            color2: '#EEE685',
            path: canteenPath2
          }, {// stadium building rendering
            color1: '#FF8247',
            color2: '#EE7942',
            path: stadiumPath2
          }]
        };

        buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle

        const libraryPolygon = new AMap.Polygon({
          path: libraryPath,
          strokeColor: "#AEEEEE",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#BBFFFF",
          zIndex: 50,
        });
        const canteenPolygon = new AMap.Polygon({
          path: canteenPath,
          strokeColor: "#EEE685",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#FFF68F",
          zIndex: 50,
        });
        const stadiumPolygon = new AMap.Polygon({
          path: stadiumPath,
          strokeColor: "#EE7942",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#FF8247",
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

        libraryPolygon.on('dblclick', () => {
          map.setCenter(librarycenter);
          map.setZoom(19);
        })

        stadiumPolygon.on('dblclick', () => {
          map.setCenter(stadiumcenter);
          map.setZoom(19);
        })

        canteenPolygon.on('dblclick', () => {
          map.setCenter(canteencenter);
          map.setZoom(19);
        })

        map.add(canteenPolygon);
        map.add(stadiumPolygon);
        map.add(libraryPolygon);
        map.setFitView([canteenPolygon, stadiumPolygon, libraryPolygon]);
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

