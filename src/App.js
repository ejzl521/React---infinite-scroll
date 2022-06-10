import {useInView} from "react-intersection-observer"
import styled from "styled-components";
import {useEffect, useState, useCallback} from "react";
import axios from "axios";

const App = () => {
  const [ref, isView] = useInView();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    // 서버에서는 한 페이지당 3개의 데이터를 보내준다
    await axios.get(`http://localhost:5008/people?_page=${page}&_limit=3`)
      .then((res) => {
        // 기존 데이터에 새로 불러온 데이터를 합치고 page를 + 1시킴
        setData([...res.data, ...data]);
        setPage(page + 1);
      })
  }, [isView])
  // 맨 처음 렌더링 되었을 때 데이터를 한번 불러옴!
  useEffect(() => {
    getData();
  }, [])
  // isView가 true 일 때만 데이터를 불러옴!
  // 보였다 안보이면 true에서 false로 바뀌기 때문에 useEffect가 두번 실행됨!
  useEffect(() => {
    if (isView) {
      getData();
    }
  }, [isView])
  return (
    <>
      {data.map((item, idx) => (
        <div key={idx}>
          {data.length - 1 === idx ? (
            // 맨 마지막 요소에 ref
            <Data ref={ref}>{item.name}</Data>
          ) : (
            <Data>{item.name}</Data>
          )}
        </div>
      ))}
    </>
  );
}
const Data = styled.div`
  height: 300px;
  font-size: 30px;
  border: 2px solid black;
  margin: 20px;
`
export default App;