import Car from "./car";
import Controls from "./controls";
import Road from "./road";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const score = document.querySelector<HTMLSpanElement>(".score")!;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const road = new Road();
const car = new Car(road);
car.x = 0;
car.angle = Math.PI;

function animate(time = 0) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  car.update();

  ctx.save();
  ctx.translate(-car.x + canvas.width / 2, -car.y + canvas.height / 2);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();

  score.innerHTML = car.odometer.toFixed().toString();

  requestAnimationFrame(animate);
}

animate();
