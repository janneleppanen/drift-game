import Car from "./car";
import { NeuralNetwork } from "./network";
import Road from "./road";
import "./style.css";
import "./game";

// const CAR_COUNT = 20;

// const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
// const score = document.querySelector<HTMLSpanElement>(".score")!;
// document
//   .querySelector<HTMLSpanElement>(".button-save")!
//   .addEventListener("click", save);
// document
//   .querySelector<HTMLSpanElement>(".button-reset")!
//   .addEventListener("click", reset);

// const ctx = canvas.getContext("2d")!;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// const road = new Road();
// const cars: Car[] = [];
// for (let i = 0; i < CAR_COUNT; i++) {
//   const car = new Car(road);
//   car.x = 0;
//   car.angle = Math.PI;
//   cars.push(car);
// }

// if (localStorage.getItem("bestAI")) {
//   for (let i = 0; i < cars.length; i++) {
//     const bestAI = JSON.parse(
//       localStorage.getItem("bestAI") || ""
//     ) as NeuralNetwork;
//     cars[i].brain = bestAI;

//     if (i != 0 && cars[i].brain) {
//       NeuralNetwork.mutate(cars[i].brain as NeuralNetwork, 0.2);
//     }
//   }
// }

// let bestCar = cars[0];

// function animate(time = 0) {
//   canvas.height = window.innerHeight;
//   canvas.width = window.innerWidth;

//   cars.forEach((car) => car.update());

//   ctx.save();
//   ctx.translate(-bestCar.x + canvas.width / 2, -bestCar.y + canvas.height / 2);
//   road.draw(ctx);
//   ctx.globalAlpha = 0.2;
//   cars.forEach((car) => car.draw(ctx, false));
//   ctx.globalAlpha = 1;
//   bestCar.draw(ctx, true);

//   ctx.restore();

//   score.innerHTML = bestCar.odometer.toFixed().toString();

//   bestCar = cars.reduce((best, next) => {
//     return best.odometer > next.odometer ? best : next;
//   }, bestCar);

//   requestAnimationFrame(animate);
// }

// function save() {
//   localStorage.setItem("bestAI", JSON.stringify(bestCar?.brain));
// }

// function reset() {
//   localStorage.removeItem("bestAI");
// }

// animate();
