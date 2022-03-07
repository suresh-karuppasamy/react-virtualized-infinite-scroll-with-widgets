import React from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  InfiniteLoader,
  WindowScroller,
} from "react-virtualized";

const MIN_BATCH_SIZE = 40;

// Return random snippet of lorem ipsum text
const randText = () => {
  const text = [
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl:
        "https://i.picsum.photos/id/432/536/354.jpg?hmac=L6dLXhZTK1hB0U3VBUtF6TlrtQid5V8XHDvNBPyxnN4",
    },
  ];

  return text[Math.floor(Math.random() * text.length)];
};

// Cell data
const list = [];

// -----------------------------------------------------------------------------

// Infinite loading Grid that is AutoSize'd and WindowScrolled'd with dynamic cell heights
class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 3,
      columnWidth: 100,
      rowCount: 0,
      isLoading: false,
    };

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 30,
    });

    this._cellRenderer = this._cellRenderer.bind(this);
    this._isRowLoaded = this._isRowLoaded.bind(this);
    this._loadMoreRows = this._loadMoreRows.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onSectionRendered = this._onSectionRendered.bind(this);
  }

  componentDidMount() {
    this.setState({ rowCount: 1 });
  }

  componentWillUpdate(nextProps, nextState) {
    const { columnCount, rowCount } = this.state;

    if (rowCount !== nextState.rowCount && nextState.rowCount > rowCount) {
      // Re-measure the row at the index which was last occupied by "loading" content
      for (let i = 0; i < columnCount; i++) {
        this._cache.clear(this._lastLoadingIndex, i);
      }
    }
  }

  render() {
    const { columnCount, columnWidth, rowCount } = this.state;

    return (
      <div className="container-fluid">
        <div
          style={{
            position: "sticky",
            top: 0,
            padding: "20px",
            background: "#FEECE6",
            zIndex: 1,
          }}
        >
          <h1 className="page-header lead">Reacr Virtual Infinite Grid</h1>
        </div>

        <DebugOutput>{`${rowCount} rows`}</DebugOutput>

        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "25%",
              position: "sticky",
              top: 140,
              height: "100vh",
              background: "#F4F7D6",
            }}
          >
            Left
          </div>
          <div style={{ width: "48%", margin: "0 1%" }}>
            <InfiniteLoader
              isRowLoaded={this._isRowLoaded}
              loadMoreRows={this._loadMoreRows}
              rowCount={rowCount}
              threshold={1}
            >
              {({ onRowsRendered, registerChild }) => {
                this._onRowsRendered = onRowsRendered;

                return (
                  <WindowScroller>
                    {({ height, scrollTop }) => (
                      <AutoSizer disableHeight onResize={this._onResize}>
                        {({ width }) => (
                          <Grid
                            autoHeight
                            width={width}
                            height={height}
                            scrollTop={scrollTop}
                            ref={(grid) => {
                              this._grid = grid;
                              registerChild(grid);
                            }}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            rowCount={rowCount}
                            rowHeight={this._cache.rowHeight}
                            cellRenderer={this._cellRenderer}
                            onSectionRendered={this._onSectionRendered}
                          />
                        )}
                      </AutoSizer>
                    )}
                  </WindowScroller>
                );
              }}
            </InfiniteLoader>
          </div>
          <div
            style={{
              width: "25%",
              position: "sticky",
              top: 140,
              height: "100vh",
              background: "#F4F7D6",
            }}
          >
            Right
          </div>
        </div>
      </div>
    );
  }

  _isRowLoaded({ index }) {
    const { rowCount } = this.state;

    return index < rowCount - 1;
  }

  _loadMoreRows({ startIndex, stopIndex }) {
    const { isLoading } = this.state;
    const delay = 100 + Math.floor(Math.random() * 3000); // random delay to simulate server response time

    if (!isLoading) {
      this.setState({
        isLoading: true,
      });

      setTimeout(() => {
        // Generate some new rows (for this example, we have no actual end point)
        for (let i = 0; i < MIN_BATCH_SIZE; i++) {
          list.push([randText(), randText(), randText()]);
        }

        // Cancel the "loading" state and update the`rowCount`
        this.setState(
          {
            isLoading: false,
            rowCount: list.length + 1,
          },
          done
        );
      }, delay);

      let done;
      return new Promise((resolve) => (done = resolve));
    }
  }

  _cellRenderer({ key, rowIndex, columnIndex, parent, style }) {
    const { columnCount, columnWidth, rowCount } = this.state;
    let content;

    // Render cell content
    if (rowIndex < rowCount - 1) {
      const cellStyle = Object.assign({}, style, {
        backgroundColor: rowIndex % 2 ? null : "#eee",
      });

      content = (
        <div
          style={{
            padding: "20px",
            border: "1px solid grey",
            marginBottom: "2rem",
            boxShadow: "10px 10px 5px #aaaaaa",
          }}
        >
          <div style={{ padding: "20px", minHeight: "200px" }}>
            {list?.[rowIndex]?.[columnIndex]?.imageUrl && (
              <img src={list[rowIndex][columnIndex]?.imageUrl} width="100%" />
            )}
            {console.log(rowIndex, columnIndex, list[rowIndex][columnIndex])}
            <p>
              {list[rowIndex][columnIndex]?.text || (
                <em className="text-muted">empty</em>
              )}
            </p>
          </div>
        </div>
      );
    }

    // Render "loading" content
    else if (columnIndex === 0) {
      // Remember this `index` so we can clear its measurements from the cache later
      this._lastLoadingIndex = rowIndex;

      const cellStyle = Object.assign({}, style, {
        width: columnWidth * columnCount, // Give loader the full grid width
        textAlign: "center",
      });

      content = <div style={cellStyle}>Loading...</div>;
    }

    // Render empty cell (for incomplete rows)
    else {
      content = <div style={style} />;
    }

    return (
      <CellMeasurer
        key={key}
        cache={this._cache}
        parent={parent}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      >
        {content}
      </CellMeasurer>
    );
  }

  _onResize({ width }) {
    const { columnCount } = this.state;

    this.setState({
      // Subtracting 30 from `width` to accommodate the padding from the Bootstrap container
      columnWidth: (width - 30) / columnCount,
    });

    this._cache.clearAll();
    this._grid.recomputeGridSize();
  }

  _onSectionRendered({ rowStartIndex, rowStopIndex }) {
    this._onRowsRendered({
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex,
    });
  }
}

const DebugOutput = ({ children }) => (
  <div
    style={{
      width: "200px",
      marginLeft: "-100px",
      padding: "5px 0",
      backgroundColor: "#08c",
      borderRadius: "0 0 4px 4px",
      color: "#fff",
      fontSize: "12px",
      fontFamily: "Arial",
      lineHeight: 1,
      textAlign: "center",
      position: "fixed",
      top: 0,
      left: "50%",
      zIndex: 1000,
    }}
  >
    {children}
  </div>
);

export default Demo;
