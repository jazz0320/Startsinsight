import "./App.css";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ScoreTable = styled.table`
  margin-top: 50px;
  text-align: center;
  border-radius: 5px;
  border: 1px;
  td,
  th {
    width: 100px;
    text-align: center;
    border: 1px solid #333;
  }
`;
const ContentDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const BallDiv = styled.div`
  position: absolute;
  top: -50px;
`;

const Img = styled.img`
  height: 1148px;
  width: 1291.5px;
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
        setPitchData(response);

        let totalType = [];
        for (const type of response) {
          totalType.push(type.TaggedPitchType);
        }
        setPitchType(Array.from(new Set(totalType)));

        for (const type of response) {
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
        let x = (Number(type.APP_KZoneY) * 28.75 + 1288.5) / 2;
        let y = (2119.25 - Number(type.APP_KZoneZ) * 28.625) / 2;
        ctx.beginPath();
        ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        console.log(Number(type.APP_KZoneY) * 28.75 + 1288.5 - 20);
      }
    }
  }, [pitchData]);

  return (
    <ContentDiv>
      <ScoreTable cellPadding="5" border="1">
        <thead>
          <tr>
            <th>球種</th>
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
                {Math.round(
                  pitchNewData[type].APP_VeloRel.filter(
                    (vel) => vel !== 0
                  ).reduce((a, b, i, arr) => a + b / arr.length, 0) * 10
                ) / 10}
              </td>
              <td>
                {Math.round(
                  pitchNewData[type].PitchCode.map((e) =>
                    e !== "Ball" ? 1 : 0
                  ).reduce(
                    (a, b) => a + b / pitchNewData[type].PitchCode.length,
                    0
                  ) * 100
                )}
              </td>
              <td>
                {Math.round(
                  (pitchNewData[type].PlayResult.filter(
                    (e) => e === "1B" || e === "2B" || e === "3B"
                  ).length /
                    pitchNewData[type].PlayResult.filter(
                      (e) => e !== "HR" && e !== "" && e !== "SH"
                    ).length) *
                    1000
                ) / 1000 || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </ScoreTable>
      <BallDiv>
        <Img src={require("./img/goodball.png")} />
        <Cvs id="cvs" width={2583} height={2296}></Cvs>
      </BallDiv>
    </ContentDiv>
  );
}

export default App;
