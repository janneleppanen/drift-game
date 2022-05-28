import Car from "./car";
import Controls from "./controls";
import Road from "./road";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const car = new Car();
const road = new Road();

function animate(time = 0) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  ctx.save();

  car.update();

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
