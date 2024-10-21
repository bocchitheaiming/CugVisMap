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
import { Histogram } from "./PlotFigure";
import { BuildHistogram } from "./PlotFigure";

export default function CugGis() {
  const data_1 = [
    { name: '一楼', value: 30 },
    { name: '二楼', value: 80 },
    { name: '三楼', value: 45 },
  ];

  const data_2 = [
    { name: '一楼', value: 30 },
    { name: '二楼', value: 80 },
    { name: '三楼', value: 45 },
    { name: '四楼', value: 60 },
  ];

  // 当前可视化数据指定地点
  const positions = ["diningHall","library","stadium"];
  const [positionNow, setpositionNow] = useState(0);
  function handlePosition()
  {
    setpositionNow((positionNow+1)%3);
  }
  // 全部数据存放
  const elementDist = {
    "diningHall":
    {
      "Histogram": data_1,
    },
    "library":
    {
      "Histogram": data_2,
    }
  }

  // useEffect(() => {
  //   const gram = BuildHistogram(elementDist[positions[positionNow]]["Histogram"]);
  //   containerRef.current.append(gram);
  //   return () => gram.remove();
  // },[positionNow]);

  // const containerRef = useRef();

  const [isSlide, setIsSlide] = useState(false);
  function handleSlide() 
  {
    setIsSlide(!isSlide);
  }

  // 控制面板2位置1
  const [isPanel2Slide, setIsPanel2Slide] = useState(false);
  function handlePanel2Slide()
  {
    setIsPanel2Slide(!isPanel2Slide);
  }
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
        // 单独呈现中国地质大学（武汉）
        var path = [
          [114.622101, 30.460426], [114.622252, 30.458667], [114.622309, 30.45795], [114.622404, 30.457445], [114.622498, 30.456614], [114.622574, 30.456093], [114.622838, 30.454724], [114.621818, 30.454577], [114.617943, 30.454398], [114.616242, 30.454773], [114.61439, 30.455653], [114.613369, 30.456093], [114.611782, 30.456712], [114.610269, 30.4572], [114.610307, 30.458667], [114.610345, 30.459661], [114.612972, 30.459921], [114.614503, 30.460003], [114.617943, 30.460166], [114.619947, 30.460312]];
        // 地大图书馆
        var libraryPath = [
          [114.617528, 30.456566], [114.619063,30.456669], [114.61912, 30.456153], [114.61756, 30.456076]];
        // 地大食堂
        var canteenPath = [[114.617976,30.4552], [114.618511,30.455229], [114.618542,30.454725], [114.618008,30.454695]];
        // 地大体育馆
        var stadiumPath = [[114.620822,30.458296], [114.62192,30.458371], [114.62198,30.457638], [114.62087,30.457561]];
        const mask = [path];
        // 楼面layer
        var buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20], heightfactor: 2 });
        var options =
        {
          hideWithoutStyle: true,
          areas: [{
            path: path
          }]
        };
        buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle

        const canteenPolygon = new AMap.Polygon({
          path: canteenPath,
          strokeColor: "#2b8cbe",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#ccebc5",
          zIndex: 50,
        }).on('mouseover', () => {
          // map.setZoom(20);
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
        const libraryPolygon = new AMap.Polygon({
          path: libraryPath,
          strokeColor: "#2b8cbe",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#ccebc5",
          zIndex: 50,
        });
        const stadiumPolygon = new AMap.Polygon({
          path: stadiumPath,
          strokeColor: "#2b8cbe",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.5,
          fillColor: "#ccebc5",
          zIndex: 50,
        });

        map = new AMap.Map("container", { // 设置地图容器id
          mask: mask,
          // 是否为3D地图模式
          viewMode: "3D", 
          // 初始化地图级别，越大比例尺越小
          zoom: 18, 
          // 设置地图缩放范围
          zooms: [5, 22], 
          // 初始化地图中心点位置
          center: [114.61716, 30.457544], 
          // 地图俯仰角度，有效范围 0 度- 83 度
          pitch: 70, 
          // 启用滚轮缩放
          scrollWheel: true, 
          // 是否开启地图旋转交互
          rotateEnable: true, 
          
          zoomEnable: true, 
          layers: [
            new AMap.TileLayer.Satellite({ tileSize: 256 }),
            new AMap.createDefaultLayer({
              zooms: [3, 22], // 可见级别
              visible: true, // 是否可见
              opacity: 1, // 透明度
              zIndex: 0, // 叠加层级
            }),
            buildingLayer
          ],
        });

        canteenPolygon.on('dblclick', () => {
          map.setCenter([114.617976, 30.4552]);
          map.setZoom(20);
          map.setRotation(90);
        })

        map.add(canteenPolygon);
        map.add(libraryPolygon);
        map.add(stadiumPolygon);

        // 插件
        AMap.plugin('AMap.ControlBar',function(){ 
          var controlbar = new AMap.ControlBar(); //缩放工具条实例化
          map.addControl(controlbar); //添加控件
        });

        map.setFitView([canteenPolygon]);

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

    // VanillaTilt.init(document.querySelectorAll(".panel2"), {
    //   max: 25,
    //   speed: 400,
    //   startX: 20,
    //   axis: "x",
    // });
    
    VanillaTilt.init(document.querySelectorAll(".panel3"), {
      max: 40,
      speed: 400,
      startX: 35,
      axis: "x",
    });

    return ()=>
    {
      clearInterval(interval);
    }
  })

  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  return (
    <div className="all_container">
      <div
        id="container"
        className='container'
        style={{ height: "100vh" }}
      >
      </div>

      {/* 已被取缔 */}
      {/* <Card className={`panel2 ${isPanel2Slide? "slide-in":""}`}>
        <VerticalLeftOutlined onClick = {handlePanel2Slide}
          className={`slideButton ${isPanel2Slide? "slide-in":""}`}
        >
        </VerticalLeftOutlined>
        <div ref={containerRef} />
      </Card>

      <Card className="panel3">
      </Card> */}
      
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
      {/* <div className={`openablePanel ${isOpen ? 'panel-opened':''}`}>
        <UpOutlined onClick={handleOpen} className={`OpenButton ${isOpen ? 'opened':''}`}></UpOutlined>
        <div className="DividedLine"></div>
      </div> */}
      <div className={`mainPanel ${isOpen? "slide-in":""}`}>
        <UpOutlined onClick={handleOpen} className={`openButton ${isOpen ? 'opened':''}`}></UpOutlined>
        <Carousel arrows dotPosition="left" infinite={false}>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      </div>
    </div>
    
    
  );
}

