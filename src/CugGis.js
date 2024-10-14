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
          [114.622101, 30.460426],
          [114.622252, 30.458667],
          [114.622309, 30.45795],
          [114.622404, 30.457445],
          [114.622498, 30.456614],
          [114.622574, 30.456093],
          [114.622838, 30.454724],
          [114.621818, 30.454577],
          [114.617943, 30.454398],
          [114.616242, 30.454773],
          [114.61439, 30.455653],
          [114.613369, 30.456093],
          [114.611782, 30.456712],
          [114.610269, 30.4572],
          [114.610307, 30.458667],
          [114.610345, 30.459661],
          [114.612972, 30.459921],
          [114.614503, 30.460003],
          [114.617943, 30.460166],
          [114.619947, 30.460312],
        ];
        var outer = [
          // [114.615233,30.459101],
          // [114.620327,30.456925],
          // [114.614204,30.457308],
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true),
        ];

        var pathArray = [outer, path];

        // 创建自定义多边形
        const customPolygon = new AMap.Polygon({
          path: pathArray,
          strokeColor: "#FFFFFF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 1,
          fillColor: "#FFFFFF",
          zIndex: 50,
        });

        const bounds = customPolygon.getBounds();

        map = new AMap.Map("container", { // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 18, // 初始化地图级别，越大比例尺越小
          zooms: [5, 20], // 设置地图缩放范围
          center: [114.61716, 30.457544], // 初始化地图中心点位置
          pitch: 70, // 地图俯仰角度，有效范围 0 度- 83 度
          scrollWheel: true, // 启用滚轮缩放
          rotateEnable: true, // 是否开启地图旋转交互
          zoomEnable: true, // 是否开启地图缩放交互
          bounds: bounds, // 设置地图显示范围
          layers: [
            new AMap.TileLayer.Satellite({ tileSize: 256 }),
            new AMap.createDefaultLayer({
              zooms: [3, 20], // 可见级别
              visible: true, // 是否可见
              opacity: 1, // 透明度
              zIndex: 0, // 叠加层级
            }),
            new AMap.Buildings({ zIndex: 130, zooms: [16, 20], heightfactor: 2 }),
          ],
        });

        // customPolygon.setPath(pathArray);
        map.add(customPolygon);
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

