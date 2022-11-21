import React, { useCallback, useEffect, useState } from 'react';
import Snake from './Snake';
import Food from './Food';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

const App = () => {
  const [food, setFood] = useState(getRandomCoordinates());
  const [speed, setSpeed] = useState(100);
  const [direction, setDirection] = useState('RIGHT');
  const [snakeDots, setSnakeDots] = useState([[0,0], [2,0]]);

  const onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (direction === 'DOWN') break;
        setDirection('UP');
        break;
      case 40:
        if (direction === 'UP') break;
        setDirection('DOWN');
        break;
      case 37:
        if (direction === 'RIGHT') break;
        setDirection('LEFT');
        break;
      case 39:
        if (direction === 'LEFT') break;
        setDirection('RIGHT');
        break;
    }
  }
  
  const moveSnake = useCallback(() => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];

    switch (direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    setSnakeDots(dots)
  }, [snakeDots])

  const gameOver = () => {
    alert(`GAME OVER. Snake length is ${snakeDots.length}`);
    setFood(getRandomCoordinates());
    setSpeed(100);
    setDirection('RIGHT');
    setSnakeDots([[0,0], [2,0]]);
  }

  const checkIfOut = () => {
    let head = snakeDots[snakeDots.length - 1];

    if (head[0] >= 99 || head[1] >= 99 || head[0] < 0 || head[1] < 0) {
      gameOver();
    }
  }

  const checkIfHitItself = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        gameOver();
      }
    })
  }

  const checkIfFeeding = () => {
    let head = snakeDots[snakeDots.length - 1];
    let localFood = food;
    if (head[0] == localFood[0] && head[1] == localFood[1]) {
      setFood(getRandomCoordinates())
      enlargeSnake();
      increaseSpeed();
    }
  }

  const enlargeSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([])
    setSnakeDots(newSnake)
  }

  const increaseSpeed = () => {
    console.log(speed)
    if (speed > 30 && speed !== 61) {
      setSpeed(speed - 6)
    }

    if (speed < 30) {
      setSpeed(61)
    }
  }

  useEffect(() => {
    document.onkeydown = onKeyDown;
    const interval = setInterval(moveSnake, speed)

    return () => clearInterval(interval)
  }, [moveSnake])

  useEffect(() => {
    checkIfOut();
    checkIfHitItself();
    checkIfFeeding();
  }, [snakeDots]);
  

  return (
    <div className="game-area">
      <Snake snakeDots={snakeDots}/>
      <Food dot={food}/>
    </div>
  );
}

export default App;