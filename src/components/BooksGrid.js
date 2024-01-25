import "../styles/BooksGrid.css";

const BooksGrid = (props) => {
    const {
        title,
        booksNames,
        setBookGuess,
        verseData
    } = props;

    return <>
        <h1 className="section-title">{title}</h1>
        <div className="chapters-grid">
          {booksNames.map((val, i) => {
            return <span 
                className="chapter-div" 
                key={i} 
                onClick={() => {
                  if (!verseData) return;
                    console.log(val);
                    setBookGuess(val);
                }
            }>
              <h1>{val.substring(1, 2) === " " ? val.substring(0, 5) : val.substring(0, 3)}</h1>
            </span>
          })}
        </div>
    </>
}

export default BooksGrid;