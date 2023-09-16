import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  constructor() {}

  imageObject = [{
    image: 'assets/img/Slider-1.jpg',
    thumbImage: 'assets/img/Slider-1.jpg',
    title: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
}, {
    image: 'https://media.istockphoto.com/id/1408941133/photo/gluten-free-rice-flour-in-a-wooden-bowl.webp?b=1&s=170667a&w=0&k=20&c=LCC5lNHfCUywYqM8OMXTVMNhGm-O1QqGXIa4lha5MD8=',
    thumbImage: 'https://media.istockphoto.com/id/1408941133/photo/gluten-free-rice-flour-in-a-wooden-bowl.webp?b=1&s=170667a&w=0&k=20&c=LCC5lNHfCUywYqM8OMXTVMNhGm-O1QqGXIa4lha5MD8=',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
}, {
    image: 'https://img.freepik.com/free-photo/white-rice-flour-small-bowl-with-rice-plant_1150-34321.jpg',
    thumbImage: 'https://img.freepik.com/free-photo/white-rice-flour-small-bowl-with-rice-plant_1150-34321.jpg',
    title: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
}];

  ngOnInit(): void {}
   
}
