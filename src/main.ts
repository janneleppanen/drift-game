import Car from "./car";
import Road from "./road";
import "./style.css";

const CAR_COUNT = 10;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const score = document.querySelector<HTMLSpanElement>(".score")!;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const road = new Road();
const cars: Car[] = [];
for (let i = 0; i < CAR_COUNT; i++) {
  const car = new Car(road);
  car.x = 0;
  car.angle = Math.PI;
  cars.push(car);
}

let bestCar = cars[0];

function animate(time = 0) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  cars.forEach((car) => car.update());

  ctx.save();
  ctx.translate(-bestCar.x + canvas.width / 2, -bestCar.y + canvas.height / 2);
  road.draw(ctx);
  cars.forEach((car) => car.draw(ctx, false));
  ctx.restore();

  score.innerHTML = bestCar.odometer.toFixed().toString();

  bestCar = cars.reduce((best, next) => {
    return best.odometer > next.odometer ? best : next;
  }, bestCar);

  requestAnimationFrame(animate);
}

animate();
