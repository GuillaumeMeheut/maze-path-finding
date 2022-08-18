import { useEffect, useRef, useState } from "react";
import css from "./index.module.scss";

type Props = {
  dimension: number;
};

type Maze = any[][];

export default function Maze({ dimension }: Props) {
  const [maze, setMaze] = useState<Maze>([]);
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<any>({ w: 0, h: 0 });

  function generateMaze() {
    const maze = [];
    for (let y = 0; y < dimension; y++) {
      const tab = [];
      for (let x = 0; x < dimension; x++) {
        tab.push({ x, y, isWall: isWall() });
      }
      maze.push(tab);
    }
    setMaze(maze);
  }

  function isWall(): boolean {
    return Math.floor(Math.random() * 5) === 1;
  }
  function setCoordinates(x: number, y: number) {
    setClickCoordinates({ x, y });
  }

  function matchCoordinates(x: number, y: number): boolean {
    return clickCoordinates.x === x && clickCoordinates.y === y;
  }

  function onResize() {
    const width = window.innerWidth / dimension;
    const height = window.innerHeight / dimension;

    setSize({ w: width, h: height });
  }

  console.log(size);

  useEffect(() => {
    generateMaze();

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={css.maze}>
      {maze.map((row, index) => (
        <div key={index} className={css.row}>
          {row.map((info) => (
            <span
              key={JSON.stringify(info)}
              onClick={() =>
                info.isWall ? null : setCoordinates(info.x, info.y)
              }
              style={{
                backgroundColor: info.isWall
                  ? "grey"
                  : matchCoordinates(info.x, info.y)
                  ? "blue"
                  : "red",
                width: `${size.w}px`,
                height: `${size.h}px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
