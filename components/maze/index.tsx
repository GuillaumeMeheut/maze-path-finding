import { useEffect, useRef, useState } from "react";
import css from "./index.module.scss";

type Props = {
  dimension: number;
};

type Maze = any[][];

type Coordinates = {
  x: number;
  y: number;
};

type Node = {
  distance: number;
  pos: Coordinates;
};

export default function Maze({ dimension }: Props) {
  const [maze, setMaze] = useState<Maze>([]);
  const [startNode, setStartNode] = useState({ x: 0, y: 0 });
  const [endNode, setEndNode] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<any>({ w: 0, h: 0 });

  function generateMaze() {
    const maze = [];
    for (let y = 0; y < dimension; y++) {
      const tab = [];
      for (let x = 0; x < dimension; x++) {
        tab.push({
          x,
          y,
          isWall: isWall(),
          distance: calculDistance(x, y, startNode.x, startNode.y),
        });
      }
      maze.push(tab);
    }
    setMaze(maze);
  }

  // function findPath(
  //   currentNode?: Node,
  //   startNode: Coordinates,
  //   endNode: Coordinates
  // ) {
  //   if (currentNode === endNode) return [];
  //   const closedNode = findPath(currentNode, startNode, endNode);
  // }

  // findPath({ x: 1, y: 2 }, { x: 1, y: 2 });

  function isWall(): boolean {
    return Math.floor(Math.random() * 5) === 1;
  }

  function setCoordinates(x: number, y: number) {
    setStartNode({ x: endNode.x, y: endNode.y });
    setEndNode({ x, y });
    setDistance();
  }

  //A revoir pour match le startNode et le endNode
  function matchCoordinates(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): boolean {
    return x1 === x2 && y1 === y2;
  }

  function calculDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  function setDistance() {
    const newMaze = [...maze];
    newMaze.map((row) =>
      row.map(
        (node) =>
          (node.distance =
            calculDistance(node.x, node.y, startNode.x, startNode.y) -
            calculDistance(node.x, node.y, endNode.x, endNode.y))
      )
    );

    setMaze(newMaze);
  }

  function onResize() {
    const width = window.innerWidth / dimension;
    const height = window.innerHeight / dimension;

    setSize({ w: width, h: height });
  }

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
          {row.map((node) => (
            <span
              key={JSON.stringify(node)}
              onClick={() =>
                node.isWall ? null : setCoordinates(node.x, node.y)
              }
              style={{
                backgroundColor: node.isWall
                  ? "grey"
                  : matchCoordinates(node.x, node.y, startNode.x, startNode.y)
                  ? "blue"
                  : "red",
                width: `${size.w}px`,
                height: `${size.h}px`,
              }}
            >
              {node.distance}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
