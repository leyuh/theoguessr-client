import "../styles/BooksGrid.css";

const BooksGrid = (props) => {
    const {
        booksNames,
        setBookGuess,
        verseData
    } = props;

    return <>
        <div className="chapters-grid">
          {booksNames.map((val, i) => {
            return <button 
                className="chapter-div bg-3" 
                key={i} 
                onClick={() => {
                  if (!verseData) return;
                    setBookGuess(val);
                }
            }>
              <h1>{val.substring(1, 2) === " " ? val.substring(0, 5) : val.substring(0, 3)}</h1>
            </button>
          })}
        </div>
    </>
}

export default BooksGrid;