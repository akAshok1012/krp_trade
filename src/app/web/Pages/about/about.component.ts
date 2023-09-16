import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  unitCount = 0;
  workerCount = 0;
  tonCount = 0;
  factoryImg = "assets/img/about-section.jpg";

  constructor(){}

  ngOnInit(){
    this.updateCountWithAnimation();
  }

  updateCountWithAnimation(): void {
    const targetUnitCount = 3;
    const targetWorkerCount = 100;
    const targetTonCount = 720;

    const animationDuration = 5000; // 10 seconds in milliseconds
    const steps = 50; // Number of steps (frames) to achieve the desired duration
    const increment = {
      unit: targetUnitCount / steps,
      worker: targetWorkerCount / steps,
      ton: targetTonCount / steps
    };

    let currentStep = 0;

    const interval = setInterval(() => {
      this.unitCount += Math.floor(increment.unit);
      this.workerCount += Math.floor(increment.worker);
      this.tonCount += Math.floor(increment.ton);

      currentStep++;

      if (currentStep >= steps) {
        clearInterval(interval);
        this.unitCount = targetUnitCount;
        this.workerCount = targetWorkerCount;
        this.tonCount = targetTonCount;
      }
    }, animationDuration / steps);
  }

}

