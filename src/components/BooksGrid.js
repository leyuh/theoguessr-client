
const BooksGrid = (props) => {
    const {
        title,
        booksNames,
        setBookGuess={setBookGuess}
    } = props;

    return <>
        <h1>{title}</h1>
        <div className="chapters-grid">
          {booksNames.map((val, i) => {
            return <span 
                style={{display: "inline-block"}}
                className="chapter-div" 
                key={i} 
                onClick={() => {
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