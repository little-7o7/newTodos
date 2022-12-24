import "./App.css";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { randomColor } from "randomcolor";
import Draggable from "react-draggable";

function App() {
  const [{ innerWidth, innerHeight }, setWindowSize] = useState(getWindowSize());
  const [item, setItem] = useState("");
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const newItem = () => {
    if (item.trim() !== "") {
      const newItem = {
        id: uuidv4(),
        item,
        color: randomColor({
          luminosity: "light",
        }),
        defaultPos: {
          x: randomInteger(5, innerWidth - 100),
          y: randomInteger(-innerHeight + 5, 40),
        },
      };
      setItems((items) => [...items, newItem]);
      setItem("");
    } else {
      alert("enter something");
      setItem("");
    }
  };

  const deleteNode = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };
  const updatePos = (data, index) => {
    let newArray = [...items];
    newArray[index].defaultPos = { x: data.x, y: data.y };
    setItems(newArray);
  };

  const keyPress = (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      newItem();
    }
  };

  return (
    <div className="App">
      <div className="wrapper">
        <input
          value={item}
          type="text"
          placeholder="Enter something"
          onKeyPress={(e) => keyPress(e)}
          onChange={(e) => setItem(e.target.value)}
        />
        <button onClick={newItem} className="enter">
          ENTER
        </button>
      </div>
      {items.map((item, index) => {
        return (
          <Draggable
            key={index}
            defaultPosition={item.defaultPos}
            onStop={(_, data) => {
              updatePos(data, index);
              console.log(data, index);
            }}
          >
            <div className="todo_item" style={{ backgroundColor: item.color }}>
              {`${item.item}`}
              <button className="delete" onClick={() => deleteNode(item.id)}>
                X
              </button>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}

export default App;
