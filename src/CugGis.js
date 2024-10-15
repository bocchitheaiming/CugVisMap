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

// VanillaTilt
import VanillaTilt from 'vanilla-tilt';
// observablehq/plot
import * as Plot from "@observablehq/plot";
// d3
import * as d3 from "d3";

// Icons
import Icon, { UpOutlined } from '@ant-design/icons';

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

  useEffect(() => {
    const gram = BuildHistogram(elementDist[positions[positionNow]]["Histogram"]);
    containerRef.current.append(gram);
    return () => gram.remove();
  },[positionNow]);

  const containerRef = useRef();

  const [isSlide, setIsSlide] = useState(false);
  function handleSlide() 
  {
    setIsSlide(!isSlide);
  }

  const [isOpen, setIsOpen] = useState(false);
  function handleOpen() 
  {
    setIsOpen(!isOpen);
  }

  const [data, setData] = useState();

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

        // 设定楼块样式
        // var buildingLayer = new AMap.Buildings({zIndex:130,zooms:[16,20]});
        var options = {
          hideWithoutStyle:false,//是否隐藏设定区域外的楼块
        }
        map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 18, // 初始化地图级别，越大比例尺越小
          // zooms:[18,20], //设置地图缩放范围
          center: [114.61716,30.457544], // 初始化地图中心点位置
          // rotation: -15, //初始地图顺时针旋转的角度
          pitch: 70, //地图俯仰角度，有效范围 0 度- 83 度

          // mapStyle: "amap://styles/darkblue", // 设置地图的显示样式

          rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
          pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
          zoomEnable: true, //是否开启地图缩放交互
          showBuildingBlock: true,
          bounds: bounds, // 设置地图显示范围

          layers:[
            new AMap.TileLayer.Satellite({tileSize:256}),
            new AMap.createDefaultLayer({
              zooms: [3, 20], //可见级别
              visible: true, //是否可见
              opacity: 1, //透明度
              zIndex: 0, //叠加层级
            }),
            new AMap.Buildings({zIndex:130,zooms:[16,20],heightfactor:2}),
          ]
        });
        map.add(customPolygon);
        // 加载地图控件,''是命名
        AMap.plugin('AMap.ControlBar',function(){
          var ControlBar = new AMap.ControlBar();
          map.addControl(ControlBar);
        })
      })
      .catch((e) => {
        console.log(e);
      });



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

      VanillaTilt.init(document.querySelectorAll(".panel2"), {
        max: 25,
        speed: 400,
        startX: 20,
        axis: "x",
      });
      
      VanillaTilt.init(document.querySelectorAll(".panel3"), {
        max: 40,
        speed: 400,
        startX: 35,
        axis: "x",
      });

    return () => {
      map?.destroy();
      clearInterval(interval);
    };
  }, [map]);

  const increaseZoom = () => {
    map.setZoom(map.getZoom() + 1);
  };

  return (
    <div className="all_container">
      <div
        id="container"
        className='container'
        style={{ height: "100vh" }}
      >
      </div>
      <Card className={`panel1 ${isSlide ? 'slide-out' : ''}`} hoverable={true} >
        <Button type="primary" className="ZoomButton" onClick={handlePosition}>测试</Button>
        测试
      </Card>

      <Card className="panel2">
        <div ref={containerRef} />
      </Card>

      <Card className="panel3">

      </Card>

      <div className={`openablePanel ${isOpen ? 'panel-opened':''}`}>
        <UpOutlined onClick={handleOpen} className={`OpenButton ${isOpen ? 'opened':''}`}></UpOutlined>
        <div className="DividedLine"></div>
      </div>
      

      
    </div>
    
    
  );
}

