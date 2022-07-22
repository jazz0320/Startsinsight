import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ScoreTable = styled.table`
  background-color: #343a40;
  color: white;
  text-align: center;
  border-radius: 5px;
  border: 0px;
`;

const BallDiv = styled.div`
  position: absolute;
`;

const Img = styled.img`
  /* height: 1000px;
  width: 1125px; */
`;

const Cvs = styled.canvas`
  z-index: 100;
  object-fit: cover;
  position: absolute;
  left: 0px;
`;

function App() {
  const [pitchData, setPitchData] = useState();
  const [pitchNewData, setPitchNewData] = useState();
  const [pitchType, setPitchType] = useState();
  const ballTypeColor = {
    FB: "#FF0000",
    CB: "#0080FF",
    CH: "#007500",
    FT: "#b62170",
    SL: "#FFFF37",
    SP: "#FF8000",
    CT: "#613030",
    SFF: "#D94600",
    KN: "#6F00D2",
    SC: "#00f2ff",
  };

  let cvs = document.getElementById("cvs");

  useEffect(() => {
    let newData = {};

    fetch("https://statsinsight-code-interview.herokuapp.com/get/Get_Balls_CI")
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        let removeInvalidData = response.filter(
          (data) => data.APP_VeloRel !== ""
        );
        setPitchData(removeInvalidData);

        let totalType = [];
        for (const type of removeInvalidData) {
          totalType.push(type.TaggedPitchType);
        }
        setPitchType(Array.from(new Set(totalType)));

        for (const type of removeInvalidData) {
          // console.log(type.TaggedPitchType);
          if (!(type.TaggedPitchType in newData)) {
            Object.assign(newData, {
              [`${type.TaggedPitchType}`]: {
                count: Number(1),
                APP_VeloRel: [Number(type.APP_VeloRel)],
                PitchCode: [type.PitchCode],
                PlayResult: [type.PlayResult],
                KorBB: [type.KorBB],
              },
            });
          } else {
            newData[type.TaggedPitchType].count += 1;
            newData[type.TaggedPitchType].APP_VeloRel.push(
              Number(type.APP_VeloRel)
            );
            newData[type.TaggedPitchType].PitchCode.push(type.PitchCode);
            newData[type.TaggedPitchType].PlayResult.push(type.PlayResult);
            newData[type.TaggedPitchType].KorBB.push(type.KorBB);
          }

          // }
        }
        setPitchNewData(newData);
      });
  }, []);
  useEffect(() => {
    if (pitchData) {
      for (const type of pitchData) {
        //設定繪製顏色
        let ctx = cvs.getContext("2d");
        ctx.fillStyle = ballTypeColor[type.TaggedPitchType];
        //繪製成矩形

        // let x = Number(type.APP_KZoneY);
        // let y = Number(type.APP_KZoneZ);
        let x = Number(type.APP_KZoneY) * 28.75 + 1288.5;
        let y = 2119.25 - Number(type.APP_KZoneZ) * 28.625;
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        console.log(Number(type.APP_KZoneY) * 28.75 + 1288.5 - 20);
      }
    }
  }, [pitchData]);

  return (
    <div>
      <ScoreTable cellPadding="5" border="1">
        <thead>
          <tr>
            <th width="110px">球種</th>
            <th>球數</th>
            <th>平均球速</th>
            <th>好球率</th>
            <th>BABIP</th>
          </tr>
        </thead>
        <tbody>
          {pitchType?.map((type, index) => (
            <tr key={index}>
              <td nowrap="nowrap" align="left">
                {type}
              </td>
              <td>{pitchNewData[type].count}</td>
              <td>
                {Math.floor(
                  pitchNewData[type].APP_VeloRel.reduce(
                    (a, b) => a + b / pitchNewData[type].APP_VeloRel.length,
                    0
                  )
                )}
              </td>
              <td>{pitchNewData[type].count}</td>
              <td>{pitchNewData[type].count}</td>
            </tr>
          ))}
        </tbody>
      </ScoreTable>
      <BallDiv>
        <Img src={require("./img/goodball.png")} />
        <Cvs id="cvs" width={2583} height={2296}></Cvs>
      </BallDiv>
    </div>
  );
}

export default App;
