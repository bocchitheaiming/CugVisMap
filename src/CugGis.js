import { useEffect } from "react";
import { useState } from "react";
import "./CugGis.scss";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Card } from "antd";
import { Button } from "antd";
import { Color } from "antd/es/color-picker";

import VanillaTilt from 'vanilla-tilt';

export default function CugGis() {

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

  let map = null;
  // 用reactHook形式加载地图
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
        // 设定楼块样式
        // var buildingLayer = new AMap.Buildings({zIndex:130,zooms:[16,20]});
        var options = {
          hideWithoutStyle:false,//是否隐藏设定区域外的楼块
        }
        map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 18, // 初始化地图级别，越大比例尺越小
          zooms:[18,20], //设置地图缩放范围
          center: [114.61716,30.457544], // 初始化地图中心点位置
          // rotation: -15, //初始地图顺时针旋转的角度
          pitch: 70, //地图俯仰角度，有效范围 0 度- 83 度

          // mapStyle: "amap://styles/darkblue", // 设置地图的显示样式

          rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
          pitchEnable: false, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
          zoomEnable: false, //是否开启地图缩放交互
          showBuildingBlock: true,

          layers:[
            // new AMap.TileLayer.Satellite({tileSize:256}),
            new AMap.createDefaultLayer({
              zooms: [3, 20], //可见级别
              visible: true, //是否可见
              opacity: 1, //透明度
              zIndex: 0, //叠加层级
            }),
            new AMap.Buildings({zIndex:130,zooms:[16,20],heightfactor:2}),
          ]
        });
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
      
      VanillaTilt.init(document.querySelectorAll(".panel3"), {
        max: 40,
        speed: 400,
        startX: 35,
      });

      VanillaTilt.init(document.querySelectorAll(".panel2"), {
        max: 25,
        speed: 400,
        startX: 20,
      });


    return () => {
      map?.destroy();
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div
        id="container"
        className='container'
        style={{ height: "100vh" }}
      >
      </div>
      <Card className={`panel1 ${isSlide ? 'slide-out' : ''}`} hoverable={true} onClick={handleSlide}>
        测试
      </Card>

      <Card className="panel2">
        测试
      </Card>

      <Card className="panel3">
        测试
      </Card>
      <div className="panel-container">
        <div className={`openablePanel ${isOpen ? 'panel-opened':''}`}>
          <Button onClick={handleOpen}>Open</Button>
        </div>
      </div>

    </div>

    
  );
}

