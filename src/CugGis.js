import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import "./CugGis.scss";

// Gaode API
import AMapLoader from "@amap/amap-jsapi-loader";

// Antd
import { Card } from "antd";
import { Button } from "antd";
import { Color } from "antd/es/color-picker";
import { FloatButton } from "antd";
import { Carousel } from 'antd';

// VanillaTilt
import VanillaTilt from 'vanilla-tilt';
// observablehq/plot
import * as Plot from "@observablehq/plot";
// d3
import * as d3 from "d3";

// Icons
import Icon, { UpOutlined , VerticalLeftOutlined} from '@ant-design/icons';
import { PlusOutlined, MinusOutlined, EnvironmentOutlined } from "@ant-design/icons";

// Mine
import { ObHistogramPlot } from './Obgraph';

export default function CugGis() {
  const data_1 = [
    { name: '一楼', value: 30 },
    { name: '二楼', value: 80 },
    { name: '三楼', value: 45 },
  ];

  const data = [
    { name: '汉堡', value: 30 },
    { name: '炒菜', value: 80 },
    { name: '火锅', value: 45 },
    { name: '饮料', value: 60 },
  ];

  const data_3 = [4, 8, 15, 16, 23, 42, 15, 10, 18, 29, 30];

  // 当前可视化数据指定地点
  const positions = ["diningHall","library","stadium"];
  const [positionNow, setpositionNow] = useState(0);
  function handlePosition()
  {
    setpositionNow((positionNow+1)%3);
  }
  // 全部数据存放
  // const elementDist = {
  //   "diningHall":
  //   {
  //     "Histogram": data_1,
  //   },
  //   "library":
  //   {
  //     "Histogram": data_2,
  //   }
  // }

  // useEffect(() => {
  //   const gram = BuildHistogram(elementDist[positions[positionNow]]["Histogram"]);
  //   containerRef.current.append(gram);
  //   return () => gram.remove();
  // },[positionNow]);

  // const containerRef = useRef();

  // 控制面板main位置
  const [isOpen, setIsOpen] = useState(false);
  function handleOpen() 
  {
    setIsOpen(!isOpen);
  }

  // 用reactHook形式加载地图
  let map = null;
  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: "0c1cd8cf9a3534ac31d382a998de238d",
    };

    // 初始化地图
    AMapLoader.load({
      key: "303d13408f77cf102158a612bd67c19a", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap) => {
        // 路径设计：单独呈现中国地质大学（武汉）
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
        // 路径设计：单独呈现中国地质大学（武汉）

        // 楼块设计
        var buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20], heightfactor: 2 });
        var options =
        {
          hideWithoutStyle: true,
          areas: [{
            rejectTexture: true,//是否屏蔽自定义地图的纹理
            path: path
          }, 
          { 
            // Library building rendering
            color1: '#BBFFFF', // 楼顶颜色
            color2: '#AEEEEE', // 楼面颜色
            path: libraryPath2
          }, 
          { 
            // canteen building rendering
            color1: '#FFF68F',
            color2: '#EEE685',
            path: canteenPath2
          }, 
          {
            // stadium building rendering
            color1: '#FF8247',
            color2: '#EE7942',
            path: stadiumPath2
          }]
        };
        buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle
        // 楼块设计

        // 地图多边形
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
        }).on('mouseover', () => {
          canteenPolygon.setOptions({
            fillOpacity: 0.7,
            fillColor: '#7bccc4'
          })
        }).on('mouseout', () => {
          canteenPolygon.setOptions({
            fillOpacity: 0.5,
            fillColor: '#ccebc5'
          })
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
        // 地图多边形

        //地图实例
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
          map.setZoom(20);
          map.setRotation(180);
          handleOpen();
          setShowLibrary(true);
        })

        stadiumPolygon.on('dblclick', () => {
          map.setCenter(stadiumcenter);
          map.setZoom(20);
          map.setRotation(135);
          handleOpen();
          setShowStadium(true);
        })

        canteenPolygon.on('dblclick', () => {
          map.setCenter(canteencenter);
          map.setZoom(20);
          map.setRotation(90);
          handleOpen();
          setShowCanteen(true);
        })

        map.add(canteenPolygon);
        map.add(libraryPolygon);
        map.add(stadiumPolygon);
        // 地图实例

        // 地图插件
        AMap.plugin('AMap.ControlBar',function(){ 
          var controlbar = new AMap.ControlBar(); //罗盘实例化
          map.addControl(controlbar); //添加控件
        });

        function ZoomIn()
        {
          map.setZoom(map.getZoom()+0.5);
        }
        document.getElementById('zoomIn').addEventListener('click', ZoomIn);
        function Zoomout()
        {
          map.setZoom(map.getZoom()-0.5);
        }
        document.getElementById('zoomOut').addEventListener('click', Zoomout);
        function MapLocate()
        {
          map.setCenter([114.61716, 30.457544]);
          map.setZoom(18);
          map.setRotation(0);
          setIsOpen(false);
        }
        document.getElementById('mapLocate').addEventListener('click', MapLocate);

      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map?.destroy();
    };
  }, [map]);

  // 主控件
  useEffect(() => {
    const interval = setInterval(() => {
      // 获取所有带有类名 "amap-logo" 的元素
      const elementsToRemove1 = document.querySelectorAll('.amap-logo');
      // 获取所有带有类名 "amap-copyright" 的元素
      const elementsToRemove2 = document.querySelectorAll('.amap-copyright');
      elementsToRemove1.forEach((element) => {
        // 从 DOM 中删除这些元素
        element.remove();
      });
      elementsToRemove2.forEach((element) => {
        // 从 DOM 中删除这些元素
        element.remove();
      });
    }, 1000); // 每隔 1 秒执行一次

    return ()=>
    {
      clearInterval(interval);
    }
  })

  const contentStyle = {
    margin: 0,
    height: '50vh',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCanteen, setShowCanteen] = useState(false);
  const [showStadium, setShowStadium] = useState(false);
  return (
    <div className="all_container">
      <div
        id="container"
        className='container'
        style={{ height: "100vh" }}
      >
      </div>
      <div className="midTitle">
        {showLibrary && <div className="location-fade">未来城图书馆</div>}
        {showCanteen && <div className="location-fade">未来城第一食堂</div>}
        {showStadium && <div className="location-fade">未来城体育馆</div>}
      </div>

      <FloatButton.Group
            shape="square"
            style={{
              insetInlineEnd: 94,
              left: "1%",
              right:"97%",
              TOP: "8%",
              bottom: "1%",
            }}
            >
            <FloatButton icon={<PlusOutlined />} id = "zoomIn"/>
            <FloatButton icon={<MinusOutlined />} id = "zoomOut"/>
            <FloatButton icon={<EnvironmentOutlined/>} id = "mapLocate"/>
      </FloatButton.Group>
      <Card className={`leftUpPanel ${isOpen? "":"slide-in"}`}>
        <ObHistogramPlot data={data} Xlabel={"窗口"} Ylabel={"订单数"} Title={"食堂窗口销售量"}/>
      </Card>

      <Card className={`leftDownPanel ${isOpen? "":"slide-in"}`}>
      </Card>
    </div>
    
    
  );
}

