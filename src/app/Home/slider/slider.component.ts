import { Component, Input } from '@angular/core';

import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

  imagesArray = [
    "'/assets/images/banner_1.jpg'",
    "'/assets/images/banner_2.jpg'",
    "'/assets/images/banner_3.jpg'"
  ]










}
