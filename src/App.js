import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [verseData, setVerseData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get("http://localhost:3001/random-verse/");
        setVerseData(res.data.verse.content);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [])

  return (
    <div id="app" dangerouslySetInnerHTML={{__html: verseData}}>
    </div>
  );
}

export default App;
